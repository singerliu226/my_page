const LEVEL = { shop: .20, cut: .17 };

export function createMusicController({ getContext, getSource, onState = () => {}, onError = () => {} }) {
  const page = typeof document === 'undefined' ? null : document;
  const buffers = new Map(), pending = new Map(), requests = new Map(), voices = new Map(), errors = new Set();
  let context, master, duckGain, duckTimer;
  let enabled = true, unlocked = false, scene = 'shop', destroyed = false, unavailable = false, revision = 0;
  const hidden = () => Boolean(page?.hidden);
  const canPlay = () => !destroyed && enabled && unlocked && !hidden();

  function getState() {
    return Object.freeze({
      enabled, unlocked, scene,
      playing: canPlay() && context?.state === 'running' && voices.size > 0,
      loaded: Object.freeze({ shop: buffers.has('shop'), cut: buffers.has('cut') }),
      contextState: context?.state || (unavailable ? 'unavailable' : 'uninitialized')
    });
  }
  function emit() { if (!destroyed) onState(getState()); }
  function report(key, error) {
    if (destroyed || errors.has(key)) return;
    errors.add(key);
    onError(error instanceof Error ? error : new Error(String(error)));
  }
  function gain(value, destination) {
    const node = context.createGain();
    node.gain.setValueAtTime(value, context.currentTime);
    node.connect(destination);
    return { node, ramp: [value, value, 0, 0] };
  }
  function fade(bus, target, seconds) {
    const now = context.currentTime, [from, to, start, end] = bus.ramp;
    const value = end > now ? from + (to - from) * Math.max(0, (now - start) / (end - start)) : to;
    bus.node.gain.cancelScheduledValues(now);
    bus.node.gain.setValueAtTime(value, now);
    bus.node.gain.linearRampToValueAtTime(target, now + seconds);
    bus.ramp = [value, target, now, now + seconds];
  }
  function ensureContext() {
    if (context) return;
    const next = getContext();
    if (!next?.createBufferSource || !next?.createGain || !next?.decodeAudioData) {
      unavailable = true;
      throw new Error('这台浏览器暂不支持背景音乐。');
    }
    context = next;
    duckGain = gain(1, context.destination);
    master = gain(0, duckGain.node);
    unavailable = false;
  }
  async function load(key) {
    if (buffers.has(key)) return buffers.get(key);
    if (pending.has(key)) return pending.get(key);
    const task = Promise.resolve().then(async () => {
      try {
        if (!canPlay()) return null;
        const abort = typeof AbortController === 'undefined' ? null : new AbortController();
        if (abort) requests.set(key, abort);
        const url = getSource(key);
        if (!url) throw new Error(`没有找到${key === 'shop' ? '小店' : '切豆腐'}音乐。`);
        const response = await fetch(url, abort ? { signal: abort.signal } : undefined);
        if (!response.ok) throw new Error(`背景音乐加载失败（${response.status}）。`);
        const buffer = await context.decodeAudioData(await response.arrayBuffer());
        if (!buffer?.length || !(buffer.duration > 0)) throw new Error('背景音乐文件无法播放。');
        if (!destroyed) buffers.set(key, buffer);
        errors.delete(`load:${key}`);
        return buffer;
      } catch (error) {
        if (error?.name !== 'AbortError') report(`load:${key}`, error);
        return null;
      } finally {
        pending.delete(key);
        requests.delete(key);
        emit();
      }
    });
    pending.set(key, task);
    return task;
  }
  function stop(key, voice) {
    clearTimeout(voice.timer);
    voice.source.onended = null;
    try { voice.source.stop(); } catch { /* 已结束的音源无需再次停止。 */ }
    voice.source.disconnect();
    voice.node.disconnect();
    if (voices.get(key) === voice) voices.delete(key);
  }
  async function reconcile() {
    const ticket = ++revision, key = scene;
    if (!canPlay() || context?.state !== 'running') return;
    const buffer = await load(key);
    if (!buffer || ticket !== revision || !canPlay() || context.state !== 'running') return;
    try {
      if (!voices.has(key)) {
        const voice = gain(0, master.node), source = context.createBufferSource();
        Object.assign(voice, { source });
        source.buffer = buffer;
        source.loop = true;
        source.loopStart = 0;
        source.loopEnd = buffer.duration;
        source.connect(voice.node);
        source.start();
        voices.set(key, voice);
      }
      for (const [name, voice] of voices) {
        clearTimeout(voice.timer);
        fade(voice, name === key ? LEVEL[name] : 0, 1);
        if (name !== key) voice.timer = setTimeout(() => { stop(name, voice); emit(); }, 1020);
      }
      fade(master, 1, .18);
      emit();
    } catch (error) { report('play', error); }
  }
  function wake() {
    if (destroyed || !unlocked || hidden()) return Promise.resolve();
    try {
      ensureContext();
      // 在手势处理函数里直接调用 resume，保留浏览器的播放许可。
      const resumed = context.state === 'running' ? Promise.resolve() : context.resume();
      return Promise.resolve(resumed).then(() => {
        errors.delete('context');
        emit();
        return reconcile();
      }).catch(error => { report('context', error); emit(); });
    } catch (error) {
      report('context', error);
      emit();
      return Promise.resolve();
    }
  }
  function unlock() {
    if (destroyed) return Promise.resolve();
    unlocked = true;
    const result = wake();
    emit();
    return result;
  }
  function setScene(key) {
    if (destroyed || (key !== 'shop' && key !== 'cut')) return;
    scene = key;
    void reconcile();
    emit();
  }
  function setEnabled(value) {
    if (destroyed) return;
    enabled = Boolean(value);
    ++revision;
    if (enabled) void wake();
    else if (master) fade(master, 0, .18);
    emit();
  }
  function duck() {
    if (!canPlay() || !duckGain) return;
    clearTimeout(duckTimer);
    fade(duckGain, .32, .02);
    duckTimer = setTimeout(() => { if (!destroyed) fade(duckGain, 1, .2); }, 140);
  }
  function visibilityChanged() {
    if (!unlocked || destroyed) return;
    ++revision;
    if (hidden()) {
      if (context && context.state !== 'closed') {
        try { Promise.resolve(context.suspend()).then(emit, error => report('context', error)); }
        catch (error) { report('context', error); }
      }
      emit();
    } else void wake();
  }
  page?.addEventListener('visibilitychange', visibilityChanged);
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    ++revision;
    clearTimeout(duckTimer);
    page?.removeEventListener('visibilitychange', visibilityChanged);
    for (const request of requests.values()) request.abort();
    for (const [key, voice] of voices) stop(key, voice);
    master?.node.disconnect();
    duckGain?.node.disconnect();
  }
  return { unlock, setScene, setEnabled, duck, getState, destroy };
}
