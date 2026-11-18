const BOARD = { x: 110, y: 110, size: 420, cell: 105 };
const LINES = [
  ...[215, 320, 425].map(at => ({ axis: 'h', at })),
  ...[215, 320, 425].map(at => ({ axis: 'v', at })),
];
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const ease = t => 1 - (1 - t) ** 3;

export function getGameView(viewportWidth = 1024, viewportHeight = Infinity) {
  return viewportWidth <= 800 || viewportHeight <= 500 ? { x: 70, y: 70, size: 500 } : { x: 40, y: 40, size: 560 };
}

export function pointerToBoard(point, rect, view) {
  return {
    x: view.x + (point.clientX - rect.left) * view.size / Math.max(1, rect.width),
    y: view.y + (point.clientY - rect.top) * view.size / Math.max(1, rect.height),
  };
}

/** Release speed uses CSS pixels per millisecond so a phone and mouse feel alike. */
export function getFlightProfile(dx, dy, releaseSpeed = .75) {
  const strength = clamp((releaseSpeed - .15) / 1.45, 0, 1);
  const velocity = 1030 + strength * 710;
  const length = Math.hypot(dx, dy) || 1;
  return {
    vx: dx / length * velocity,
    vy: dy / length * velocity,
    spin: (dx >= 0 ? 1 : -1) * (.95 + strength * 1.05),
    duration: 440 - strength * 130,
    gravity: 820,
  };
}

export function getBlockLabelLayout(label, cssScale = 1) {
  const chars = Array.from(label);
  const splitAt = chars.length > 4 ? Math.ceil(chars.length / 2) : chars.length;
  const lines = chars.length > 4 ? [chars.slice(0, splitAt).join(''), chars.slice(splitAt).join('')] : [label];
  // Four characters fit without Canvas's horizontal text compression.
  const fontSize = Math.min(96 / Math.max(...lines.map(line => Array.from(line).length), 1), Math.max(18, 14 / Math.max(cssScale, .1)));
  return { lines, fontSize, lineHeight: fontSize * 1.14 };
}

function roundPath(ctx, x, y, width, height, radius = 12) {
  const r = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function coveredLength(intervals) {
  const sorted = intervals.filter(([a, b]) => b > a).sort((a, b) => a[0] - b[0]);
  let total = 0;
  let start = -Infinity;
  let end = -Infinity;
  for (const [a, b] of sorted) {
    if (a > end) {
      if (end > -Infinity) total += end - start;
      start = a; end = b;
    } else end = Math.max(end, b);
  }
  if (end > -Infinity) total += end - start;
  return total;
}

function cutProgress(points, completed = new Set(), tolerance = 32) {
  if (points.length < 2) return [];
  return LINES.flatMap((line, index) => {
    if (completed.has(index)) return [];
    const along = line.axis === 'h' ? 'x' : 'y';
    const across = line.axis === 'h' ? 'y' : 'x';
    const intervals = [];
    for (let i = 1; i < points.length; i++) {
      const a = points[i - 1], b = points[i];
      const delta = b[across] - a[across];
      let lo = 0, hi = 1;
      if (Math.abs(delta) < 0.0001) {
        if (Math.abs(a[across] - line.at) > tolerance) continue;
      } else {
        const t1 = (line.at - tolerance - a[across]) / delta;
        const t2 = (line.at + tolerance - a[across]) / delta;
        lo = Math.max(0, Math.min(t1, t2));
        hi = Math.min(1, Math.max(t1, t2));
        if (hi < lo) continue;
      }
      const p = a[along] + (b[along] - a[along]) * lo;
      const q = a[along] + (b[along] - a[along]) * hi;
      intervals.push([clamp(Math.min(p, q), 110, 530), clamp(Math.max(p, q), 110, 530)]);
    }
    const length = coveredLength(intervals);
    return length > 0 ? [{ index, intervals, length }] : [];
  });
}

/** Returns only lines covered by this gesture; tiny taps and diagonal crossings never cut. */
export function findCompletedCuts(points, completed = new Set(), tolerance = 32) {
  return cutProgress(points, completed, tolerance).filter(line => line.length >= BOARD.size * .7).map(line => line.index);
}

export function isSuccessfulFlick(dx, dy, duration, recentSpeed = 0) {
  const distance = Math.hypot(dx, dy);
  const speed = Math.max(recentSpeed, distance / Math.max(duration, 16));
  return distance >= 55 || (distance >= 18 && speed >= 0.5);
}

export class TofuGame {
  constructor(options) {
    this.canvas = options.canvas;
    this.ctx = this.canvas.getContext('2d');
    this.callbacks = options;
    this.phase = 'cut';
    this.cuts = 0;
    this.removed = 0;
    this.blocks = [];
    this.items = [];
    this.listeners = false;
    this.raf = 0;
    this.view = Object.freeze(getGameView(typeof window === 'undefined' ? 1024 : window.innerWidth, typeof window === 'undefined' ? Infinity : window.innerHeight));
    this.cssScale = 1;
    this.reduced = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._down = this.pointerDown.bind(this);
    this._move = this.pointerMove.bind(this);
    this._up = this.pointerUp.bind(this);
    this._cancel = this.pointerCancel.bind(this);
    this._resize = this.resize.bind(this);
    this.canvas.style.touchAction = 'none';
    this.canvas.style.userSelect = 'none';
  }

  start(items) {
    this.destroy();
    this.active = true;
    this.items = items;
    this.cuts = 0;
    this.removed = 0;
    this.phase = 'cut';
    this.completedLines = new Set();
    this.partialCuts = new Map();
    this.activeGuide = null;
    this.particles = [];
    this.trail = [];
    this.pointer = null;
    this.revealAt = 0;
    this.flashAt = 0;
    this.demoAt = performance.now();
    this.demoDismissed = false;
    this.idle = false;
    this.slabTexture = this.makeSlabTexture();
    this.blocks = items.map((item, index) => ({
      item, index, x: 162.5 + (index % 4) * 105, y: 162.5 + Math.floor(index / 4) * 105,
      dx: 0, dy: 0, state: 'rest', progress: 0, rotation: 0,
      texture: this.makeTexture(index),
    }));
    this.canvas.addEventListener('pointerdown', this._down);
    this.canvas.addEventListener('pointermove', this._move);
    this.canvas.addEventListener('pointerup', this._up);
    this.canvas.addEventListener('pointercancel', this._cancel);
    this.canvas.addEventListener('lostpointercapture', this._cancel);
    window.addEventListener('resize', this._resize);
    this.listeners = true;
    this.resize();
    this.touchActivity();
    this.callbacks.onPhaseChange?.('cut');
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.max(1, Math.round((rect.width || 640) * dpr));
    const height = Math.max(1, Math.round((rect.height || rect.width || 640) * dpr));
    if (this.pointer) this.pointerCancel({ pointerId: this.pointer.id });
    this.view = Object.freeze(getGameView(window.innerWidth, window.innerHeight));
    this.cssScale = (rect.width || 640) / this.view.size;
    this.canvas.width = width;
    this.canvas.height = height;
    this.draw(performance.now());
  }

  getView() {
    return { ...this.view };
  }

  makeSlabTexture() {
    const surface = document.createElement('canvas');
    surface.width = 444; surface.height = 464;
    const c = surface.getContext('2d');
    c.fillStyle = '#94ac7d';
    roundPath(c, 12, 24, 420, 424, 28); c.fill();
    const fill = c.createLinearGradient(20, 5, 400, 440);
    fill.addColorStop(0, '#f1f3d5'); fill.addColorStop(.48, '#deebbc'); fill.addColorStop(1, '#c5dba5');
    c.fillStyle = fill;
    roundPath(c, 12, 8, 420, 420, 28); c.fill();
    c.save(); roundPath(c, 12, 8, 420, 420, 28); c.clip();
    let seed = 90283;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    for (let i = 0; i < 37; i++) {
      const x = 12 + random() * 420, y = 8 + random() * 420, r = 12 + random() * 32;
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(68,147,119,.25)'); g.addColorStop(1, 'rgba(68,147,119,0)');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    }
    for (let i = 0; i < 1900; i++) {
      const x = 12 + random() * 420, y = 8 + random() * 420;
      c.strokeStyle = random() > .5 ? 'rgba(255,255,233,.5)' : 'rgba(79,125,95,.14)';
      c.lineWidth = .6 + random() * .6;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + random() * 3 - 1.5, y - 2 - random() * 3); c.stroke();
    }
    c.restore();
    c.strokeStyle = 'rgba(255,255,236,.7)'; c.lineWidth = 3;
    roundPath(c, 13.5, 9.5, 417, 417, 27); c.stroke();
    return surface;
  }

  makeTexture(index) {
    const surface = document.createElement('canvas');
    surface.width = 115; surface.height = 128;
    const c = surface.getContext('2d');
    let seed = (index + 3) * 751;
    const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
    c.fillStyle = '#93ae7e';
    roundPath(c, 5, 13, 105, 111, 15); c.fill();
    const fill = c.createLinearGradient(0, 0, 90, 110);
    fill.addColorStop(0, '#edf2ca'); fill.addColorStop(0.6, '#d4e6b3'); fill.addColorStop(1, '#c1d5a1');
    c.fillStyle = fill;
    roundPath(c, 5, 3, 105, 109, 15); c.fill();
    c.save(); roundPath(c, 5, 3, 105, 109, 15); c.clip();
    for (let i = 0; i < 7; i++) {
      const x = random() * 110, y = random() * 110, r = 9 + random() * 13;
      const g = c.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, 'rgba(64,143,119,.27)'); g.addColorStop(1, 'rgba(64,143,119,0)');
      c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill();
    }
    for (let i = 0; i < 150; i++) {
      const x = 4 + random() * 108, y = 3 + random() * 109;
      c.strokeStyle = random() > 0.5 ? 'rgba(255,255,226,.43)' : 'rgba(85,129,100,.18)';
      c.lineWidth = 0.6 + random() * 0.6;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + random() * 3 - 1.5, y - 2 - random() * 3); c.stroke();
    }
    c.restore();
    c.strokeStyle = 'rgba(255,255,233,.7)'; c.lineWidth = 2;
    roundPath(c, 6, 4, 103, 106, 14); c.stroke();
    return surface;
  }

  position(event) {
    const rect = this.canvas.getBoundingClientRect();
    return { ...pointerToBoard(event, rect, this.view), t: performance.now() };
  }

  pointerDown(event) {
    if (!this.active || this.phase === 'done' || this.pointer || event.button > 0) return;
    event.preventDefault();
    this.touchActivity();
    const p = this.position(event);
    this.demoDismissed = true;
    let block = null;
    if (this.phase === 'throw') {
      block = [...this.blocks].reverse().find(b => b.state === 'rest' && Math.abs(p.x - this.blockPosition(b).x) <= 51 && Math.abs(p.y - this.blockPosition(b).y) <= 56);
      if (!block) return;
      block.state = 'drag';
      this.callbacks.onPreview?.({ item: block.item, index: block.index });
    }
    this.pointer = { id: event.pointerId, start: p, points: [p], block, cutsAtStart: this.cuts, cssScale: this.cssScale };
    if (!block) this.activeGuide = this.nearestGuide(p);
    try { this.canvas.setPointerCapture(event.pointerId); } catch { /* A detached canvas cannot capture. */ }
    this.canvas.style.cursor = block ? 'grabbing' : 'crosshair';
    this.trail = [p];
    this.requestDraw();
  }

  pointerMove(event) {
    if (!this.pointer || event.pointerId !== this.pointer.id) return;
    event.preventDefault();
    const p = this.position(event), pointer = this.pointer;
    pointer.points.push(p);
    if (pointer.points.length > 400) pointer.points.splice(1, 1);
    if (pointer.block) {
      pointer.block.dx = p.x - pointer.start.x;
      pointer.block.dy = p.y - pointer.start.y;
      pointer.block.rotation = clamp(pointer.block.dx / 900, -0.22, 0.22);
    } else {
      this.trail.push(p);
      if (this.trail.length > 20) this.trail.shift();
      const tolerance = clamp(20 / pointer.cssScale, 24, 48);
      const progress = cutProgress(pointer.points, this.completedLines, tolerance).sort((a, b) => b.length - a.length);
      this.activeGuide = progress[0]?.index ?? this.nearestGuide(p);
      for (const line of findCompletedCuts(pointer.points, this.completedLines, tolerance)) this.completeCut(line);
    }
    this.requestDraw();
  }

  pointerUp(event) {
    if (!this.pointer || event.pointerId !== this.pointer.id) return;
    event.preventDefault();
    const pointer = this.pointer, p = this.position(event);
    pointer.points.push(p);
    if (pointer.block) {
      const dx = p.x - pointer.start.x, dy = p.y - pointer.start.y;
      const recent = pointer.points.find(q => q.t >= p.t - 90) || pointer.start;
      const recentSpeed = Math.hypot(p.x - recent.x, p.y - recent.y) * pointer.cssScale / Math.max(16, p.t - recent.t);
      pointer.block.dx = dx; pointer.block.dy = dy;
      if (isSuccessfulFlick(dx * pointer.cssScale, dy * pointer.cssScale, p.t - pointer.start.t, recentSpeed)) {
        this.launch(pointer.block, dx, dy, p.t, recentSpeed);
      } else {
        pointer.block.state = 'return';
        pointer.block.returnX = dx; pointer.block.returnY = dy; pointer.block.startedAt = p.t;
        this.callbacks.onNudge?.('按住一块，往外一甩就好。');
      }
    } else if (this.phase === 'cut') {
      const tolerance = clamp(20 / pointer.cssScale, 24, 48);
      for (const line of findCompletedCuts(pointer.points, this.completedLines, tolerance)) this.completeCut(line);
      if (this.cuts === pointer.cutsAtStart) {
        const partial = cutProgress(pointer.points, this.completedLines, tolerance).sort((a, b) => b.length - a.length)[0];
        if (partial && partial.length * pointer.cssScale >= 8) {
          this.partialCuts.set(partial.index, partial.intervals);
          this.callbacks.onNudge?.('沿着这条线，从一边划到另一边就好。');
        }
      }
    }
    this.pointer = null;
    this.activeGuide = null;
    this.trail = [];
    this.callbacks.onPreview?.(null);
    this.canvas.style.cursor = this.phase === 'cut' ? 'crosshair' : 'grab';
    try { this.canvas.releasePointerCapture(event.pointerId); } catch { /* Capture may already be released. */ }
    this.requestDraw();
  }

  pointerCancel(event) {
    if (!this.pointer || (event.pointerId != null && event.pointerId !== this.pointer.id)) return;
    const block = this.pointer.block;
    if (block) { block.returnX = block.dx; block.returnY = block.dy; block.startedAt = performance.now(); block.state = 'return'; }
    this.pointer = null; this.trail = [];
    this.activeGuide = null;
    this.callbacks.onPreview?.(null);
    this.canvas.style.cursor = this.phase === 'cut' ? 'crosshair' : 'grab';
    this.requestDraw();
  }

  nearestGuide(point) {
    if (point.x < 90 || point.x > 550 || point.y < 90 || point.y > 550) return null;
    let nearest = null, distance = 48;
    LINES.forEach((line, index) => {
      const delta = Math.abs(point[line.axis === 'h' ? 'y' : 'x'] - line.at);
      if (!this.completedLines.has(index) && delta < distance) { nearest = index; distance = delta; }
    });
    return nearest;
  }

  completeCut(index) {
    if (this.phase !== 'cut' || this.completedLines.has(index)) return;
    this.completedLines.add(index); this.cuts = this.completedLines.size;
    this.partialCuts.delete(index);
    this.flashLine = index; this.flashAt = performance.now();
    const line = LINES[index];
    for (let i = 0; i < (this.reduced ? 3 : 14); i++) {
      const along = 125 + Math.random() * 390;
      this.particles.push({ x: line.axis === 'h' ? along : line.at, y: line.axis === 'h' ? line.at : along, vx: (Math.random() - 0.5) * 90, vy: -20 - Math.random() * 75, start: this.flashAt, life: 400 + Math.random() * 200, color: i % 3 ? '#e9f5c6' : '#77e2c5' });
    }
    this.callbacks.onCut?.({ count: this.cuts, total: 6 });
    this.callbacks.onGesture?.('cut');
    if (this.cuts === 6) {
      this.phase = 'throw'; this.revealAt = performance.now();
      this.canvas.style.cursor = 'grab';
      this.callbacks.onPhaseChange?.('throw');
    }
    this.touchActivity(); this.requestDraw();
  }

  cutNext() {
    if (!this.active || this.phase !== 'cut') return;
    const index = LINES.findIndex((_, i) => !this.completedLines.has(i));
    if (index >= 0) this.completeCut(index);
  }

  throwNext() {
    if (!this.active || this.phase !== 'throw') return;
    const block = this.blocks.find(b => b.state === 'rest');
    if (block) this.launch(block, block.index % 2 ? 180 : -180, -135, performance.now());
  }

  launch(block, dx, dy, now, releaseSpeed = .75) {
    if (!this.active || !['rest', 'drag'].includes(block.state)) return;
    block.state = 'fly'; block.startedAt = now;
    block.fromX = block.dx; block.fromY = block.dy;
    Object.assign(block, getFlightProfile(dx, dy, releaseSpeed));
    this.removed++;
    this.callbacks.onThrow?.({ item: block.item, index: block.index, removed: this.removed, total: 16 });
    this.callbacks.onGesture?.('throw');
    this.touchActivity(); this.requestDraw();
  }

  blockPosition(block) {
    const amount = this.phase === 'cut' ? 0 : ease(clamp((performance.now() - this.revealAt) / (this.reduced ? 1 : 340), 0, 1));
    return { x: block.x + ((block.index % 4) - 1.5) * 5 * amount, y: block.y + (Math.floor(block.index / 4) - 1.5) * 5 * amount };
  }

  touchActivity() {
    this.idle = false;
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      if (!this.active || this.phase === 'done') return;
      this.idle = true;
      this.callbacks.onNudge?.(this.phase === 'cut' ? '顺着虚线划过去，横着竖着都可以。' : '把烦恼往外甩，哪个方向都行。');
      this.requestDraw();
    }, 8000);
  }

  requestDraw() {
    if (!this.active || this.raf) return;
    this.raf = requestAnimationFrame(now => { this.raf = 0; this.draw(now); });
  }

  draw(now) {
    if (!this.ctx) return;
    const c = this.ctx;
    const { x, y, size } = this.view;
    c.setTransform(1, 0, 0, 1, 0, 0);
    c.clearRect(0, 0, this.canvas.width, this.canvas.height);
    c.setTransform(this.canvas.width / size, 0, 0, this.canvas.height / size, -x * this.canvas.width / size, -y * this.canvas.height / size);
    c.save();
    // A quiet enamel tray keeps the motion inside the shop's counter.
    c.shadowColor = 'rgba(0,0,0,.32)'; c.shadowBlur = 28; c.shadowOffsetY = 16;
    const tray = c.createLinearGradient(80, 70, 550, 590);
    tray.addColorStop(0, '#31434a'); tray.addColorStop(0.45, '#23363d'); tray.addColorStop(1, '#152a32');
    c.fillStyle = tray; roundPath(c, 77, 76, 486, 495, 38); c.fill();
    c.shadowBlur = 0; c.shadowOffsetY = 0;
    c.strokeStyle = 'rgba(150,204,190,.32)'; c.lineWidth = 2; roundPath(c, 78, 77, 484, 493, 38); c.stroke();
    c.strokeStyle = 'rgba(7,18,24,.7)'; c.lineWidth = 2; roundPath(c, 94, 94, 452, 459, 26); c.stroke();
    if (size > 500) {
      c.fillStyle = 'rgba(157,196,180,.12)';
      roundPath(c, 58, 260, 22, 116, 10); c.fill(); roundPath(c, 560, 260, 22, 116, 10); c.fill();
    }
    c.restore();
    if (!this.blocks?.length) return;
    const demo = !this.reduced && !this.demoDismissed && this.phase === 'cut' && this.cuts === 0 && now - this.demoAt < 1700;
    let animating = !!this.pointer || demo || (this.phase !== 'cut' && now - this.revealAt < 400) || (this.flashAt && now - this.flashAt < 450);
    const dragging = this.pointer?.block;
    if (this.phase === 'cut') {
      c.save();
      if (this.flashAt && !this.reduced) {
        const t = clamp((now - this.flashAt) / 340, 0, 1);
        const pulse = Math.sin(t * Math.PI * 2) * Math.exp(-t * 3);
        c.translate(320, 320); c.scale(1 + pulse * .018, 1 - pulse * .025); c.translate(-320, -320);
      }
      c.shadowColor = 'rgba(3,19,17,.3)'; c.shadowBlur = 14; c.shadowOffsetY = 10;
      c.drawImage(this.slabTexture, 98, 102);
      c.restore();
    } else {
      for (const block of this.blocks) {
        if (block !== dragging && block.state !== 'fly') animating = this.drawBlock(block, now) || animating;
      }
    }
    if (this.phase === 'cut') {
      c.save(); c.lineCap = 'round';
      for (let i = 0; i < LINES.length; i++) {
        const line = LINES[i], done = this.completedLines.has(i), active = i === this.activeGuide;
        c.setLineDash(done ? [] : [8, 10]);
        c.strokeStyle = done ? '#54785d' : active ? '#fff3d7' : this.idle ? '#ffe4ee' : '#f5afce';
        c.lineWidth = done ? 4 : active ? 4 : this.idle ? 3 : 2.5;
        c.beginPath();
        if (line.axis === 'h') { c.moveTo(90, line.at); c.lineTo(550, line.at); }
        else { c.moveTo(line.at, 90); c.lineTo(line.at, 550); }
        c.stroke();
      }
      c.setLineDash([]); c.lineWidth = 4.5; c.strokeStyle = '#6b885e';
      for (const [index, intervals] of this.partialCuts) {
        const line = LINES[index];
        c.beginPath();
        for (const [a, b] of intervals) {
          if (line.axis === 'h') { c.moveTo(a, line.at); c.lineTo(b, line.at); }
          else { c.moveTo(line.at, a); c.lineTo(line.at, b); }
        }
        c.stroke();
      }
      c.restore();
      if (demo) {
        const t = clamp((now - this.demoAt - 350) / 1000, 0, 1);
        const end = 115 + ease(t) * 410;
        c.save(); c.globalAlpha = Math.sin(Math.PI * t) * .7;
        c.strokeStyle = '#fff8e4'; c.lineWidth = 4; c.lineCap = 'round';
        c.beginPath(); c.moveTo(Math.max(115, end - 80), 215); c.lineTo(end, 215); c.stroke();
        c.fillStyle = '#fff8e4'; c.beginPath(); c.arc(end, 215, 5.5, 0, Math.PI * 2); c.fill(); c.restore();
      }
    }
    if (this.flashAt && now - this.flashAt < 280) {
      const line = LINES[this.flashLine];
      c.save(); c.globalAlpha = 1 - (now - this.flashAt) / 280;
      c.strokeStyle = '#faffdc'; c.lineWidth = 5; c.shadowBlur = 14; c.shadowColor = '#c3ffda';
      c.beginPath(); if (line.axis === 'h') { c.moveTo(90, line.at); c.lineTo(550, line.at); } else { c.moveTo(line.at, 90); c.lineTo(line.at, 550); } c.stroke(); c.restore();
    }
    for (const block of this.blocks) if (block.state === 'fly') animating = this.drawBlock(block, now) || animating;
    if (dragging) animating = this.drawBlock(dragging, now) || animating;
    this.particles = this.particles.filter(p => now - p.start < p.life);
    for (const p of this.particles) {
      const t = (now - p.start) / 1000, alpha = 1 - (now - p.start) / p.life;
      c.save(); c.globalAlpha = alpha; c.fillStyle = p.color;
      c.beginPath(); c.arc(p.x + p.vx * t, p.y + p.vy * t + 140 * t * t, 2.2 * alpha + 0.5, 0, Math.PI * 2); c.fill(); c.restore();
    }
    if (this.particles.length) animating = true;
    if (this.trail.length > 1) {
      c.save(); c.strokeStyle = 'rgba(247,252,225,.85)'; c.lineWidth = 3; c.lineJoin = 'round'; c.lineCap = 'round';
      c.shadowColor = '#a9fbe3'; c.shadowBlur = 12;
      c.beginPath(); this.trail.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)); c.stroke(); c.restore();
    }
    if (this.active && this.phase === 'throw' && this.removed === 16 && this.blocks.every(b => b.state === 'gone')) {
      this.phase = 'done'; clearTimeout(this.idleTimer);
      this.callbacks.onPhaseChange?.('done');
      this.callbacks.onComplete?.();
      return;
    }
    if (animating) this.requestDraw();
  }

  drawBlock(block, now) {
    if (block.state === 'gone') return false;
    let alpha = 1, animating = false;
    if (block.state === 'fly') {
      const t = clamp((now - block.startedAt) / (this.reduced ? 180 : block.duration), 0, 1);
      if (t >= 1) { block.state = 'gone'; return false; }
      const seconds = t * block.duration / 1000;
      block.dx = block.fromX + block.vx * seconds;
      block.dy = block.fromY + block.vy * seconds + block.gravity * seconds * seconds / 2;
      block.rotation = block.spin * t;
      alpha = 1 - t ** 2; animating = true;
    } else if (block.state === 'return') {
      const t = clamp((now - block.startedAt) / (this.reduced ? 100 : 280), 0, 1);
      const amount = (1 - t) ** 2 * Math.cos(t * Math.PI * 1.4);
      block.dx = block.returnX * amount; block.dy = block.returnY * amount; block.rotation *= 0.8;
      if (t >= 1) { block.dx = 0; block.dy = 0; block.rotation = 0; block.state = 'rest'; }
      else animating = true;
    }
    const p = this.blockPosition(block), c = this.ctx;
    c.save(); c.globalAlpha = alpha;
    c.translate(p.x + block.dx, p.y + block.dy);
    c.rotate(block.rotation);
    if (block.state === 'drag') c.scale(1.06, 1.06);
    const size = this.phase === 'cut' ? 106 : 100;
    c.shadowColor = 'rgba(3,19,17,.32)'; c.shadowBlur = block.state === 'drag' ? 18 : 7; c.shadowOffsetY = block.state === 'drag' ? 15 : 5;
    c.drawImage(block.texture, -size / 2 - 4, -size / 2 - 3, size + 8, size + 18);
    c.shadowBlur = 0; c.shadowOffsetY = 0;
    if (this.phase !== 'cut') {
      const reveal = clamp((now - this.revealAt - 120) / (this.reduced ? 1 : 260), 0, 1);
      c.globalAlpha = alpha * reveal;
      c.fillStyle = '#304d3f';
      const label = block.item.badLuck;
      const layout = getBlockLabelLayout(label, this.cssScale);
      c.font = `600 ${layout.fontSize}px "PingFang SC", "Microsoft YaHei", sans-serif`;
      c.textAlign = 'center'; c.textBaseline = 'middle';
      layout.lines.forEach((line, index) => c.fillText(line, 0, 3 + (index - (layout.lines.length - 1) / 2) * layout.lineHeight));
      c.strokeStyle = 'rgba(84,116,80,.23)'; c.lineWidth = 1;
      const underlineY = layout.lines.length > 1 ? 33 : 25;
      c.beginPath(); c.moveTo(-19, underlineY); c.lineTo(19, underlineY); c.stroke();
    }
    c.restore();
    return animating;
  }

  destroy() {
    this.active = false;
    cancelAnimationFrame(this.raf); this.raf = 0;
    clearTimeout(this.idleTimer);
    if (this.listeners) {
      this.canvas.removeEventListener('pointerdown', this._down);
      this.canvas.removeEventListener('pointermove', this._move);
      this.canvas.removeEventListener('pointerup', this._up);
      this.canvas.removeEventListener('pointercancel', this._cancel);
      this.canvas.removeEventListener('lostpointercapture', this._cancel);
      window.removeEventListener('resize', this._resize);
      this.listeners = false;
    }
    this.pointer = null; this.trail = [];
    this.activeGuide = null;
    this.callbacks.onPreview?.(null);
  }
}
