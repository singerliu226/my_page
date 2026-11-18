/* 鹅羽鮨 · 单机包运行时
 *
 * 正式版鹅羽鮨是一个常驻的 Node 服务（server.js + WebSocket）。个人主页是纯静态站，跑不了它，
 * 所以单机包的做法是：把 server.js 原文放进网页里运行，这里只补它用到的那几样 Node 接口，
 * 再接一条“页面内的网线”，让游戏客户端的 WebSocket 直接连到同一页面里的这家店。
 * 游戏规则、电脑客人、叫号和出餐逻辑都是 server.js 自己的，没有另写一份。
 *
 * sync.mjs 会把下面的 __EYU_MODULES__ 换成 server.js、shared/world.js、shared/menu.js 的原文。
 */
(function (root) {
  'use strict';

  // ---------- 页面内的网线：消息按发出的顺序，在当前调用栈结束后送达 ----------
  function post(fn) {
    Promise.resolve().then(function () {
      try { fn(); } catch (err) { console.error('[鹅羽鮨·单机]', err); }
    });
  }

  function Emitter() { this._handlers = {}; }
  Emitter.prototype.on = function (name, fn) {
    (this._handlers[name] || (this._handlers[name] = [])).push(fn);
    return this;
  };
  Emitter.prototype.emit = function (name, a, b) {
    var list = this._handlers[name];
    if (!list) return false;
    list.slice().forEach(function (fn) { fn(a, b); });
    return true;
  };

  // ---------- 服务端看到的 ws 接口（只实现 server.js 用到的部分） ----------
  var wss = null;

  function WebSocketServer() {
    Emitter.call(this);
    this.clients = new Set();
    wss = this;
  }
  WebSocketServer.prototype = Object.create(Emitter.prototype);

  function ServerSocket(peer) {
    Emitter.call(this);
    this._peer = peer;
    this.readyState = 1;
  }
  ServerSocket.prototype = Object.create(Emitter.prototype);
  ServerSocket.prototype.send = function (data) {
    if (this.readyState !== 1) return;
    var peer = this._peer, text = String(data);
    post(function () { peer._receive(text); });
  };
  ServerSocket.prototype.ping = function () {
    var self = this;
    post(function () { if (self.readyState === 1) self.emit('pong'); });
  };
  ServerSocket.prototype._end = function (code, tellPeer) {
    if (this.readyState === 3) return;
    this.readyState = 3;
    if (wss) wss.clients.delete(this);
    var self = this, peer = this._peer;
    post(function () { self.emit('close', code); });
    if (tellPeer) post(function () { peer._closed(code); });
  };
  ServerSocket.prototype.close = function (code) { this._end(code || 1000, true); };
  ServerSocket.prototype.terminate = function () { this._end(1006, true); };

  // ---------- 客户端看到的 WebSocket ----------
  function SoloSocket(url) {
    this.url = String(url);
    this.readyState = 0;
    this.bufferedAmount = 0;
    this.protocol = '';
    this.extensions = '';
    this.binaryType = 'blob';
    this.onopen = this.onmessage = this.onclose = this.onerror = null;
    this._listeners = {};
    var self = this;
    post(function () {
      if (self.readyState !== 0) return;
      if (!wss) { self._closed(1006); return; }
      self.readyState = 1;
      var server = self._server = new ServerSocket(self);
      wss.clients.add(server);
      wss.emit('connection', server, {
        url: '/ws',
        headers: { 'user-agent': root.navigator ? root.navigator.userAgent : '', host: root.location ? root.location.host : '' },
        socket: { remoteAddress: '127.0.0.1' }
      });
      self._fire('open', { type: 'open', target: self });
    });
  }
  SoloSocket.CONNECTING = 0; SoloSocket.OPEN = 1; SoloSocket.CLOSING = 2; SoloSocket.CLOSED = 3;
  SoloSocket.prototype.CONNECTING = 0; SoloSocket.prototype.OPEN = 1; SoloSocket.prototype.CLOSING = 2; SoloSocket.prototype.CLOSED = 3;
  SoloSocket.prototype.addEventListener = function (name, fn) {
    (this._listeners[name] || (this._listeners[name] = [])).push(fn);
  };
  SoloSocket.prototype.removeEventListener = function (name, fn) {
    var list = this._listeners[name];
    if (list) this._listeners[name] = list.filter(function (f) { return f !== fn; });
  };
  SoloSocket.prototype._fire = function (name, event) {
    var handler = this['on' + name];
    if (typeof handler === 'function') handler.call(this, event);
    (this._listeners[name] || []).slice().forEach(function (fn) { fn.call(this, event); }, this);
  };
  SoloSocket.prototype.send = function (data) {
    if (this.readyState !== 1 || !this._server) return;
    var server = this._server, text = String(data);
    post(function () { if (server.readyState === 1) server.emit('message', text, false); });
  };
  SoloSocket.prototype.close = function (code) {
    if (this.readyState >= 2) return;
    this.readyState = 2;
    var self = this, server = this._server;
    post(function () {
      if (server) server._end(code || 1000, false);
      self._closed(code || 1000);
    });
  };
  SoloSocket.prototype._receive = function (text) {
    if (this.readyState === 1) this._fire('message', { type: 'message', data: text, target: this });
  };
  SoloSocket.prototype._closed = function (code) {
    if (this.readyState === 3) return;
    this.readyState = 3;
    this._fire('close', { type: 'close', code: code, reason: '', wasClean: code === 1000, target: this });
  };

  // ---------- server.js 用到的 Node 模块：静态文件、压缩、落盘在单机包里都用不上 ----------
  function unavailable(name) {
    return function () { throw new Error('单机包里没有 ' + name); };
  }
  var proc = {
    env: {},
    argv: [],
    pid: 1,
    platform: 'browser',
    on: function () { return proc; },
    exit: function () {},
    uptime: function () { return (Date.now() - bootAt) / 1000; },
    memoryUsage: function () { return { rss: 0, heapTotal: 0, heapUsed: 0, external: 0 }; }
  };
  var bootAt = Date.now();
  var builtins = {
    http: {
      createServer: function () {
        return {
          listen: function () {
            var cb = arguments[arguments.length - 1];
            if (typeof cb === 'function') setTimeout(cb, 0);
            return this;
          },
          on: function () { return this; },
          close: function () {}
        };
      }
    },
    fs: {
      readFileSync: unavailable('fs.readFileSync'),
      stat: function (file, cb) { cb(new Error('ENOENT')); },
      existsSync: function () { return false; }
    },
    path: {
      join: function () { return Array.prototype.join.call(arguments, '/').replace(/\/+/g, '/'); },
      extname: function (file) { var m = /\.[^./]*$/.exec(String(file)); return m ? m[0] : ''; }
    },
    zlib: {
      constants: {},
      gzipSync: unavailable('zlib.gzipSync'),
      brotliCompressSync: unavailable('zlib.brotliCompressSync')
    },
    crypto: {
      randomBytes: function (n) {
        var bytes = new Uint8Array(n);
        if (root.crypto && root.crypto.getRandomValues) root.crypto.getRandomValues(bytes);
        else for (var i = 0; i < n; i++) bytes[i] = Math.floor(Math.random() * 256);
        return {
          toString: function () {
            var out = '';
            for (var j = 0; j < bytes.length; j++) out += (bytes[j] < 16 ? '0' : '') + bytes[j].toString(16);
            return out;
          }
        };
      },
      createHash: unavailable('crypto.createHash')
    },
    ws: { WebSocketServer: WebSocketServer },
    // 经营看板（/admin）只在联机版里有；这里留空接口，server.js 照常调用即可
    './stats.js': {
      init: function () {},
      tap: function () {},
      conn: function () {},
      http: function () { return false; },
      flush: function () {},
      classify: function () { return ''; }
    }
  };

  var sources = {};
  /* __EYU_MODULES__ */

  var loaded = {};
  function requireModule(id) {
    if (Object.prototype.hasOwnProperty.call(builtins, id)) return builtins[id];
    if (loaded[id]) return loaded[id].exports;
    if (!sources[id]) throw new Error('单机包里没有模块 ' + id);
    var module = loaded[id] = { exports: {} };
    sources[id].call(module.exports, module, module.exports, requireModule, '/', '/' + id, proc);
    return module.exports;
  }

  // 游戏出错时会把现场发到 /api/diag；单机包没有这个接口，改成只在控制台留一条
  if (root.navigator && typeof root.navigator.sendBeacon === 'function') {
    var beacon = root.navigator.sendBeacon.bind(root.navigator);
    try {
      root.navigator.sendBeacon = function (url, data) {
        if (String(url).indexOf('/api/diag') === 0) { console.warn('[鹅羽鮨·单机] 现场记录', data); return true; }
        return beacon(url, data);
      };
    } catch (err) { /* 改不了就算了：最多多一次 404 请求 */ }
  }

  root.WebSocket = SoloSocket;
  root.EyuSolo = { startedAt: bootAt, sockets: function () { return wss ? wss.clients.size : 0; } };
  requireModule('./server.js');
})(window);
