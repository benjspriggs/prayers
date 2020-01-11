// pouchdb-find plugin 7.1.1
// Based on Mango: https://github.com/cloudant/mango
//
// (c) 2012-2019 Dale Harvey and the PouchDB team
// PouchDB may be freely distributed under the Apache license, version 2.0.
// For all details and documentation:
// http://pouchdb.com
!(function o(u, s, a) {
  function f(t, e) {
    if (!s[t]) {
      if (!u[t]) {
        var n = "function" == typeof require && require;
        if (!e && n) return n(t, !0);
        if (c) return c(t, !0);
        var r = new Error("Cannot find module '" + t + "'");
        throw ((r.code = "MODULE_NOT_FOUND"), r);
      }
      var i = (s[t] = { exports: {} });
      u[t][0].call(
        i.exports,
        function(e) {
          return f(u[t][1][e] || e);
        },
        i,
        i.exports,
        o,
        u,
        s,
        a
      );
    }
    return s[t].exports;
  }
  for (
    var c = "function" == typeof require && require, e = 0;
    e < a.length;
    e++
  )
    f(a[e]);
  return f;
})(
  {
    1: [
      function(e, t, n) {
        "use strict";
        t.exports = function(r) {
          return function() {
            var e = arguments.length;
            if (e) {
              for (var t = [], n = -1; ++n < e; ) t[n] = arguments[n];
              return r.call(this, t);
            }
            return r.call(this, []);
          };
        };
      },
      {}
    ],
    2: [
      function(e, t, n) {
        var a =
            Object.create ||
            function(e) {
              function t() {}
              return (t.prototype = e), new t();
            },
          u =
            Object.keys ||
            function(e) {
              var t = [];
              for (var n in e)
                Object.prototype.hasOwnProperty.call(e, n) && t.push(n);
              return n;
            },
          o =
            Function.prototype.bind ||
            function(e) {
              var t = this;
              return function() {
                return t.apply(e, arguments);
              };
            };
        function r() {
          (this._events &&
            Object.prototype.hasOwnProperty.call(this, "_events")) ||
            ((this._events = a(null)), (this._eventsCount = 0)),
            (this._maxListeners = this._maxListeners || void 0);
        }
        (((t.exports = r).EventEmitter = r).prototype._events = void 0),
          (r.prototype._maxListeners = void 0);
        var i,
          s = 10;
        try {
          var f = {};
          Object.defineProperty && Object.defineProperty(f, "x", { value: 0 }),
            (i = 0 === f.x);
        } catch (e) {
          i = !1;
        }
        function c(e) {
          return void 0 === e._maxListeners
            ? r.defaultMaxListeners
            : e._maxListeners;
        }
        function l(e, t, n, r) {
          var i, o, u;
          if ("function" != typeof n)
            throw new TypeError('"listener" argument must be a function');
          if (
            ((o = e._events)
              ? (o.newListener &&
                  (e.emit("newListener", t, n.listener ? n.listener : n),
                  (o = e._events)),
                (u = o[t]))
              : ((o = e._events = a(null)), (e._eventsCount = 0)),
            u)
          ) {
            if (
              ("function" == typeof u
                ? (u = o[t] = r ? [n, u] : [u, n])
                : r
                ? u.unshift(n)
                : u.push(n),
              !u.warned && (i = c(e)) && 0 < i && u.length > i)
            ) {
              u.warned = !0;
              var s = new Error(
                "Possible EventEmitter memory leak detected. " +
                  u.length +
                  ' "' +
                  String(t) +
                  '" listeners added. Use emitter.setMaxListeners() to increase limit.'
              );
              (s.name = "MaxListenersExceededWarning"),
                (s.emitter = e),
                (s.type = t),
                (s.count = u.length),
                "object" == typeof console &&
                  console.warn &&
                  console.warn("%s: %s", s.name, s.message);
            }
          } else (u = o[t] = n), ++e._eventsCount;
          return e;
        }
        function d() {
          if (!this.fired)
            switch (
              (this.target.removeListener(this.type, this.wrapFn),
              (this.fired = !0),
              arguments.length)
            ) {
              case 0:
                return this.listener.call(this.target);
              case 1:
                return this.listener.call(this.target, arguments[0]);
              case 2:
                return this.listener.call(
                  this.target,
                  arguments[0],
                  arguments[1]
                );
              case 3:
                return this.listener.call(
                  this.target,
                  arguments[0],
                  arguments[1],
                  arguments[2]
                );
              default:
                for (
                  var e = new Array(arguments.length), t = 0;
                  t < e.length;
                  ++t
                )
                  e[t] = arguments[t];
                this.listener.apply(this.target, e);
            }
        }
        function h(e, t, n) {
          var r = {
              fired: !1,
              wrapFn: void 0,
              target: e,
              type: t,
              listener: n
            },
            i = o.call(d, r);
          return (i.listener = n), (r.wrapFn = i);
        }
        function p(e, t, n) {
          var r = e._events;
          if (!r) return [];
          var i = r[t];
          return i
            ? "function" == typeof i
              ? n
                ? [i.listener || i]
                : [i]
              : n
              ? (function(e) {
                  for (var t = new Array(e.length), n = 0; n < t.length; ++n)
                    t[n] = e[n].listener || e[n];
                  return t;
                })(i)
              : v(i, i.length)
            : [];
        }
        function y(e) {
          var t = this._events;
          if (t) {
            var n = t[e];
            if ("function" == typeof n) return 1;
            if (n) return n.length;
          }
          return 0;
        }
        function v(e, t) {
          for (var n = new Array(t), r = 0; r < t; ++r) n[r] = e[r];
          return n;
        }
        i
          ? Object.defineProperty(r, "defaultMaxListeners", {
              enumerable: !0,
              get: function() {
                return s;
              },
              set: function(e) {
                if ("number" != typeof e || e < 0 || e != e)
                  throw new TypeError(
                    '"defaultMaxListeners" must be a positive number'
                  );
                s = e;
              }
            })
          : (r.defaultMaxListeners = s),
          (r.prototype.setMaxListeners = function(e) {
            if ("number" != typeof e || e < 0 || isNaN(e))
              throw new TypeError('"n" argument must be a positive number');
            return (this._maxListeners = e), this;
          }),
          (r.prototype.getMaxListeners = function() {
            return c(this);
          }),
          (r.prototype.emit = function(e, t, n, r) {
            var i,
              o,
              u,
              s,
              a,
              f,
              c = "error" === e;
            if ((f = this._events)) c = c && null == f.error;
            else if (!c) return !1;
            if (c) {
              if ((1 < arguments.length && (i = t), i instanceof Error))
                throw i;
              var l = new Error('Unhandled "error" event. (' + i + ")");
              throw ((l.context = i), l);
            }
            if (!(o = f[e])) return !1;
            var d = "function" == typeof o;
            switch ((u = arguments.length)) {
              case 1:
                !(function(e, t, n) {
                  if (t) e.call(n);
                  else
                    for (var r = e.length, i = v(e, r), o = 0; o < r; ++o)
                      i[o].call(n);
                })(o, d, this);
                break;
              case 2:
                !(function(e, t, n, r) {
                  if (t) e.call(n, r);
                  else
                    for (var i = e.length, o = v(e, i), u = 0; u < i; ++u)
                      o[u].call(n, r);
                })(o, d, this, t);
                break;
              case 3:
                !(function(e, t, n, r, i) {
                  if (t) e.call(n, r, i);
                  else
                    for (var o = e.length, u = v(e, o), s = 0; s < o; ++s)
                      u[s].call(n, r, i);
                })(o, d, this, t, n);
                break;
              case 4:
                !(function(e, t, n, r, i, o) {
                  if (t) e.call(n, r, i, o);
                  else
                    for (var u = e.length, s = v(e, u), a = 0; a < u; ++a)
                      s[a].call(n, r, i, o);
                })(o, d, this, t, n, r);
                break;
              default:
                for (s = new Array(u - 1), a = 1; a < u; a++)
                  s[a - 1] = arguments[a];
                !(function(e, t, n, r) {
                  if (t) e.apply(n, r);
                  else
                    for (var i = e.length, o = v(e, i), u = 0; u < i; ++u)
                      o[u].apply(n, r);
                })(o, d, this, s);
            }
            return !0;
          }),
          (r.prototype.on = r.prototype.addListener = function(e, t) {
            return l(this, e, t, !1);
          }),
          (r.prototype.prependListener = function(e, t) {
            return l(this, e, t, !0);
          }),
          (r.prototype.once = function(e, t) {
            if ("function" != typeof t)
              throw new TypeError('"listener" argument must be a function');
            return this.on(e, h(this, e, t)), this;
          }),
          (r.prototype.prependOnceListener = function(e, t) {
            if ("function" != typeof t)
              throw new TypeError('"listener" argument must be a function');
            return this.prependListener(e, h(this, e, t)), this;
          }),
          (r.prototype.removeListener = function(e, t) {
            var n, r, i, o, u;
            if ("function" != typeof t)
              throw new TypeError('"listener" argument must be a function');
            if (!(r = this._events)) return this;
            if (!(n = r[e])) return this;
            if (n === t || n.listener === t)
              0 == --this._eventsCount
                ? (this._events = a(null))
                : (delete r[e],
                  r.removeListener &&
                    this.emit("removeListener", e, n.listener || t));
            else if ("function" != typeof n) {
              for (i = -1, o = n.length - 1; 0 <= o; o--)
                if (n[o] === t || n[o].listener === t) {
                  (u = n[o].listener), (i = o);
                  break;
                }
              if (i < 0) return this;
              0 === i
                ? n.shift()
                : (function(e, t) {
                    for (
                      var n = t, r = n + 1, i = e.length;
                      r < i;
                      n += 1, r += 1
                    )
                      e[n] = e[r];
                    e.pop();
                  })(n, i),
                1 === n.length && (r[e] = n[0]),
                r.removeListener && this.emit("removeListener", e, u || t);
            }
            return this;
          }),
          (r.prototype.removeAllListeners = function(e) {
            var t, n, r;
            if (!(n = this._events)) return this;
            if (!n.removeListener)
              return (
                0 === arguments.length
                  ? ((this._events = a(null)), (this._eventsCount = 0))
                  : n[e] &&
                    (0 == --this._eventsCount
                      ? (this._events = a(null))
                      : delete n[e]),
                this
              );
            if (0 === arguments.length) {
              var i,
                o = u(n);
              for (r = 0; r < o.length; ++r)
                "removeListener" !== (i = o[r]) && this.removeAllListeners(i);
              return (
                this.removeAllListeners("removeListener"),
                (this._events = a(null)),
                (this._eventsCount = 0),
                this
              );
            }
            if ("function" == typeof (t = n[e])) this.removeListener(e, t);
            else if (t)
              for (r = t.length - 1; 0 <= r; r--) this.removeListener(e, t[r]);
            return this;
          }),
          (r.prototype.listeners = function(e) {
            return p(this, e, !0);
          }),
          (r.prototype.rawListeners = function(e) {
            return p(this, e, !1);
          }),
          (r.listenerCount = function(e, t) {
            return "function" == typeof e.listenerCount
              ? e.listenerCount(t)
              : y.call(e, t);
          }),
          (r.prototype.listenerCount = y),
          (r.prototype.eventNames = function() {
            return 0 < this._eventsCount ? Reflect.ownKeys(this._events) : [];
          });
      },
      {}
    ],
    3: [
      function(e, c, t) {
        (function(t) {
          "use strict";
          var n,
            r,
            e = t.MutationObserver || t.WebKitMutationObserver;
          if (e) {
            var i = 0,
              o = new e(f),
              u = t.document.createTextNode("");
            o.observe(u, { characterData: !0 }),
              (n = function() {
                u.data = i = ++i % 2;
              });
          } else if (t.setImmediate || void 0 === t.MessageChannel)
            n =
              "document" in t &&
              "onreadystatechange" in t.document.createElement("script")
                ? function() {
                    var e = t.document.createElement("script");
                    (e.onreadystatechange = function() {
                      f(),
                        (e.onreadystatechange = null),
                        e.parentNode.removeChild(e),
                        (e = null);
                    }),
                      t.document.documentElement.appendChild(e);
                  }
                : function() {
                    setTimeout(f, 0);
                  };
          else {
            var s = new t.MessageChannel();
            (s.port1.onmessage = f),
              (n = function() {
                s.port2.postMessage(0);
              });
          }
          var a = [];
          function f() {
            var e, t;
            r = !0;
            for (var n = a.length; n; ) {
              for (t = a, a = [], e = -1; ++e < n; ) t[e]();
              n = a.length;
            }
            r = !1;
          }
          c.exports = function(e) {
            1 !== a.push(e) || r || n();
          };
        }.call(
          this,
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        ));
      },
      {}
    ],
    4: [
      function(e, t, n) {
        "function" == typeof Object.create
          ? (t.exports = function(e, t) {
              (e.super_ = t),
                (e.prototype = Object.create(t.prototype, {
                  constructor: {
                    value: e,
                    enumerable: !1,
                    writable: !0,
                    configurable: !0
                  }
                }));
            })
          : (t.exports = function(e, t) {
              e.super_ = t;
              function n() {}
              (n.prototype = t.prototype),
                (e.prototype = new n()),
                (e.prototype.constructor = e);
            });
      },
      {}
    ],
    5: [
      function(e, n, r) {
        !(function(e) {
          if ("object" == typeof r) n.exports = e();
          else if ("function" == typeof define && define.amd) define(e);
          else {
            var t;
            try {
              t = window;
            } catch (e) {
              t = self;
            }
            t.SparkMD5 = e();
          }
        })(function(f) {
          "use strict";
          var r = [
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "a",
            "b",
            "c",
            "d",
            "e",
            "f"
          ];
          function c(e, t) {
            var n = e[0],
              r = e[1],
              i = e[2],
              o = e[3];
            (r =
              ((((r +=
                ((((i =
                  ((((i +=
                    ((((o =
                      ((((o +=
                        ((((n =
                          ((((n +=
                            (((r & i) | (~r & o)) + t[0] - 680876936) | 0) <<
                            7) |
                            (n >>> 25)) +
                            r) |
                          0) &
                          r) |
                          (~n & i)) +
                          t[1] -
                          389564586) |
                        0) <<
                        12) |
                        (o >>> 20)) +
                        n) |
                      0) &
                      n) |
                      (~o & r)) +
                      t[2] +
                      606105819) |
                    0) <<
                    17) |
                    (i >>> 15)) +
                    o) |
                  0) &
                  o) |
                  (~i & n)) +
                  t[3] -
                  1044525330) |
                0) <<
                22) |
                (r >>> 10)) +
                i) |
              0),
              (r =
                ((((r +=
                  ((((i =
                    ((((i +=
                      ((((o =
                        ((((o +=
                          ((((n =
                            ((((n +=
                              (((r & i) | (~r & o)) + t[4] - 176418897) | 0) <<
                              7) |
                              (n >>> 25)) +
                              r) |
                            0) &
                            r) |
                            (~n & i)) +
                            t[5] +
                            1200080426) |
                          0) <<
                          12) |
                          (o >>> 20)) +
                          n) |
                        0) &
                        n) |
                        (~o & r)) +
                        t[6] -
                        1473231341) |
                      0) <<
                      17) |
                      (i >>> 15)) +
                      o) |
                    0) &
                    o) |
                    (~i & n)) +
                    t[7] -
                    45705983) |
                  0) <<
                  22) |
                  (r >>> 10)) +
                  i) |
                0),
              (r =
                ((((r +=
                  ((((i =
                    ((((i +=
                      ((((o =
                        ((((o +=
                          ((((n =
                            ((((n +=
                              (((r & i) | (~r & o)) + t[8] + 1770035416) | 0) <<
                              7) |
                              (n >>> 25)) +
                              r) |
                            0) &
                            r) |
                            (~n & i)) +
                            t[9] -
                            1958414417) |
                          0) <<
                          12) |
                          (o >>> 20)) +
                          n) |
                        0) &
                        n) |
                        (~o & r)) +
                        t[10] -
                        42063) |
                      0) <<
                      17) |
                      (i >>> 15)) +
                      o) |
                    0) &
                    o) |
                    (~i & n)) +
                    t[11] -
                    1990404162) |
                  0) <<
                  22) |
                  (r >>> 10)) +
                  i) |
                0),
              (r =
                ((((r +=
                  ((((i =
                    ((((i +=
                      ((((o =
                        ((((o +=
                          ((((n =
                            ((((n +=
                              (((r & i) | (~r & o)) + t[12] + 1804603682) |
                              0) <<
                              7) |
                              (n >>> 25)) +
                              r) |
                            0) &
                            r) |
                            (~n & i)) +
                            t[13] -
                            40341101) |
                          0) <<
                          12) |
                          (o >>> 20)) +
                          n) |
                        0) &
                        n) |
                        (~o & r)) +
                        t[14] -
                        1502002290) |
                      0) <<
                      17) |
                      (i >>> 15)) +
                      o) |
                    0) &
                    o) |
                    (~i & n)) +
                    t[15] +
                    1236535329) |
                  0) <<
                  22) |
                  (r >>> 10)) +
                  i) |
                0),
              (r =
                ((((r +=
                  ((((i =
                    ((((i +=
                      ((((o =
                        ((((o +=
                          ((((n =
                            ((((n +=
                              (((r & o) | (i & ~o)) + t[1] - 165796510) | 0) <<
                              5) |
                              (n >>> 27)) +
                              r) |
                            0) &
                            i) |
                            (r & ~i)) +
                            t[6] -
                            1069501632) |
                          0) <<
                          9) |
                          (o >>> 23)) +
                          n) |
                        0) &
                        r) |
                        (n & ~r)) +
                        t[11] +
                        643717713) |
                      0) <<
                      14) |
                      (i >>> 18)) +
                      o) |
                    0) &
                    n) |
                    (o & ~n)) +
                    t[0] -
                    373897302) |
                  0) <<
                  20) |
                  (r >>> 12)) +
                  i) |
                0),
              (r =
                ((((r +=
                  ((((i =
                    ((((i +=
                      ((((o =
                        ((((o +=
                          ((((n =
                            ((((n +=
                              (((r & o) | (i & ~o)) + t[5] - 701558691) | 0) <<
                              5) |
                              (n >>> 27)) +
                              r) |
                            0) &
                            i) |
                            (r & ~i)) +
                            t[10] +
                            38016083) |
                          0) <<
                          9) |
                          (o >>> 23)) +
                          n) |
                        0) &
                        r) |
                        (n & ~r)) +
                        t[15] -
                        660478335) |
                      0) <<
                      14) |
                      (i >>> 18)) +
                      o) |
                    0) &
                    n) |
                    (o & ~n)) +
                    t[4] -
                    405537848) |
                  0) <<
                  20) |
                  (r >>> 12)) +
                  i) |
                0),
              (r =
                ((((r +=
                  ((((i =
                    ((((i +=
                      ((((o =
                        ((((o +=
                          ((((n =
                            ((((n +=
                              (((r & o) | (i & ~o)) + t[9] + 568446438) | 0) <<
                              5) |
                              (n >>> 27)) +
                              r) |
                            0) &
                            i) |
                            (r & ~i)) +
                            t[14] -
                            1019803690) |
                          0) <<
                          9) |
                          (o >>> 23)) +
                          n) |
                        0) &
                        r) |
                        (n & ~r)) +
                        t[3] -
                        187363961) |
                      0) <<
                      14) |
                      (i >>> 18)) +
                      o) |
                    0) &
                    n) |
                    (o & ~n)) +
                    t[8] +
                    1163531501) |
                  0) <<
                  20) |
                  (r >>> 12)) +
                  i) |
                0),
              (r =
                ((((r +=
                  ((((i =
                    ((((i +=
                      ((((o =
                        ((((o +=
                          ((((n =
                            ((((n +=
                              (((r & o) | (i & ~o)) + t[13] - 1444681467) |
                              0) <<
                              5) |
                              (n >>> 27)) +
                              r) |
                            0) &
                            i) |
                            (r & ~i)) +
                            t[2] -
                            51403784) |
                          0) <<
                          9) |
                          (o >>> 23)) +
                          n) |
                        0) &
                        r) |
                        (n & ~r)) +
                        t[7] +
                        1735328473) |
                      0) <<
                      14) |
                      (i >>> 18)) +
                      o) |
                    0) &
                    n) |
                    (o & ~n)) +
                    t[12] -
                    1926607734) |
                  0) <<
                  20) |
                  (r >>> 12)) +
                  i) |
                0),
              (r =
                ((((r +=
                  (((i =
                    ((((i +=
                      (((o =
                        ((((o +=
                          (((n =
                            ((((n += ((r ^ i ^ o) + t[5] - 378558) | 0) << 4) |
                              (n >>> 28)) +
                              r) |
                            0) ^
                            r ^
                            i) +
                            t[8] -
                            2022574463) |
                          0) <<
                          11) |
                          (o >>> 21)) +
                          n) |
                        0) ^
                        n ^
                        r) +
                        t[11] +
                        1839030562) |
                      0) <<
                      16) |
                      (i >>> 16)) +
                      o) |
                    0) ^
                    o ^
                    n) +
                    t[14] -
                    35309556) |
                  0) <<
                  23) |
                  (r >>> 9)) +
                  i) |
                0),
              (r =
                ((((r +=
                  (((i =
                    ((((i +=
                      (((o =
                        ((((o +=
                          (((n =
                            ((((n += ((r ^ i ^ o) + t[1] - 1530992060) | 0) <<
                              4) |
                              (n >>> 28)) +
                              r) |
                            0) ^
                            r ^
                            i) +
                            t[4] +
                            1272893353) |
                          0) <<
                          11) |
                          (o >>> 21)) +
                          n) |
                        0) ^
                        n ^
                        r) +
                        t[7] -
                        155497632) |
                      0) <<
                      16) |
                      (i >>> 16)) +
                      o) |
                    0) ^
                    o ^
                    n) +
                    t[10] -
                    1094730640) |
                  0) <<
                  23) |
                  (r >>> 9)) +
                  i) |
                0),
              (r =
                ((((r +=
                  (((i =
                    ((((i +=
                      (((o =
                        ((((o +=
                          (((n =
                            ((((n += ((r ^ i ^ o) + t[13] + 681279174) | 0) <<
                              4) |
                              (n >>> 28)) +
                              r) |
                            0) ^
                            r ^
                            i) +
                            t[0] -
                            358537222) |
                          0) <<
                          11) |
                          (o >>> 21)) +
                          n) |
                        0) ^
                        n ^
                        r) +
                        t[3] -
                        722521979) |
                      0) <<
                      16) |
                      (i >>> 16)) +
                      o) |
                    0) ^
                    o ^
                    n) +
                    t[6] +
                    76029189) |
                  0) <<
                  23) |
                  (r >>> 9)) +
                  i) |
                0),
              (r =
                ((((r +=
                  (((i =
                    ((((i +=
                      (((o =
                        ((((o +=
                          (((n =
                            ((((n += ((r ^ i ^ o) + t[9] - 640364487) | 0) <<
                              4) |
                              (n >>> 28)) +
                              r) |
                            0) ^
                            r ^
                            i) +
                            t[12] -
                            421815835) |
                          0) <<
                          11) |
                          (o >>> 21)) +
                          n) |
                        0) ^
                        n ^
                        r) +
                        t[15] +
                        530742520) |
                      0) <<
                      16) |
                      (i >>> 16)) +
                      o) |
                    0) ^
                    o ^
                    n) +
                    t[2] -
                    995338651) |
                  0) <<
                  23) |
                  (r >>> 9)) +
                  i) |
                0),
              (r =
                ((((r +=
                  (((o =
                    ((((o +=
                      ((r ^
                        ((n =
                          ((((n += ((i ^ (r | ~o)) + t[0] - 198630844) | 0) <<
                            6) |
                            (n >>> 26)) +
                            r) |
                          0) |
                          ~i)) +
                        t[7] +
                        1126891415) |
                      0) <<
                      10) |
                      (o >>> 22)) +
                      n) |
                    0) ^
                    ((i =
                      ((((i += ((n ^ (o | ~r)) + t[14] - 1416354905) | 0) <<
                        15) |
                        (i >>> 17)) +
                        o) |
                      0) |
                      ~n)) +
                    t[5] -
                    57434055) |
                  0) <<
                  21) |
                  (r >>> 11)) +
                  i) |
                0),
              (r =
                ((((r +=
                  (((o =
                    ((((o +=
                      ((r ^
                        ((n =
                          ((((n += ((i ^ (r | ~o)) + t[12] + 1700485571) | 0) <<
                            6) |
                            (n >>> 26)) +
                            r) |
                          0) |
                          ~i)) +
                        t[3] -
                        1894986606) |
                      0) <<
                      10) |
                      (o >>> 22)) +
                      n) |
                    0) ^
                    ((i =
                      ((((i += ((n ^ (o | ~r)) + t[10] - 1051523) | 0) << 15) |
                        (i >>> 17)) +
                        o) |
                      0) |
                      ~n)) +
                    t[1] -
                    2054922799) |
                  0) <<
                  21) |
                  (r >>> 11)) +
                  i) |
                0),
              (r =
                ((((r +=
                  (((o =
                    ((((o +=
                      ((r ^
                        ((n =
                          ((((n += ((i ^ (r | ~o)) + t[8] + 1873313359) | 0) <<
                            6) |
                            (n >>> 26)) +
                            r) |
                          0) |
                          ~i)) +
                        t[15] -
                        30611744) |
                      0) <<
                      10) |
                      (o >>> 22)) +
                      n) |
                    0) ^
                    ((i =
                      ((((i += ((n ^ (o | ~r)) + t[6] - 1560198380) | 0) <<
                        15) |
                        (i >>> 17)) +
                        o) |
                      0) |
                      ~n)) +
                    t[13] +
                    1309151649) |
                  0) <<
                  21) |
                  (r >>> 11)) +
                  i) |
                0),
              (r =
                ((((r +=
                  (((o =
                    ((((o +=
                      ((r ^
                        ((n =
                          ((((n += ((i ^ (r | ~o)) + t[4] - 145523070) | 0) <<
                            6) |
                            (n >>> 26)) +
                            r) |
                          0) |
                          ~i)) +
                        t[11] -
                        1120210379) |
                      0) <<
                      10) |
                      (o >>> 22)) +
                      n) |
                    0) ^
                    ((i =
                      ((((i += ((n ^ (o | ~r)) + t[2] + 718787259) | 0) << 15) |
                        (i >>> 17)) +
                        o) |
                      0) |
                      ~n)) +
                    t[9] -
                    343485551) |
                  0) <<
                  21) |
                  (r >>> 11)) +
                  i) |
                0),
              (e[0] = (n + e[0]) | 0),
              (e[1] = (r + e[1]) | 0),
              (e[2] = (i + e[2]) | 0),
              (e[3] = (o + e[3]) | 0);
          }
          function l(e) {
            var t,
              n = [];
            for (t = 0; t < 64; t += 4)
              n[t >> 2] =
                e.charCodeAt(t) +
                (e.charCodeAt(t + 1) << 8) +
                (e.charCodeAt(t + 2) << 16) +
                (e.charCodeAt(t + 3) << 24);
            return n;
          }
          function d(e) {
            var t,
              n = [];
            for (t = 0; t < 64; t += 4)
              n[t >> 2] =
                e[t] + (e[t + 1] << 8) + (e[t + 2] << 16) + (e[t + 3] << 24);
            return n;
          }
          function i(e) {
            var t,
              n,
              r,
              i,
              o,
              u,
              s = e.length,
              a = [1732584193, -271733879, -1732584194, 271733878];
            for (t = 64; t <= s; t += 64) c(a, l(e.substring(t - 64, t)));
            for (
              n = (e = e.substring(t - 64)).length,
                r = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                t = 0;
              t < n;
              t += 1
            )
              r[t >> 2] |= e.charCodeAt(t) << (t % 4 << 3);
            if (((r[t >> 2] |= 128 << (t % 4 << 3)), 55 < t))
              for (c(a, r), t = 0; t < 16; t += 1) r[t] = 0;
            return (
              (i = (i = 8 * s).toString(16).match(/(.*?)(.{0,8})$/)),
              (o = parseInt(i[2], 16)),
              (u = parseInt(i[1], 16) || 0),
              (r[14] = o),
              (r[15] = u),
              c(a, r),
              a
            );
          }
          function n(e) {
            var t,
              n = "";
            for (t = 0; t < 4; t += 1)
              n += r[(e >> (8 * t + 4)) & 15] + r[(e >> (8 * t)) & 15];
            return n;
          }
          function u(e) {
            var t;
            for (t = 0; t < e.length; t += 1) e[t] = n(e[t]);
            return e.join("");
          }
          function h(e, t) {
            return (e = 0 | e || 0) < 0 ? Math.max(e + t, 0) : Math.min(e, t);
          }
          function o(e) {
            return (
              /[\u0080-\uFFFF]/.test(e) &&
                (e = unescape(encodeURIComponent(e))),
              e
            );
          }
          function s(e) {
            var t,
              n = [],
              r = e.length;
            for (t = 0; t < r - 1; t += 2) n.push(parseInt(e.substr(t, 2), 16));
            return String.fromCharCode.apply(String, n);
          }
          function a() {
            this.reset();
          }
          return (
            "5d41402abc4b2a76b9719d911017c592" !== u(i("hello")) &&
              function(e, t) {
                var n = (65535 & e) + (65535 & t);
                return (
                  (((e >> 16) + (t >> 16) + (n >> 16)) << 16) | (65535 & n)
                );
              },
            "undefined" == typeof ArrayBuffer ||
              ArrayBuffer.prototype.slice ||
              (ArrayBuffer.prototype.slice = function(e, t) {
                var n,
                  r,
                  i,
                  o,
                  u = this.byteLength,
                  s = h(e, u),
                  a = u;
                return (
                  t !== f && (a = h(t, u)),
                  a < s
                    ? new ArrayBuffer(0)
                    : ((n = a - s),
                      (r = new ArrayBuffer(n)),
                      (i = new Uint8Array(r)),
                      (o = new Uint8Array(this, s, n)),
                      i.set(o),
                      r)
                );
              }),
            (a.prototype.append = function(e) {
              return this.appendBinary(o(e)), this;
            }),
            (a.prototype.appendBinary = function(e) {
              (this._buff += e), (this._length += e.length);
              var t,
                n = this._buff.length;
              for (t = 64; t <= n; t += 64)
                c(this._hash, l(this._buff.substring(t - 64, t)));
              return (this._buff = this._buff.substring(t - 64)), this;
            }),
            (a.prototype.end = function(e) {
              var t,
                n,
                r = this._buff,
                i = r.length,
                o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (t = 0; t < i; t += 1)
                o[t >> 2] |= r.charCodeAt(t) << (t % 4 << 3);
              return (
                this._finish(o, i),
                (n = u(this._hash)),
                e && (n = s(n)),
                this.reset(),
                n
              );
            }),
            (a.prototype.reset = function() {
              return (
                (this._buff = ""),
                (this._length = 0),
                (this._hash = [1732584193, -271733879, -1732584194, 271733878]),
                this
              );
            }),
            (a.prototype.getState = function() {
              return {
                buff: this._buff,
                length: this._length,
                hash: this._hash
              };
            }),
            (a.prototype.setState = function(e) {
              return (
                (this._buff = e.buff),
                (this._length = e.length),
                (this._hash = e.hash),
                this
              );
            }),
            (a.prototype.destroy = function() {
              delete this._hash, delete this._buff, delete this._length;
            }),
            (a.prototype._finish = function(e, t) {
              var n,
                r,
                i,
                o = t;
              if (((e[o >> 2] |= 128 << (o % 4 << 3)), 55 < o))
                for (c(this._hash, e), o = 0; o < 16; o += 1) e[o] = 0;
              (n = (n = 8 * this._length).toString(16).match(/(.*?)(.{0,8})$/)),
                (r = parseInt(n[2], 16)),
                (i = parseInt(n[1], 16) || 0),
                (e[14] = r),
                (e[15] = i),
                c(this._hash, e);
            }),
            (a.hash = function(e, t) {
              return a.hashBinary(o(e), t);
            }),
            (a.hashBinary = function(e, t) {
              var n = u(i(e));
              return t ? s(n) : n;
            }),
            ((a.ArrayBuffer = function() {
              this.reset();
            }).prototype.append = function(e) {
              var t,
                n = (function(e, t, n) {
                  var r = new Uint8Array(e.byteLength + t.byteLength);
                  return (
                    r.set(new Uint8Array(e)),
                    r.set(new Uint8Array(t), e.byteLength),
                    n ? r : r.buffer
                  );
                })(this._buff.buffer, e, !0),
                r = n.length;
              for (this._length += e.byteLength, t = 64; t <= r; t += 64)
                c(this._hash, d(n.subarray(t - 64, t)));
              return (
                (this._buff =
                  t - 64 < r
                    ? new Uint8Array(n.buffer.slice(t - 64))
                    : new Uint8Array(0)),
                this
              );
            }),
            (a.ArrayBuffer.prototype.end = function(e) {
              var t,
                n,
                r = this._buff,
                i = r.length,
                o = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
              for (t = 0; t < i; t += 1) o[t >> 2] |= r[t] << (t % 4 << 3);
              return (
                this._finish(o, i),
                (n = u(this._hash)),
                e && (n = s(n)),
                this.reset(),
                n
              );
            }),
            (a.ArrayBuffer.prototype.reset = function() {
              return (
                (this._buff = new Uint8Array(0)),
                (this._length = 0),
                (this._hash = [1732584193, -271733879, -1732584194, 271733878]),
                this
              );
            }),
            (a.ArrayBuffer.prototype.getState = function() {
              var e = a.prototype.getState.call(this);
              return (
                (e.buff = (function(e) {
                  return String.fromCharCode.apply(null, new Uint8Array(e));
                })(e.buff)),
                e
              );
            }),
            (a.ArrayBuffer.prototype.setState = function(e) {
              return (
                (e.buff = (function(e, t) {
                  var n,
                    r = e.length,
                    i = new ArrayBuffer(r),
                    o = new Uint8Array(i);
                  for (n = 0; n < r; n += 1) o[n] = e.charCodeAt(n);
                  return t ? o : i;
                })(e.buff, !0)),
                a.prototype.setState.call(this, e)
              );
            }),
            (a.ArrayBuffer.prototype.destroy = a.prototype.destroy),
            (a.ArrayBuffer.prototype._finish = a.prototype._finish),
            (a.ArrayBuffer.hash = function(e, t) {
              var n = u(
                (function(e) {
                  var t,
                    n,
                    r,
                    i,
                    o,
                    u,
                    s = e.length,
                    a = [1732584193, -271733879, -1732584194, 271733878];
                  for (t = 64; t <= s; t += 64) c(a, d(e.subarray(t - 64, t)));
                  for (
                    n = (e =
                      t - 64 < s ? e.subarray(t - 64) : new Uint8Array(0))
                      .length,
                      r = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                      t = 0;
                    t < n;
                    t += 1
                  )
                    r[t >> 2] |= e[t] << (t % 4 << 3);
                  if (((r[t >> 2] |= 128 << (t % 4 << 3)), 55 < t))
                    for (c(a, r), t = 0; t < 16; t += 1) r[t] = 0;
                  return (
                    (i = (i = 8 * s).toString(16).match(/(.*?)(.{0,8})$/)),
                    (o = parseInt(i[2], 16)),
                    (u = parseInt(i[1], 16) || 0),
                    (r[14] = o),
                    (r[15] = u),
                    c(a, r),
                    a
                  );
                })(new Uint8Array(e))
              );
              return t ? s(n) : n;
            }),
            a
          );
        });
      },
      {}
    ],
    6: [
      function(e, t, n) {
        var r = e(9),
          i = e(10),
          o = i;
        (o.v1 = r), (o.v4 = i), (t.exports = o);
      },
      { 10: 10, 9: 9 }
    ],
    7: [
      function(e, t, n) {
        for (var i = [], r = 0; r < 256; ++r)
          i[r] = (r + 256).toString(16).substr(1);
        t.exports = function(e, t) {
          var n = t || 0,
            r = i;
          return (
            r[e[n++]] +
            r[e[n++]] +
            r[e[n++]] +
            r[e[n++]] +
            "-" +
            r[e[n++]] +
            r[e[n++]] +
            "-" +
            r[e[n++]] +
            r[e[n++]] +
            "-" +
            r[e[n++]] +
            r[e[n++]] +
            "-" +
            r[e[n++]] +
            r[e[n++]] +
            r[e[n++]] +
            r[e[n++]] +
            r[e[n++]] +
            r[e[n++]]
          );
        };
      },
      {}
    ],
    8: [
      function(e, t, n) {
        var r =
          ("undefined" != typeof crypto &&
            crypto.getRandomValues.bind(crypto)) ||
          ("undefined" != typeof msCrypto &&
            msCrypto.getRandomValues.bind(msCrypto));
        if (r) {
          var i = new Uint8Array(16);
          t.exports = function() {
            return r(i), i;
          };
        } else {
          var o = new Array(16);
          t.exports = function() {
            for (var e, t = 0; t < 16; t++)
              0 == (3 & t) && (e = 4294967296 * Math.random()),
                (o[t] = (e >>> ((3 & t) << 3)) & 255);
            return o;
          };
        }
      },
      {}
    ],
    9: [
      function(e, t, n) {
        var p,
          y,
          v = e(8),
          g = e(7),
          m = 0,
          w = 0;
        t.exports = function(e, t, n) {
          var r = (t && n) || 0,
            i = t || [],
            o = (e = e || {}).node || p,
            u = void 0 !== e.clockseq ? e.clockseq : y;
          if (null == o || null == u) {
            var s = v();
            null == o && (o = p = [1 | s[0], s[1], s[2], s[3], s[4], s[5]]),
              null == u && (u = y = 16383 & ((s[6] << 8) | s[7]));
          }
          var a = void 0 !== e.msecs ? e.msecs : new Date().getTime(),
            f = void 0 !== e.nsecs ? e.nsecs : w + 1,
            c = a - m + (f - w) / 1e4;
          if (
            (c < 0 && void 0 === e.clockseq && (u = (u + 1) & 16383),
            (c < 0 || m < a) && void 0 === e.nsecs && (f = 0),
            1e4 <= f)
          )
            throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
          (m = a), (y = u);
          var l =
            (1e4 * (268435455 & (a += 122192928e5)) + (w = f)) % 4294967296;
          (i[r++] = (l >>> 24) & 255),
            (i[r++] = (l >>> 16) & 255),
            (i[r++] = (l >>> 8) & 255),
            (i[r++] = 255 & l);
          var d = ((a / 4294967296) * 1e4) & 268435455;
          (i[r++] = (d >>> 8) & 255),
            (i[r++] = 255 & d),
            (i[r++] = ((d >>> 24) & 15) | 16),
            (i[r++] = (d >>> 16) & 255),
            (i[r++] = (u >>> 8) | 128),
            (i[r++] = 255 & u);
          for (var h = 0; h < 6; ++h) i[r + h] = o[h];
          return t || g(i);
        };
      },
      { 7: 7, 8: 8 }
    ],
    10: [
      function(e, t, n) {
        var u = e(8),
          s = e(7);
        t.exports = function(e, t, n) {
          var r = (t && n) || 0;
          "string" == typeof e &&
            ((t = "binary" === e ? new Array(16) : null), (e = null));
          var i = (e = e || {}).random || (e.rng || u)();
          if (((i[6] = (15 & i[6]) | 64), (i[8] = (63 & i[8]) | 128), t))
            for (var o = 0; o < 16; ++o) t[r + o] = i[o];
          return t || s(i);
        };
      },
      { 7: 7, 8: 8 }
    ],
    11: [
      function(jt, e, t) {
        (function(e) {
          "use strict";
          function t(e) {
            return e && "object" == typeof e && "default" in e ? e.default : e;
          }
          var s = t(jt(3)),
            n = jt(2),
            r = t(jt(6)),
            i = t(jt(5)),
            a = t(jt(1)),
            o = t(jt(4));
          function u(e) {
            if (e instanceof ArrayBuffer)
              return (function(e) {
                if ("function" == typeof e.slice) return e.slice(0);
                var t = new ArrayBuffer(e.byteLength),
                  n = new Uint8Array(t),
                  r = new Uint8Array(e);
                return n.set(r), t;
              })(e);
            var t = e.size,
              n = e.type;
            return "function" == typeof e.slice
              ? e.slice(0, t, n)
              : e.webkitSlice(0, t, n);
          }
          var c,
            p,
            f,
            l = Function.prototype.toString,
            d = l.call(Object);
          function h(e) {
            var t, n, r;
            if (!e || "object" != typeof e) return e;
            if (Array.isArray(e)) {
              for (t = [], n = 0, r = e.length; n < r; n++) t[n] = h(e[n]);
              return t;
            }
            if (e instanceof Date) return e.toISOString();
            if (
              (function(e) {
                return (
                  ("undefined" != typeof ArrayBuffer &&
                    e instanceof ArrayBuffer) ||
                  ("undefined" != typeof Blob && e instanceof Blob)
                );
              })(e)
            )
              return u(e);
            if (
              !(function(e) {
                var t = Object.getPrototypeOf(e);
                if (null === t) return !0;
                var n = t.constructor;
                return (
                  "function" == typeof n && n instanceof n && l.call(n) == d
                );
              })(e)
            )
              return e;
            for (n in ((t = {}), e))
              if (Object.prototype.hasOwnProperty.call(e, n)) {
                var i = h(e[n]);
                void 0 !== i && (t[n] = i);
              }
            return t;
          }
          function y(u) {
            return a(function(i) {
              i = h(i);
              var o = this,
                t = "function" == typeof i[i.length - 1] && i.pop(),
                e = new Promise(function(n, r) {
                  var e;
                  try {
                    var t = (function(t) {
                      var n = !1;
                      return a(function(e) {
                        if (n) throw new Error("once called more than once");
                        (n = !0), t.apply(this, e);
                      });
                    })(function(e, t) {
                      e ? r(e) : n(t);
                    });
                    i.push(t),
                      (e = u.apply(o, i)) &&
                        "function" == typeof e.then &&
                        n(e);
                  } catch (e) {
                    r(e);
                  }
                });
              return (
                t &&
                  e.then(function(e) {
                    t(null, e);
                  }, t),
                e
              );
            });
          }
          function v(e) {
            return "$" + e;
          }
          function g() {
            this._store = {};
          }
          function m(e) {
            if (((this._store = new g()), e && Array.isArray(e)))
              for (var t = 0, n = e.length; t < n; t++) this.add(e[t]);
          }
          (g.prototype.get = function(e) {
            var t = v(e);
            return this._store[t];
          }),
            (g.prototype.set = function(e, t) {
              var n = v(e);
              return (this._store[n] = t), !0;
            }),
            (g.prototype.has = function(e) {
              return v(e) in this._store;
            }),
            (g.prototype.delete = function(e) {
              var t = v(e),
                n = t in this._store;
              return delete this._store[t], n;
            }),
            (g.prototype.forEach = function(e) {
              for (
                var t = Object.keys(this._store), n = 0, r = t.length;
                n < r;
                n++
              ) {
                var i = t[n];
                e(this._store[i], (i = i.substring(1)));
              }
            }),
            Object.defineProperty(g.prototype, "size", {
              get: function() {
                return Object.keys(this._store).length;
              }
            }),
            (m.prototype.add = function(e) {
              return this._store.set(e, !0);
            }),
            (m.prototype.has = function(e) {
              return this._store.has(e);
            }),
            (m.prototype.forEach = function(n) {
              this._store.forEach(function(e, t) {
                n(t);
              });
            }),
            Object.defineProperty(m.prototype, "size", {
              get: function() {
                return this._store.size;
              }
            }),
            (p = (function() {
              if (
                "undefined" == typeof Symbol ||
                "undefined" == typeof Map ||
                "undefined" == typeof Set
              )
                return !1;
              var e = Object.getOwnPropertyDescriptor(Map, Symbol.species);
              return e && "get" in e && Map[Symbol.species] === Map;
            })()
              ? ((c = Set), Map)
              : ((c = m), g));
          try {
            localStorage.setItem("_pouch_check_localstorage", 1),
              (f = !!localStorage.getItem("_pouch_check_localstorage"));
          } catch (e) {
            f = !1;
          }
          function w() {
            return f;
          }
          function b() {
            n.EventEmitter.call(this),
              (this._listeners = {}),
              (function(t) {
                w() &&
                  addEventListener("storage", function(e) {
                    t.emit(e.key);
                  });
              })(this);
          }
          function _(e) {
            if (
              "undefined" != typeof console &&
              "function" == typeof console[e]
            ) {
              var t = Array.prototype.slice.call(arguments, 1);
              console[e].apply(console, t);
            }
          }
          o(b, n.EventEmitter),
            (b.prototype.addListener = function(e, t, n, r) {
              if (!this._listeners[t]) {
                var i = this,
                  o = !1;
                (this._listeners[t] = u), this.on(e, u);
              }
              function u() {
                if (i._listeners[t])
                  if (o) o = "waiting";
                  else {
                    o = !0;
                    var e = (function(e, t) {
                      for (var n = {}, r = 0, i = t.length; r < i; r++) {
                        var o = t[r];
                        o in e && (n[o] = e[o]);
                      }
                      return n;
                    })(r, [
                      "style",
                      "include_docs",
                      "attachments",
                      "conflicts",
                      "filter",
                      "doc_ids",
                      "view",
                      "since",
                      "query_params",
                      "binary",
                      "return_docs"
                    ]);
                    n.changes(e)
                      .on("change", function(e) {
                        e.seq > r.since &&
                          !r.cancelled &&
                          ((r.since = e.seq), r.onChange(e));
                      })
                      .on("complete", function() {
                        "waiting" === o && s(u), (o = !1);
                      })
                      .on("error", function() {
                        o = !1;
                      });
                  }
              }
            }),
            (b.prototype.removeListener = function(e, t) {
              t in this._listeners &&
                (n.EventEmitter.prototype.removeListener.call(
                  this,
                  e,
                  this._listeners[t]
                ),
                delete this._listeners[t]);
            }),
            (b.prototype.notifyLocalWindows = function(e) {
              w() && (localStorage[e] = "a" === localStorage[e] ? "b" : "a");
            }),
            (b.prototype.notify = function(e) {
              this.emit(e), this.notifyLocalWindows(e);
            });
          var k =
            "function" == typeof Object.assign
              ? Object.assign
              : function(e) {
                  for (var t = Object(e), n = 1; n < arguments.length; n++) {
                    var r = arguments[n];
                    if (null != r)
                      for (var i in r)
                        Object.prototype.hasOwnProperty.call(r, i) &&
                          (t[i] = r[i]);
                  }
                  return t;
                };
          function $(e, t, n) {
            Error.call(this, n),
              (this.status = e),
              (this.name = t),
              (this.message = n),
              (this.error = !0);
          }
          o($, Error),
            ($.prototype.toString = function() {
              return JSON.stringify({
                status: this.status,
                name: this.name,
                message: this.message,
                reason: this.reason
              });
            });
          new $(401, "unauthorized", "Name or password is incorrect."),
            new $(400, "bad_request", "Missing JSON list of 'docs'"),
            new $(404, "not_found", "missing"),
            new $(409, "conflict", "Document update conflict"),
            new $(400, "bad_request", "_id field must contain a string"),
            new $(412, "missing_id", "_id is required for puts"),
            new $(
              400,
              "bad_request",
              "Only reserved document ids may start with underscore."
            ),
            new $(412, "precondition_failed", "Database not open");
          var x = new $(
            500,
            "unknown_error",
            "Database encountered an unknown error"
          );
          new $(500, "badarg", "Some query argument is invalid"),
            new $(400, "invalid_request", "Request was invalid"),
            new $(400, "query_parse_error", "Some query parameter is invalid"),
            new $(500, "doc_validation", "Bad special document member"),
            new $(400, "bad_request", "Something wrong with the request"),
            new $(400, "bad_request", "Document must be a JSON object"),
            new $(404, "not_found", "Database not found"),
            new $(500, "indexed_db_went_bad", "unknown"),
            new $(500, "web_sql_went_bad", "unknown"),
            new $(500, "levelDB_went_went_bad", "unknown"),
            new $(
              403,
              "forbidden",
              "Forbidden by design doc validate_doc_update function"
            ),
            new $(400, "bad_request", "Invalid rev format"),
            new $(
              412,
              "file_exists",
              "The database could not be created, the file already exists."
            ),
            new $(
              412,
              "missing_stub",
              "A pre-existing attachment stub wasn't found"
            ),
            new $(413, "invalid_url", "Provided URL is invalid");
          function O(e) {
            if ("object" != typeof e) {
              var t = e;
              (e = x).data = t;
            }
            return (
              "error" in e &&
                "conflict" === e.error &&
                ((e.name = "conflict"), (e.status = 409)),
              "name" in e || (e.name = e.error || "unknown"),
              "status" in e || (e.status = 500),
              "message" in e || (e.message = e.message || e.reason),
              e
            );
          }
          function j(e) {
            for (var t = [], n = 0, r = e.length; n < r; n++)
              t = t.concat(e[n]);
            return t;
          }
          function A(e) {
            return "boolean" == typeof e._remote
              ? e._remote
              : "function" == typeof e.type &&
                  (_(
                    "warn",
                    "db.type() is deprecated and will be removed in a future version of PouchDB"
                  ),
                  "http" === e.type());
          }
          function E(u, s, a) {
            return new Promise(function(i, o) {
              u.get(s, function(e, t) {
                if (e) {
                  if (404 !== e.status) return o(e);
                  t = {};
                }
                var n = t._rev,
                  r = a(t);
                if (!r) return i({ updated: !1, rev: n });
                (r._id = s),
                  (r._rev = n),
                  i(
                    (function(t, n, r) {
                      return t.put(n).then(
                        function(e) {
                          return { updated: !0, rev: e.rev };
                        },
                        function(e) {
                          if (409 !== e.status) throw e;
                          return E(t, n._id, r);
                        }
                      );
                    })(u, r, a)
                  );
              });
            });
          }
          var q = function(e) {
            return atob(e);
          };
          function S(e, t) {
            return (function(t, n) {
              (t = t || []), (n = n || {});
              try {
                return new Blob(t, n);
              } catch (e) {
                if ("TypeError" !== e.name) throw e;
                for (
                  var r = new ("undefined" != typeof BlobBuilder
                      ? BlobBuilder
                      : "undefined" != typeof MSBlobBuilder
                      ? MSBlobBuilder
                      : "undefined" != typeof MozBlobBuilder
                      ? MozBlobBuilder
                      : WebKitBlobBuilder)(),
                    i = 0;
                  i < t.length;
                  i += 1
                )
                  r.append(t[i]);
                return r.getBlob(n.type);
              }
            })(
              [
                (function(e) {
                  for (
                    var t = e.length,
                      n = new ArrayBuffer(t),
                      r = new Uint8Array(n),
                      i = 0;
                    i < t;
                    i++
                  )
                    r[i] = e.charCodeAt(i);
                  return n;
                })(e)
              ],
              { type: t }
            );
          }
          e.setImmediate || e.setTimeout;
          function L(e) {
            return i.hash(e);
          }
          r.v4;
          var B = Headers;
          function M(t) {
            return (
              (t = h(t)).index || (t.index = {}),
              ["type", "name", "ddoc"].forEach(function(e) {
                t.index[e] && ((t[e] = t.index[e]), delete t.index[e]);
              }),
              t.fields && ((t.index.fields = t.fields), delete t.fields),
              t.type || (t.type = "json"),
              t
            );
          }
          function C(e, t, n, r) {
            var i, o;
            (n.headers = new B({ "Content-type": "application/json" })),
              e
                .fetch(t, n)
                .then(function(e) {
                  return (i = e.status), (o = e.ok), e.json();
                })
                .then(function(e) {
                  if (o) r(null, e);
                  else {
                    e.status = i;
                    var t = O(e);
                    r(t);
                  }
                })
                .catch(r);
          }
          function P(e, t, n) {
            (t = M(t)),
              C(e, "_index", { method: "POST", body: JSON.stringify(t) }, n);
          }
          function D(e, t, n) {
            C(e, "_find", { method: "POST", body: JSON.stringify(t) }, n);
          }
          function N(e, t, n) {
            C(e, "_explain", { method: "POST", body: JSON.stringify(t) }, n);
          }
          function I(e, t) {
            C(e, "_index", { method: "GET" }, t);
          }
          function U(e, t, n) {
            var r = t.ddoc,
              i = t.type || "json",
              o = t.name;
            return r
              ? o
                ? void C(
                    e,
                    "_index/" + [r, i, o].map(encodeURIComponent).join("/"),
                    { method: "DELETE" },
                    n
                  )
                : n(new Error("you must provide an index's name"))
              : n(new Error("you must provide an index's ddoc"));
          }
          function T(e, t) {
            for (var n = e, r = 0, i = t.length; r < i; r++) {
              if (!(n = n[t[r]])) break;
            }
            return n;
          }
          function F(e, t, n) {
            for (var r = 0, i = t.length; r < i - 1; r++) {
              e = e[t[r]] = {};
            }
            e[t[i - 1]] = n;
          }
          function z(e, t) {
            return e < t ? -1 : t < e ? 1 : 0;
          }
          function J(e) {
            for (var t = [], n = "", r = 0, i = e.length; r < i; r++) {
              var o = e[r];
              "." === o
                ? (n =
                    0 < r && "\\" === e[r - 1]
                      ? n.substring(0, n.length - 1) + "."
                      : (t.push(n), ""))
                : (n += o);
            }
            return t.push(n), t;
          }
          var R = ["$or", "$nor", "$not"];
          function V(e) {
            return -1 < R.indexOf(e);
          }
          function K(e) {
            return Object.keys(e)[0];
          }
          function W(e) {
            return e[K(e)];
          }
          function X(e) {
            var i = {};
            return (
              e.forEach(function(t) {
                Object.keys(t).forEach(function(e) {
                  var n = t[e];
                  if (("object" != typeof n && (n = { $eq: n }), V(e)))
                    n instanceof Array
                      ? (i[e] = n.map(function(e) {
                          return X([e]);
                        }))
                      : (i[e] = X([n]));
                  else {
                    var r = (i[e] = i[e] || {});
                    Object.keys(n).forEach(function(e) {
                      var t = n[e];
                      return "$gt" === e || "$gte" === e
                        ? (function(e, t, n) {
                            if (void 0 !== n.$eq) return;
                            void 0 !== n.$gte
                              ? "$gte" === e
                                ? t > n.$gte && (n.$gte = t)
                                : t >= n.$gte && (delete n.$gte, (n.$gt = t))
                              : void 0 !== n.$gt
                              ? "$gte" === e
                                ? t > n.$gt && (delete n.$gt, (n.$gte = t))
                                : t > n.$gt && (n.$gt = t)
                              : (n[e] = t);
                          })(e, t, r)
                        : "$lt" === e || "$lte" === e
                        ? (function(e, t, n) {
                            if (void 0 !== n.$eq) return;
                            void 0 !== n.$lte
                              ? "$lte" === e
                                ? t < n.$lte && (n.$lte = t)
                                : t <= n.$lte && (delete n.$lte, (n.$lt = t))
                              : void 0 !== n.$lt
                              ? "$lte" === e
                                ? t < n.$lt && (delete n.$lt, (n.$lte = t))
                                : t < n.$lt && (n.$lt = t)
                              : (n[e] = t);
                          })(e, t, r)
                        : "$ne" === e
                        ? (function(e, t) {
                            "$ne" in t ? t.$ne.push(e) : (t.$ne = [e]);
                          })(t, r)
                        : "$eq" === e
                        ? (function(e, t) {
                            delete t.$gt,
                              delete t.$gte,
                              delete t.$lt,
                              delete t.$lte,
                              delete t.$ne,
                              (t.$eq = e);
                          })(t, r)
                        : void (r[e] = t);
                    });
                  }
                });
              }),
              i
            );
          }
          function G(e) {
            var t = h(e),
              n = !1;
            !(function e(t, n) {
              for (var r in t) {
                "$and" === r && (n = !0);
                var i = t[r];
                "object" == typeof i && (n = e(i, n));
              }
              return n;
            })(t, !1) ||
              ("$and" in
                (t = (function e(t) {
                  for (var n in t) {
                    if (Array.isArray(t))
                      for (var r in t) t[r].$and && (t[r] = X(t[r].$and));
                    var i = t[n];
                    "object" == typeof i && e(i);
                  }
                  return t;
                })(t)) && (t = X(t.$and)),
              (n = !0)),
              ["$or", "$nor"].forEach(function(e) {
                e in t &&
                  t[e].forEach(function(e) {
                    for (var t = Object.keys(e), n = 0; n < t.length; n++) {
                      var r = t[n],
                        i = e[r];
                      ("object" == typeof i && null !== i) ||
                        (e[r] = { $eq: i });
                    }
                  });
              }),
              "$not" in t && (t.$not = X([t.$not]));
            for (var r = Object.keys(t), i = 0; i < r.length; i++) {
              var o = r[i],
                u = t[o];
              "object" != typeof u || null === u
                ? (u = { $eq: u })
                : "$ne" in u && !n && (u.$ne = [u.$ne]),
                (t[o] = u);
            }
            return t;
          }
          var Y = -324,
            H = 3,
            Q = "";
          function Z(e, t) {
            if (e === t) return 0;
            (e = ee(e)), (t = ee(t));
            var n = oe(e),
              r = oe(t);
            if (n - r != 0) return n - r;
            switch (typeof e) {
              case "number":
                return e - t;
              case "boolean":
                return e < t ? -1 : 1;
              case "string":
                return (function(e, t) {
                  return e === t ? 0 : t < e ? 1 : -1;
                })(e, t);
            }
            return Array.isArray(e)
              ? (function(e, t) {
                  for (
                    var n = Math.min(e.length, t.length), r = 0;
                    r < n;
                    r++
                  ) {
                    var i = Z(e[r], t[r]);
                    if (0 !== i) return i;
                  }
                  return e.length === t.length
                    ? 0
                    : e.length > t.length
                    ? 1
                    : -1;
                })(e, t)
              : (function(e, t) {
                  for (
                    var n = Object.keys(e),
                      r = Object.keys(t),
                      i = Math.min(n.length, r.length),
                      o = 0;
                    o < i;
                    o++
                  ) {
                    var u = Z(n[o], r[o]);
                    if (0 !== u) return u;
                    if (0 !== (u = Z(e[n[o]], t[r[o]]))) return u;
                  }
                  return n.length === r.length
                    ? 0
                    : n.length > r.length
                    ? 1
                    : -1;
                })(e, t);
          }
          function ee(e) {
            switch (typeof e) {
              case "undefined":
                return null;
              case "number":
                return e === 1 / 0 || e === -1 / 0 || isNaN(e) ? null : e;
              case "object":
                var t = e;
                if (Array.isArray(e)) {
                  var n = e.length;
                  e = new Array(n);
                  for (var r = 0; r < n; r++) e[r] = ee(t[r]);
                } else {
                  if (e instanceof Date) return e.toJSON();
                  if (null !== e)
                    for (var i in ((e = {}), t))
                      if (t.hasOwnProperty(i)) {
                        var o = t[i];
                        void 0 !== o && (e[i] = ee(o));
                      }
                }
            }
            return e;
          }
          function te(e) {
            if (null !== e)
              switch (typeof e) {
                case "boolean":
                  return e ? 1 : 0;
                case "number":
                  return (function(e) {
                    if (0 === e) return "1";
                    var t = e.toExponential().split(/e\+?/),
                      n = parseInt(t[1], 10),
                      r = e < 0,
                      i = r ? "0" : "2",
                      o = (function(e, t, n) {
                        return (
                          (function(e, t, n) {
                            for (var r = "", i = n - e.length; r.length < i; )
                              r += t;
                            return r;
                          })(e, t, n) + e
                        );
                      })(((r ? -n : n) - Y).toString(), "0", H);
                    i += Q + o;
                    var u = Math.abs(parseFloat(t[0]));
                    r && (u = 10 - u);
                    var s = u.toFixed(20);
                    return (s = s.replace(/\.?0+$/, "")), (i += Q + s);
                  })(e);
                case "string":
                  return e
                    .replace(/\u0002/g, "")
                    .replace(/\u0001/g, "")
                    .replace(/\u0000/g, "");
                case "object":
                  var t = Array.isArray(e),
                    n = t ? e : Object.keys(e),
                    r = -1,
                    i = n.length,
                    o = "";
                  if (t) for (; ++r < i; ) o += ne(n[r]);
                  else
                    for (; ++r < i; ) {
                      var u = n[r];
                      o += ne(u) + ne(e[u]);
                    }
                  return o;
              }
            return "";
          }
          function ne(e) {
            return oe((e = ee(e))) + Q + te(e) + "\0";
          }
          function re(e, t) {
            var n,
              r = t;
            if ("1" === e[t]) (n = 0), t++;
            else {
              var i = "0" === e[t];
              t++;
              var o = "",
                u = e.substring(t, t + H),
                s = parseInt(u, 10) + Y;
              for (i && (s = -s), t += H; ; ) {
                var a = e[t];
                if ("\0" === a) break;
                (o += a), t++;
              }
              (n =
                1 === (o = o.split(".")).length
                  ? parseInt(o, 10)
                  : parseFloat(o[0] + "." + o[1])),
                i && (n -= 10),
                0 !== s && (n = parseFloat(n + "e" + s));
            }
            return { num: n, length: t - r };
          }
          function ie(e, t) {
            var n = e.pop();
            if (t.length) {
              var r = t[t.length - 1];
              n === r.element && (t.pop(), (r = t[t.length - 1]));
              var i = r.element,
                o = r.index;
              if (Array.isArray(i)) i.push(n);
              else if (o === e.length - 2) {
                i[e.pop()] = n;
              } else e.push(n);
            }
          }
          function oe(e) {
            var t = ["boolean", "number", "string", "object"].indexOf(typeof e);
            return ~t
              ? null === e
                ? 1
                : Array.isArray(e)
                ? 5
                : t < 3
                ? t + 2
                : t + 3
              : Array.isArray(e)
              ? 5
              : void 0;
          }
          function ue(e, t, n) {
            if (
              ((e = e.filter(function(e) {
                return se(e.doc, t.selector, n);
              })),
              t.sort)
            ) {
              var r = (function(e) {
                function r(n) {
                  return e.map(function(e) {
                    var t = J(K(e));
                    return T(n, t);
                  });
                }
                return function(e, t) {
                  var n = Z(r(e.doc), r(t.doc));
                  return 0 !== n ? n : z(e.doc._id, t.doc._id);
                };
              })(t.sort);
              (e = e.sort(r)),
                "string" != typeof t.sort[0] &&
                  "desc" === W(t.sort[0]) &&
                  (e = e.reverse());
            }
            if ("limit" in t || "skip" in t) {
              var i = t.skip || 0,
                o = ("limit" in t ? t.limit : e.length) + i;
              e = e.slice(i, o);
            }
            return e;
          }
          function se(i, o, e) {
            return e.every(function(e) {
              var t = o[e],
                n = J(e),
                r = T(i, n);
              return V(e)
                ? (function(e, t, n) {
                    return "$or" !== e
                      ? "$not" !== e
                        ? !t.find(function(e) {
                            return se(n, e, Object.keys(e));
                          })
                        : !se(n, t, Object.keys(t))
                      : t.some(function(e) {
                          return se(n, e, Object.keys(e));
                        });
                  })(e, t, i)
                : ae(t, i, n, r);
            });
          }
          function ae(n, r, i, o) {
            return (
              !n ||
              ("object" == typeof n
                ? Object.keys(n).every(function(e) {
                    var t = n[e];
                    return (function(e, t, n, r, i) {
                      if (de[e]) return de[e](t, n, r, i);
                      throw new Error(
                        'unknown operator "' +
                          e +
                          '" - should be one of $eq, $lte, $lt, $gt, $gte, $exists, $ne, $in, $nin, $size, $mod, $regex, $elemMatch, $type, $allMatch or $all'
                      );
                    })(e, r, t, i, o);
                  })
                : n === o)
            );
          }
          function fe(e) {
            return null != e;
          }
          function ce(e) {
            return void 0 !== e;
          }
          function le(t, e) {
            return e.some(function(e) {
              return t instanceof Array ? -1 < t.indexOf(e) : t === e;
            });
          }
          var de = {
            $elemMatch: function(t, n, r, e) {
              return (
                !!Array.isArray(e) &&
                0 !== e.length &&
                  ("object" == typeof e[0]
                    ? e.some(function(e) {
                        return se(e, n, Object.keys(n));
                      })
                    : e.some(function(e) {
                        return ae(n, t, r, e);
                      }))
              );
            },
            $allMatch: function(t, n, r, e) {
              return (
                !!Array.isArray(e) &&
                0 !== e.length &&
                  ("object" == typeof e[0]
                    ? e.every(function(e) {
                        return se(e, n, Object.keys(n));
                      })
                    : e.every(function(e) {
                        return ae(n, t, r, e);
                      }))
              );
            },
            $eq: function(e, t, n, r) {
              return ce(r) && 0 === Z(r, t);
            },
            $gte: function(e, t, n, r) {
              return ce(r) && 0 <= Z(r, t);
            },
            $gt: function(e, t, n, r) {
              return ce(r) && 0 < Z(r, t);
            },
            $lte: function(e, t, n, r) {
              return ce(r) && Z(r, t) <= 0;
            },
            $lt: function(e, t, n, r) {
              return ce(r) && Z(r, t) < 0;
            },
            $exists: function(e, t, n, r) {
              return t ? ce(r) : !ce(r);
            },
            $mod: function(e, t, n, r) {
              return (
                fe(r) &&
                (function(e, t) {
                  var n = t[0],
                    r = t[1];
                  if (0 === n)
                    throw new Error("Bad divisor, cannot divide by zero");
                  if (parseInt(n, 10) !== n)
                    throw new Error("Divisor is not an integer");
                  if (parseInt(r, 10) !== r)
                    throw new Error("Modulus is not an integer");
                  return parseInt(e, 10) === e && e % n === r;
                })(r, t)
              );
            },
            $ne: function(e, t, n, r) {
              return t.every(function(e) {
                return 0 !== Z(r, e);
              });
            },
            $in: function(e, t, n, r) {
              return fe(r) && le(r, t);
            },
            $nin: function(e, t, n, r) {
              return fe(r) && !le(r, t);
            },
            $size: function(e, t, n, r) {
              return (
                fe(r) &&
                (function(e, t) {
                  return e.length === t;
                })(r, t)
              );
            },
            $all: function(e, t, n, r) {
              return (
                Array.isArray(r) &&
                (function(t, e) {
                  return e.every(function(e) {
                    return -1 < t.indexOf(e);
                  });
                })(r, t)
              );
            },
            $regex: function(e, t, n, r) {
              return (
                fe(r) &&
                (function(e, t) {
                  return new RegExp(t).test(e);
                })(r, t)
              );
            },
            $type: function(e, t, n, r) {
              return (function(e, t) {
                switch (t) {
                  case "null":
                    return null === e;
                  case "boolean":
                    return "boolean" == typeof e;
                  case "number":
                    return "number" == typeof e;
                  case "string":
                    return "string" == typeof e;
                  case "array":
                    return e instanceof Array;
                  case "object":
                    return "[object Object]" === {}.toString.call(e);
                }
                throw new Error(
                  t +
                    " not supported as a type.Please use one of object, string, array, number, boolean or null."
                );
              })(r, t);
            }
          };
          function he(r) {
            return function() {
              for (
                var e = arguments.length, t = new Array(e), n = -1;
                ++n < e;

              )
                t[n] = arguments[n];
              return r.call(this, t);
            };
          }
          function pe(r) {
            return he(function(e) {
              var t = e.pop(),
                n = r.apply(this, e);
              return (
                (function(e, t) {
                  e.then(
                    function(e) {
                      s(function() {
                        t(null, e);
                      });
                    },
                    function(e) {
                      s(function() {
                        t(e);
                      });
                    }
                  );
                })(n, t),
                n
              );
            });
          }
          var ye = he(function(e) {
            for (var t = [], n = 0, r = e.length; n < r; n++) {
              var i = e[n];
              Array.isArray(i) ? (t = t.concat(ye.apply(null, i))) : t.push(i);
            }
            return t;
          });
          function ve(e) {
            for (var t = {}, n = 0, r = e.length; n < r; n++) t = k(t, e[n]);
            return t;
          }
          function ge(e, t) {
            for (var n = 0, r = Math.min(e.length, t.length); n < r; n++)
              if (e[n] !== t[n]) return !1;
            return !0;
          }
          function me(e, t) {
            if (e.length !== t.length) return !1;
            for (var n = 0, r = e.length; n < r; n++)
              if (e[n] !== t[n]) return !1;
            return !0;
          }
          function we() {
            this.promise = new Promise(function(e) {
              e();
            });
          }
          function be(e) {
            if (!e) return "undefined";
            switch (typeof e) {
              case "function":
              case "string":
                return e.toString();
              default:
                return JSON.stringify(e);
            }
          }
          function _e(i, o, u, s, t, n) {
            var a,
              f = (function(e, t) {
                return be(e) + be(t) + "undefined";
              })(u, s);
            if (!t && (a = i._cachedViews = i._cachedViews || {})[f])
              return a[f];
            var e = i.info().then(function(e) {
              var r = e.db_name + "-mrview-" + (t ? "temp" : L(f));
              return E(i, "_local/" + n, function(e) {
                e.views = e.views || {};
                var t = o;
                -1 === t.indexOf("/") && (t = o + "/" + o);
                var n = (e.views[t] = e.views[t] || {});
                if (!n[r]) return (n[r] = !0), e;
              }).then(function() {
                return i.registerDependentDatabase(r).then(function(e) {
                  var t = e.db;
                  t.auto_compaction = !0;
                  var n = {
                    name: r,
                    db: t,
                    sourceDB: i,
                    adapter: i.adapter,
                    mapFun: u,
                    reduceFun: s
                  };
                  return n.db
                    .get("_local/lastSeq")
                    .catch(function(e) {
                      if (404 !== e.status) throw e;
                    })
                    .then(function(e) {
                      return (
                        (n.seq = e ? e.seq : 0),
                        a &&
                          n.db.once("destroyed", function() {
                            delete a[f];
                          }),
                        n
                      );
                    });
                });
              });
            });
            return a && (a[f] = e), e;
          }
          function ke(e) {
            (this.status = 400),
              (this.name = "query_parse_error"),
              (this.message = e),
              (this.error = !0);
            try {
              Error.captureStackTrace(this, ke);
            } catch (e) {}
          }
          function $e(e) {
            (this.status = 404),
              (this.name = "not_found"),
              (this.message = e),
              (this.error = !0);
            try {
              Error.captureStackTrace(this, $e);
            } catch (e) {}
          }
          function xe(e) {
            (this.status = 500),
              (this.name = "invalid_value"),
              (this.message = e),
              (this.error = !0);
            try {
              Error.captureStackTrace(this, xe);
            } catch (e) {}
          }
          function Oe(e, t) {
            return (
              t &&
                e.then(
                  function(e) {
                    s(function() {
                      t(null, e);
                    });
                  },
                  function(e) {
                    s(function() {
                      t(e);
                    });
                  }
                ),
              e
            );
          }
          function je(n, r) {
            return function() {
              var e = arguments,
                t = this;
              return n.add(function() {
                return r.apply(t, e);
              });
            };
          }
          function Ae(e) {
            var t = new c(e),
              n = new Array(t.size),
              r = -1;
            return (
              t.forEach(function(e) {
                n[++r] = e;
              }),
              n
            );
          }
          function Ee(e) {
            var n = new Array(e.size),
              r = -1;
            return (
              e.forEach(function(e, t) {
                n[++r] = t;
              }),
              n
            );
          }
          (we.prototype.add = function(e) {
            return (
              (this.promise = this.promise
                .catch(function() {})
                .then(function() {
                  return e();
                })),
              this.promise
            );
          }),
            (we.prototype.finish = function() {
              return this.promise;
            }),
            o(ke, Error),
            o($e, Error),
            o(xe, Error);
          var qe = {},
            Se = new we();
          function Le(e) {
            return -1 === e.indexOf("/") ? [e, e] : e.split("/");
          }
          function Be(e, t) {
            try {
              e.emit("error", t);
            } catch (e) {
              _(
                "error",
                "The user's map/reduce function threw an uncaught error.\nYou can debug this error by doing:\nmyDatabase.on('error', function (err) { debugger; });\nPlease double-check your map/reduce function."
              ),
                _("error", t);
            }
          }
          function Me(e, t) {
            var n = (function(e) {
                for (var t = 0, n = e.length; t < n; t++) {
                  if (-1 !== e[t].indexOf(".")) return !1;
                }
                return !0;
              })(e),
              r = 1 === e.length;
            return n
              ? r
                ? (function(t, n) {
                    return function(e) {
                      n(e[t]);
                    };
                  })(e[0], t)
                : (function(i, o) {
                    return function(e) {
                      for (var t = [], n = 0, r = i.length; n < r; n++)
                        t.push(e[i[n]]);
                      o(t);
                    };
                  })(e, t)
              : r
              ? (function(e, i) {
                  var o = J(e);
                  return function(e) {
                    for (var t = e, n = 0, r = o.length; n < r; n++) {
                      if (void 0 === (t = t[o[n]])) return;
                    }
                    i(t);
                  };
                })(e[0], t)
              : (function(a, f) {
                  return function(e) {
                    for (var t = [], n = 0, r = a.length; n < r; n++) {
                      for (
                        var i = J(a[n]), o = e, u = 0, s = i.length;
                        u < s;
                        u++
                      ) {
                        if (void 0 === (o = o[i[u]])) return;
                      }
                      t.push(o);
                    }
                    f(t);
                  };
                })(e, t);
          }
          var Ce,
            Pe,
            De,
            Ne,
            Ie,
            Ue =
              ((Pe = "indexes"),
              (De = function(e, t) {
                return Me(Object.keys(e.fields), t);
              }),
              (Ne = function() {
                throw new Error("reduce not supported");
              }),
              (Ie = function(e, t) {
                var n = e.views[t];
                if (!n.map || !n.map.fields)
                  throw new Error(
                    "ddoc " +
                      e._id +
                      " with view " +
                      t +
                      " doesn't have map.fields defined. maybe it wasn't created by this plugin?"
                  );
              }),
              {
                query: function(e, t, n) {
                  var r = this;
                  "function" == typeof t && ((n = t), (t = {})),
                    (t = t
                      ? (function(e) {
                          return (
                            (e.group_level = We(e.group_level)),
                            (e.limit = We(e.limit)),
                            (e.skip = We(e.skip)),
                            e
                          );
                        })(t)
                      : {}),
                    "function" == typeof e && (e = { map: e });
                  var i = Promise.resolve().then(function() {
                    return et(r, e, t);
                  });
                  return Oe(i, n), i;
                },
                viewCleanup:
                  ((Ce = function() {
                    var e = this;
                    return "function" == typeof e._viewCleanup
                      ? (function(e) {
                          return new Promise(function(n, r) {
                            e._viewCleanup(function(e, t) {
                              if (e) return r(e);
                              n(t);
                            });
                          });
                        })(e)
                      : A(e)
                      ? (function(e) {
                          return e
                            .fetch("_view_cleanup", {
                              headers: new B({
                                "Content-Type": "application/json"
                              }),
                              method: "POST"
                            })
                            .then(function(e) {
                              return e.json();
                            });
                        })(e)
                      : (function(n) {
                          return n.get("_local/" + Pe).then(function(s) {
                            var a = new p();
                            Object.keys(s.views).forEach(function(e) {
                              var t = Le(e),
                                n = "_design/" + t[0],
                                r = t[1],
                                i = a.get(n);
                              i || ((i = new c()), a.set(n, i)), i.add(r);
                            });
                            var e = { keys: Ee(a), include_docs: !0 };
                            return n.allDocs(e).then(function(e) {
                              var u = {};
                              e.rows.forEach(function(i) {
                                var o = i.key.substring(8);
                                a.get(i.key).forEach(function(e) {
                                  var t = o + "/" + e;
                                  s.views[t] || (t = e);
                                  var n = Object.keys(s.views[t]),
                                    r = i.doc && i.doc.views && i.doc.views[e];
                                  n.forEach(function(e) {
                                    u[e] = u[e] || r;
                                  });
                                });
                              });
                              var t = Object.keys(u)
                                .filter(function(e) {
                                  return !u[e];
                                })
                                .map(function(e) {
                                  return je(He(e), function() {
                                    return new n.constructor(
                                      e,
                                      n.__opts
                                    ).destroy();
                                  })();
                                });
                              return Promise.all(t).then(function() {
                                return { ok: !0 };
                              });
                            });
                          }, Ge({ ok: !0 }));
                        })(e);
                  }),
                  a(function(e) {
                    var t = e.pop(),
                      n = Ce.apply(this, e);
                    return "function" == typeof t && Oe(n, t), n;
                  }))
              });
          function Te(t, e, n) {
            try {
              e(n);
            } catch (e) {
              Be(t, e);
            }
          }
          function Fe(t, e, n, r, i) {
            try {
              return { output: e(n, r, i) };
            } catch (e) {
              return Be(t, e), { error: e };
            }
          }
          function ze(e, t) {
            var n = Z(e.key, t.key);
            return 0 !== n ? n : Z(e.value, t.value);
          }
          function Je(e) {
            var t = e.value;
            return (t && "object" == typeof t && t._id) || e.id;
          }
          function Re(e) {
            e.rows.forEach(function(e) {
              var n = e.doc && e.doc._attachments;
              n &&
                Object.keys(n).forEach(function(e) {
                  var t = n[e];
                  n[e].data = (function(e, t) {
                    return S(q(e), t);
                  })(t.data, t.content_type);
                });
            });
          }
          function Ve(t) {
            return function(e) {
              return t.include_docs && t.attachments && t.binary && Re(e), e;
            };
          }
          function Ke(e, t, n, r) {
            var i = t[e];
            void 0 !== i &&
              (r && (i = encodeURIComponent(JSON.stringify(i))),
              n.push(e + "=" + i));
          }
          function We(e) {
            if (void 0 !== e) {
              var t = Number(e);
              return isNaN(t) || t !== parseInt(e, 10) ? e : t;
            }
          }
          function Xe(n, e) {
            var t = n.descending ? "endkey" : "startkey",
              r = n.descending ? "startkey" : "endkey";
            if (void 0 !== n[t] && void 0 !== n[r] && 0 < Z(n[t], n[r]))
              throw new ke(
                "No rows can match your key range, reverse your start_key and end_key or set {descending : true}"
              );
            if (e.reduce && !1 !== n.reduce) {
              if (n.include_docs)
                throw new ke("{include_docs:true} is invalid for reduce");
              if (n.keys && 1 < n.keys.length && !n.group && !n.group_level)
                throw new ke(
                  "Multi-key fetches for reduce views must use {group: true}"
                );
            }
            ["group_level", "limit", "skip"].forEach(function(e) {
              var t = (function(e) {
                if (e) {
                  if ("number" != typeof e)
                    return new ke('Invalid value for integer: "' + e + '"');
                  if (e < 0)
                    return new ke(
                      'Invalid value for positive integer: "' + e + '"'
                    );
                }
              })(n[e]);
              if (t) throw t;
            });
          }
          function Ge(t) {
            return function(e) {
              if (404 === e.status) return t;
              throw e;
            };
          }
          function Ye(e, n, t) {
            var r = "_local/doc_" + e,
              i = { _id: r, keys: [] },
              o = t.get(e),
              f = o[0];
            return ((function(e) {
              return 1 === e.length && /^1-/.test(e[0].rev);
            })(o[1])
              ? Promise.resolve(i)
              : n.db.get(r).catch(Ge(i))
            ).then(function(t) {
              return (function(e) {
                return e.keys.length
                  ? n.db.allDocs({ keys: e.keys, include_docs: !0 })
                  : Promise.resolve({ rows: [] });
              })(t).then(function(e) {
                return (function(e, t) {
                  for (
                    var r = [], i = new c(), n = 0, o = t.rows.length;
                    n < o;
                    n++
                  ) {
                    var u = t.rows[n].doc;
                    if (
                      u &&
                      (r.push(u),
                      i.add(u._id),
                      (u._deleted = !f.has(u._id)),
                      !u._deleted)
                    ) {
                      var s = f.get(u._id);
                      "value" in s && (u.value = s.value);
                    }
                  }
                  var a = Ee(f);
                  return (
                    a.forEach(function(e) {
                      if (!i.has(e)) {
                        var t = { _id: e },
                          n = f.get(e);
                        "value" in n && (t.value = n.value), r.push(t);
                      }
                    }),
                    (e.keys = Ae(a.concat(e.keys))),
                    r.push(e),
                    r
                  );
                })(t, e);
              });
            });
          }
          function He(e) {
            var t = "string" == typeof e ? e : e.name,
              n = qe[t];
            return n || (n = qe[t] = new we()), n;
          }
          function Qe(e) {
            return je(He(e), function() {
              return (function(u) {
                var s, a;
                var f = De(u.mapFun, function(e, t) {
                    var n = { id: a._id, key: ee(e) };
                    null != t && (n.value = ee(t)), s.push(n);
                  }),
                  c = u.seq || 0;
                function r(e, t) {
                  return function() {
                    return (function(r, t, i) {
                      var e = "_local/lastSeq";
                      return r.db
                        .get(e)
                        .catch(Ge({ _id: e, seq: 0 }))
                        .then(function(n) {
                          var e = Ee(t);
                          return Promise.all(
                            e.map(function(e) {
                              return Ye(e, r, t);
                            })
                          ).then(function(e) {
                            var t = j(e);
                            return (
                              (n.seq = i), t.push(n), r.db.bulkDocs({ docs: t })
                            );
                          });
                        });
                    })(u, e, t);
                  };
                }
                var i = new we();
                function o() {
                  return u.sourceDB
                    .changes({
                      return_docs: !0,
                      conflicts: !0,
                      include_docs: !0,
                      style: "all_docs",
                      since: c,
                      limit: 50
                    })
                    .then(e);
                }
                function e(e) {
                  var t = e.results;
                  if (t.length) {
                    var n = (function(e) {
                      for (var t = new p(), n = 0, r = e.length; n < r; n++) {
                        var i = e[n];
                        if ("_" !== i.doc._id[0]) {
                          (s = []),
                            (a = i.doc)._deleted || Te(u.sourceDB, f, a),
                            s.sort(ze);
                          var o = l(s);
                          t.set(i.doc._id, [o, i.changes]);
                        }
                        c = i.seq;
                      }
                      return t;
                    })(t);
                    if ((i.add(r(n, c)), !(t.length < 50))) return o();
                  }
                }
                function l(e) {
                  for (var t, n = new p(), r = 0, i = e.length; r < i; r++) {
                    var o = e[r],
                      u = [o.key, o.id];
                    0 < r && 0 === Z(o.key, t) && u.push(r),
                      n.set(ne(u), o),
                      (t = o.key);
                  }
                  return n;
                }
                return o()
                  .then(function() {
                    return i.finish();
                  })
                  .then(function() {
                    u.seq = c;
                  });
              })(e);
            })();
          }
          function Ze(e, t) {
            return je(He(e), function() {
              return (function(r, i) {
                var o,
                  u = r.reduceFun && !1 !== i.reduce,
                  s = i.skip || 0;
                void 0 === i.keys ||
                  i.keys.length ||
                  ((i.limit = 0), delete i.keys);
                function n(e) {
                  return (
                    (e.include_docs = !0),
                    r.db.allDocs(e).then(function(e) {
                      return (
                        (o = e.total_rows),
                        e.rows.map(function(e) {
                          if (
                            "value" in e.doc &&
                            "object" == typeof e.doc.value &&
                            null !== e.doc.value
                          ) {
                            var t = Object.keys(e.doc.value).sort(),
                              n = ["id", "key", "value"];
                            if (!(t < n || n < t)) return e.doc.value;
                          }
                          var r = (function(e) {
                            for (var t = [], n = [], r = 0; ; ) {
                              var i = e[r++];
                              if ("\0" !== i)
                                switch (i) {
                                  case "1":
                                    t.push(null);
                                    break;
                                  case "2":
                                    t.push("1" === e[r]), r++;
                                    break;
                                  case "3":
                                    var o = re(e, r);
                                    t.push(o.num), (r += o.length);
                                    break;
                                  case "4":
                                    for (var u = ""; ; ) {
                                      var s = e[r];
                                      if ("\0" === s) break;
                                      (u += s), r++;
                                    }
                                    (u = u
                                      .replace(/\u0001\u0001/g, "\0")
                                      .replace(/\u0001\u0002/g, "")
                                      .replace(/\u0002\u0002/g, "")),
                                      t.push(u);
                                    break;
                                  case "5":
                                    var a = { element: [], index: t.length };
                                    t.push(a.element), n.push(a);
                                    break;
                                  case "6":
                                    var f = { element: {}, index: t.length };
                                    t.push(f.element), n.push(f);
                                    break;
                                  default:
                                    throw new Error(
                                      "bad collationIndex or unexpectedly reached end of input: " +
                                        i
                                    );
                                }
                              else {
                                if (1 === t.length) return t.pop();
                                ie(t, n);
                              }
                            }
                          })(e.doc._id);
                          return {
                            key: r[0],
                            id: r[1],
                            value: "value" in e.doc ? e.doc.value : null
                          };
                        })
                      );
                    })
                  );
                }
                function e(t) {
                  var n;
                  if (
                    ((n = u
                      ? (function(e, t, n) {
                          0 === n.group_level && delete n.group_level;
                          var r = n.group || n.group_level,
                            i = Ne(e.reduceFun),
                            o = [],
                            u = isNaN(n.group_level)
                              ? Number.POSITIVE_INFINITY
                              : n.group_level;
                          t.forEach(function(e) {
                            var t = o[o.length - 1],
                              n = r ? e.key : null;
                            if (
                              (r && Array.isArray(n) && (n = n.slice(0, u)),
                              t && 0 === Z(t.groupKey, n))
                            )
                              return (
                                t.keys.push([e.key, e.id]),
                                void t.values.push(e.value)
                              );
                            o.push({
                              keys: [[e.key, e.id]],
                              values: [e.value],
                              groupKey: n
                            });
                          }),
                            (t = []);
                          for (var s = 0, a = o.length; s < a; s++) {
                            var f = o[s],
                              c = Fe(e.sourceDB, i, f.keys, f.values, !1);
                            if (c.error && c.error instanceof xe) throw c.error;
                            t.push({
                              value: c.error ? null : c.output,
                              key: f.groupKey
                            });
                          }
                          return {
                            rows: (function(e, t, n) {
                              return (
                                (n = n || 0),
                                "number" == typeof t
                                  ? e.slice(n, t + n)
                                  : 0 < n
                                  ? e.slice(n)
                                  : e
                              );
                            })(t, n.limit, n.skip)
                          };
                        })(r, t, i)
                      : { total_rows: o, offset: s, rows: t }),
                    i.update_seq && (n.update_seq = r.seq),
                    i.include_docs)
                  ) {
                    var e = Ae(t.map(Je));
                    return r.sourceDB
                      .allDocs({
                        keys: e,
                        include_docs: !0,
                        conflicts: i.conflicts,
                        attachments: i.attachments,
                        binary: i.binary
                      })
                      .then(function(e) {
                        var r = new p();
                        return (
                          e.rows.forEach(function(e) {
                            r.set(e.id, e.doc);
                          }),
                          t.forEach(function(e) {
                            var t = Je(e),
                              n = r.get(t);
                            n && (e.doc = n);
                          }),
                          n
                        );
                      });
                  }
                  return n;
                }
                {
                  if (void 0 !== i.keys) {
                    var t = i.keys.map(function(e) {
                      var t = { startkey: ne([e]), endkey: ne([e, {}]) };
                      return i.update_seq && (t.update_seq = !0), n(t);
                    });
                    return Promise.all(t)
                      .then(j)
                      .then(e);
                  }
                  var a,
                    f,
                    c = { descending: i.descending };
                  if (
                    (i.update_seq && (c.update_seq = !0),
                    "start_key" in i && (a = i.start_key),
                    "startkey" in i && (a = i.startkey),
                    "end_key" in i && (f = i.end_key),
                    "endkey" in i && (f = i.endkey),
                    void 0 !== a &&
                      (c.startkey = i.descending ? ne([a, {}]) : ne([a])),
                    void 0 !== f)
                  ) {
                    var l = !1 !== i.inclusive_end;
                    i.descending && (l = !l),
                      (c.endkey = ne(l ? [f, {}] : [f]));
                  }
                  if (void 0 !== i.key) {
                    var d = ne([i.key]),
                      h = ne([i.key, {}]);
                    c.descending
                      ? ((c.endkey = d), (c.startkey = h))
                      : ((c.startkey = d), (c.endkey = h));
                  }
                  return (
                    u ||
                      ("number" == typeof i.limit && (c.limit = i.limit),
                      (c.skip = s)),
                    n(c).then(e)
                  );
                }
              })(e, t);
            })();
          }
          function et(n, e, r) {
            if ("function" == typeof n._query)
              return (function(e, t, i) {
                return new Promise(function(n, r) {
                  e._query(t, i, function(e, t) {
                    if (e) return r(e);
                    n(t);
                  });
                });
              })(n, e, r);
            if (A(n))
              return (function(e, t, n) {
                var r,
                  i,
                  o,
                  u = [],
                  s = "GET";
                if (
                  (Ke("reduce", n, u),
                  Ke("include_docs", n, u),
                  Ke("attachments", n, u),
                  Ke("limit", n, u),
                  Ke("descending", n, u),
                  Ke("group", n, u),
                  Ke("group_level", n, u),
                  Ke("skip", n, u),
                  Ke("stale", n, u),
                  Ke("conflicts", n, u),
                  Ke("startkey", n, u, !0),
                  Ke("start_key", n, u, !0),
                  Ke("endkey", n, u, !0),
                  Ke("end_key", n, u, !0),
                  Ke("inclusive_end", n, u),
                  Ke("key", n, u, !0),
                  Ke("update_seq", n, u),
                  (u = "" === (u = u.join("&")) ? "" : "?" + u),
                  void 0 !== n.keys)
                ) {
                  var a = "keys=" + encodeURIComponent(JSON.stringify(n.keys));
                  a.length + u.length + 1 <= 2e3
                    ? (u += ("?" === u[0] ? "&" : "?") + a)
                    : ((s = "POST"),
                      "string" == typeof t
                        ? (r = { keys: n.keys })
                        : (t.keys = n.keys));
                }
                if ("string" != typeof t)
                  return (
                    (r = r || {}),
                    Object.keys(t).forEach(function(e) {
                      Array.isArray(t[e])
                        ? (r[e] = t[e])
                        : (r[e] = t[e].toString());
                    }),
                    e
                      .fetch("_temp_view" + u, {
                        headers: new B({ "Content-Type": "application/json" }),
                        method: "POST",
                        body: JSON.stringify(r)
                      })
                      .then(function(e) {
                        return (i = e.ok), (o = e.status), e.json();
                      })
                      .then(function(e) {
                        if (!i) throw ((e.status = o), O(e));
                        return e;
                      })
                      .then(Ve(n))
                  );
                var f = Le(t);
                return e
                  .fetch("_design/" + f[0] + "/_view/" + f[1] + u, {
                    headers: new B({ "Content-Type": "application/json" }),
                    method: s,
                    body: JSON.stringify(r)
                  })
                  .then(function(e) {
                    return (i = e.ok), (o = e.status), e.json();
                  })
                  .then(function(e) {
                    if (!i) throw ((e.status = o), O(e));
                    return (
                      e.rows.forEach(function(e) {
                        if (
                          e.value &&
                          e.value.error &&
                          "builtin_reduce_error" === e.value.error
                        )
                          throw new Error(e.reason);
                      }),
                      e
                    );
                  })
                  .then(Ve(n));
              })(n, e, r);
            if ("string" != typeof e)
              return (
                Xe(r, e),
                Se.add(function() {
                  return _e(
                    n,
                    "temp_view/temp_view",
                    e.map,
                    e.reduce,
                    !0,
                    Pe
                  ).then(function(e) {
                    return (function(e, t) {
                      return e.then(
                        function(e) {
                          return t().then(function() {
                            return e;
                          });
                        },
                        function(e) {
                          return t().then(function() {
                            throw e;
                          });
                        }
                      );
                    })(
                      Qe(e).then(function() {
                        return Ze(e, r);
                      }),
                      function() {
                        return e.db.destroy();
                      }
                    );
                  });
                }),
                Se.finish()
              );
            var i = e,
              t = Le(i),
              o = t[0],
              u = t[1];
            return n.get("_design/" + o).then(function(e) {
              var t = e.views && e.views[u];
              if (!t) throw new $e("ddoc " + e._id + " has no view named " + u);
              return (
                Ie(e, u),
                Xe(r, t),
                _e(n, i, t.map, t.reduce, !1, Pe).then(function(e) {
                  return "ok" === r.stale || "update_after" === r.stale
                    ? ("update_after" === r.stale &&
                        s(function() {
                          Qe(e);
                        }),
                      Ze(e, r))
                    : Qe(e).then(function() {
                        return Ze(e, r);
                      });
                })
              );
            });
          }
          function tt(e) {
            return e._customFindAbstractMapper || Ue;
          }
          function nt(e) {
            return (
              (e.fields = e.fields.map(function(e) {
                if ("string" != typeof e) return e;
                var t = {};
                return (t[e] = "asc"), t;
              })),
              e
            );
          }
          function rt(e, t) {
            for (var n = [], r = 0; r < t.def.fields.length; r++) {
              var i = K(t.def.fields[r]);
              n.push(e[i]);
            }
            return n;
          }
          function it(e) {
            return e
              .allDocs({
                startkey: "_design/",
                endkey: "_design/￿",
                include_docs: !0
              })
              .then(function(e) {
                var t = {
                  indexes: [
                    {
                      ddoc: null,
                      name: "_all_docs",
                      type: "special",
                      def: { fields: [{ _id: "asc" }] }
                    }
                  ]
                };
                return (
                  (t.indexes = ye(
                    t.indexes,
                    e.rows
                      .filter(function(e) {
                        return "query" === e.doc.language;
                      })
                      .map(function(n) {
                        return (void 0 !== n.doc.views
                          ? Object.keys(n.doc.views)
                          : []
                        ).map(function(e) {
                          var t = n.doc.views[e];
                          return {
                            ddoc: n.id,
                            name: e,
                            type: "json",
                            def: nt(t.options.def)
                          };
                        });
                      })
                  )),
                  t.indexes.sort(function(e, t) {
                    return z(e.name, t.name);
                  }),
                  (t.total_rows = t.indexes.length),
                  t
                );
              });
          }
          var ot = null,
            ut = { "￿": {} };
          function st(e, t) {
            for (var n = e.def.fields.map(K), r = 0, i = n.length; r < i; r++) {
              if (t === n[r]) return !0;
            }
            return !1;
          }
          function at(e, t) {
            var i = t.def.fields.map(K);
            return e.slice().sort(function(e, t) {
              var n = i.indexOf(e),
                r = i.indexOf(t);
              return (
                -1 === n && (n = Number.MAX_VALUE),
                -1 === r && (r = Number.MAX_VALUE),
                z(n, r)
              );
            });
          }
          function ft(e, t, n, r) {
            return at(
              (function(e) {
                for (var t = {}, n = 0; n < e.length; n++) t["$" + e[n]] = !0;
                return Object.keys(t).map(function(e) {
                  return e.substring(1);
                });
              })(
                ye(
                  e,
                  (function(e, t, n) {
                    for (
                      var r = !1, i = 0, o = (n = at(n, e)).length;
                      i < o;
                      i++
                    ) {
                      var u = n[i];
                      if (r || !st(e, u)) return n.slice(i);
                      i < o - 1 && "$eq" !== K(t[u]) && (r = !0);
                    }
                    return [];
                  })(t, n, r),
                  (function(n) {
                    var r = [];
                    return (
                      Object.keys(n).forEach(function(t) {
                        var e = n[t];
                        Object.keys(e).forEach(function(e) {
                          "$ne" === e && r.push(t);
                        });
                      }),
                      r
                    );
                  })(n)
                )
              ),
              t
            );
          }
          function ct(e, t, n) {
            if (t) {
              var r = (function(e, t) {
                  return !(e.length > t.length) && ge(e, t);
                })(t, e),
                i = ge(n, e);
              return r && i;
            }
            return (function(e, t) {
              e = e.slice();
              for (var n = 0, r = t.length; n < r; n++) {
                var i = t[n];
                if (!e.length) break;
                var o = e.indexOf(i);
                if (-1 === o) return !1;
                e.splice(o, 1);
              }
              return !0;
            })(n, e);
          }
          var lt = ["$eq", "$gt", "$gte", "$lt", "$lte"];
          function dt(e) {
            return -1 === lt.indexOf(e);
          }
          function ht(e, t, n, r) {
            var i = e.def.fields.map(K);
            return (
              !!ct(i, t, n) &&
              (function(e, t) {
                var n = t[e[0]];
                return (
                  void 0 === n ||
                  !(1 === Object.keys(n).length && "$ne" === K(n))
                );
              })(i, r)
            );
          }
          function pt(e, t, n, r, i) {
            var o = (function(n, r, i, e) {
              return e.reduce(function(e, t) {
                return ht(t, i, r, n) && e.push(t), e;
              }, []);
            })(e, t, n, r);
            if (0 === o.length) {
              if (i)
                throw {
                  error: "no_usable_index",
                  message: "There is no index available for this selector."
                };
              var u = r[0];
              return (u.defaultUsed = !0), u;
            }
            if (1 === o.length && !i) return o[0];
            var s = (function(e) {
              for (var t = {}, n = 0, r = e.length; n < r; n++) t[e[n]] = !0;
              return t;
            })(t);
            if (i) {
              var a = "_design/" + i[0],
                f = 2 === i.length && i[1],
                c = o.find(function(e) {
                  return !(!f || e.ddoc !== a || f !== e.name) || e.ddoc === a;
                });
              if (!c)
                throw {
                  error: "unknown_error",
                  message:
                    "Could not find that index or could not use that index for the query"
                };
              return c;
            }
            return (function(e, t) {
              for (var n = null, r = -1, i = 0, o = e.length; i < o; i++) {
                var u = e[i],
                  s = t(u);
                r < s && ((r = s), (n = u));
              }
              return n;
            })(o, function(e) {
              for (
                var t = e.def.fields.map(K), n = 0, r = 0, i = t.length;
                r < i;
                r++
              ) {
                var o = t[r];
                s[o] && n++;
              }
              return n;
            });
          }
          function yt(e, t) {
            var n,
              r = K(t.def.fields[0]),
              i = e[r] || {},
              o = [];
            return (
              Object.keys(i).forEach(function(e) {
                dt(e) && o.push(r);
                var t = (function(e, t) {
                  switch (e) {
                    case "$eq":
                      return { key: t };
                    case "$lte":
                      return { endkey: t };
                    case "$gte":
                      return { startkey: t };
                    case "$lt":
                      return { endkey: t, inclusive_end: !1 };
                    case "$gt":
                      return { startkey: t, inclusive_start: !1 };
                  }
                  return { startkey: ot };
                })(e, i[e]);
                n = n ? ve([n, t]) : t;
              }),
              { queryOpts: n, inMemoryFields: o }
            );
          }
          function vt(e, t) {
            switch (e) {
              case "$eq":
                return { startkey: t, endkey: t };
              case "$lte":
                return { endkey: t };
              case "$gte":
                return { startkey: t };
              case "$lt":
                return { endkey: t, inclusive_end: !1 };
              case "$gt":
                return { startkey: t, inclusive_start: !1 };
            }
          }
          function gt(e, t) {
            return t.defaultUsed
              ? (function(e) {
                  return {
                    queryOpts: { startkey: null },
                    inMemoryFields: [Object.keys(e)]
                  };
                })(e)
              : 1 === t.def.fields.length
              ? yt(e, t)
              : (function(e, t) {
                  var n,
                    r,
                    i = t.def.fields.map(K),
                    o = [],
                    u = [],
                    s = [];
                  function a(e) {
                    !1 !== n && u.push(ot),
                      !1 !== r && s.push(ut),
                      (o = i.slice(e));
                  }
                  for (var f = 0, c = i.length; f < c; f++) {
                    var l = e[i[f]];
                    if (!l || !Object.keys(l).length) {
                      a(f);
                      break;
                    }
                    if (0 < f) {
                      if (Object.keys(l).some(dt)) {
                        a(f);
                        break;
                      }
                      var d =
                          "$gt" in l ||
                          "$gte" in l ||
                          "$lt" in l ||
                          "$lte" in l,
                        h = Object.keys(e[i[f - 1]]),
                        p = me(h, ["$eq"]),
                        y = me(h, Object.keys(l));
                      if (d && !p && !y) {
                        a(f);
                        break;
                      }
                    }
                    for (
                      var v = Object.keys(l), g = null, m = 0;
                      m < v.length;
                      m++
                    ) {
                      var w = v[m],
                        b = vt(w, l[w]);
                      g = g ? ve([g, b]) : b;
                    }
                    u.push("startkey" in g ? g.startkey : ot),
                      s.push("endkey" in g ? g.endkey : ut),
                      "inclusive_start" in g && (n = g.inclusive_start),
                      "inclusive_end" in g && (r = g.inclusive_end);
                  }
                  var _ = { startkey: u, endkey: s };
                  return (
                    void 0 !== n && (_.inclusive_start = n),
                    void 0 !== r && (_.inclusive_end = r),
                    { queryOpts: _, inMemoryFields: o }
                  );
                })(e, t);
          }
          function mt(e, t) {
            var n = e.selector,
              r = (function(e, t) {
                var n,
                  r = Object.keys(e),
                  i = t ? t.map(K) : [];
                return (
                  (n = r.length >= i.length ? r : i),
                  0 === i.length
                    ? { fields: n }
                    : {
                        fields: (n = n.sort(function(e, t) {
                          var n = i.indexOf(e);
                          -1 === n && (n = Number.MAX_VALUE);
                          var r = i.indexOf(t);
                          return (
                            -1 === r && (r = Number.MAX_VALUE),
                            n < r ? -1 : r < n ? 1 : 0
                          );
                        })),
                        sortOrder: t.map(K)
                      }
                );
              })(n, e.sort),
              i = r.fields,
              o = pt(n, i, r.sortOrder, t, e.use_index),
              u = gt(n, o);
            return {
              queryOpts: u.queryOpts,
              index: o,
              inMemoryFields: ft(u.inMemoryFields, o, n, i)
            };
          }
          function wt(t, o, u) {
            return (
              o.selector && (o.selector = G(o.selector)),
              o.sort &&
                (o.sort = (function(e) {
                  if (!Array.isArray(e))
                    throw new Error("invalid sort json - should be an array");
                  return e.map(function(e) {
                    if ("string" != typeof e) return e;
                    var t = {};
                    return (t[e] = "asc"), t;
                  });
                })(o.sort)),
              o.use_index &&
                (o.use_index = (function(e) {
                  var t = [];
                  return (
                    "string" == typeof e ? t.push(e) : (t = e),
                    t.map(function(e) {
                      return e.replace("_design/", "");
                    })
                  );
                })(o.use_index)),
              (function(e) {
                if ("object" != typeof e.selector)
                  throw new Error(
                    "you must provide a selector when you find()"
                  );
              })(o),
              it(t).then(function(e) {
                t.constructor.emit("debug", ["find", "planning query", o]);
                var n = mt(o, e.indexes);
                t.constructor.emit("debug", ["find", "query plan", n]);
                var r = n.index;
                !(function(e, t) {
                  if (t.defaultUsed && e.sort) {
                    var n = e.sort
                      .filter(function(e) {
                        return "_id" !== Object.keys(e)[0];
                      })
                      .map(function(e) {
                        return Object.keys(e)[0];
                      });
                    if (0 < n.length)
                      throw new Error(
                        'Cannot sort on field(s) "' +
                          n.join(",") +
                          '" when using the default index'
                      );
                  }
                  t.defaultUsed;
                })(o, r);
                var i = k({ include_docs: !0, reduce: !1 }, n.queryOpts);
                return "startkey" in i &&
                  "endkey" in i &&
                  0 < Z(i.startkey, i.endkey)
                  ? { docs: [] }
                  : (o.sort &&
                      "string" != typeof o.sort[0] &&
                      "desc" === W(o.sort[0]) &&
                      ((i.descending = !0),
                      (i = (function(e) {
                        var t = h(e);
                        return (
                          delete t.startkey,
                          delete t.endkey,
                          delete t.inclusive_start,
                          delete t.inclusive_end,
                          "endkey" in e && (t.startkey = e.endkey),
                          "startkey" in e && (t.endkey = e.startkey),
                          "inclusive_start" in e &&
                            (t.inclusive_end = e.inclusive_start),
                          "inclusive_end" in e &&
                            (t.inclusive_start = e.inclusive_end),
                          t
                        );
                      })(i))),
                    n.inMemoryFields.length ||
                      ("limit" in o && (i.limit = o.limit),
                      "skip" in o && (i.skip = o.skip)),
                    u
                      ? Promise.resolve(n, i)
                      : Promise.resolve()
                          .then(function() {
                            if ("_all_docs" === r.name)
                              return (function(e, t) {
                                var n = h(t);
                                return (
                                  n.descending
                                    ? ("endkey" in n &&
                                        "string" != typeof n.endkey &&
                                        (n.endkey = ""),
                                      "startkey" in n &&
                                        "string" != typeof n.startkey &&
                                        (n.limit = 0))
                                    : ("startkey" in n &&
                                        "string" != typeof n.startkey &&
                                        (n.startkey = ""),
                                      "endkey" in n &&
                                        "string" != typeof n.endkey &&
                                        (n.limit = 0)),
                                  "key" in n &&
                                    "string" != typeof n.key &&
                                    (n.limit = 0),
                                  e.allDocs(n).then(function(e) {
                                    return (
                                      (e.rows = e.rows.filter(function(e) {
                                        return !/^_design\//.test(e.id);
                                      })),
                                      e
                                    );
                                  })
                                );
                              })(t, i);
                            var e = (function(e) {
                              return e.ddoc.substring(8) + "/" + e.name;
                            })(r);
                            return tt(t).query.call(t, e, i);
                          })
                          .then(function(e) {
                            !1 === i.inclusive_start &&
                              (e.rows = (function(e, t, n) {
                                for (
                                  var r = n.def.fields, i = 0, o = e.length;
                                  i < o;
                                  i++
                                ) {
                                  var u = rt(e[i].doc, n);
                                  if (1 === r.length) u = u[0];
                                  else for (; u.length > t.length; ) u.pop();
                                  if (0 < Math.abs(Z(u, t))) break;
                                }
                                return 0 < i ? e.slice(i) : e;
                              })(e.rows, i.startkey, r)),
                              n.inMemoryFields.length &&
                                (e.rows = ue(e.rows, o, n.inMemoryFields));
                            var t = {
                              docs: e.rows.map(function(e) {
                                var t = e.doc;
                                return o.fields
                                  ? (function(e, t) {
                                      for (
                                        var n = {}, r = 0, i = t.length;
                                        r < i;
                                        r++
                                      ) {
                                        var o = J(t[r]),
                                          u = T(e, o);
                                        void 0 !== u && F(n, o, u);
                                      }
                                      return n;
                                    })(t, o.fields)
                                  : t;
                              })
                            };
                            return (
                              r.defaultUsed &&
                                (t.warning =
                                  "no matching index found, create an index to optimize query time"),
                              t
                            );
                          }));
              })
            );
          }
          var bt = pe(function(t, n) {
              var e,
                r = h((n = M(n)).index);
              function i() {
                return e || (e = L(JSON.stringify(n)));
              }
              (n.index = nt(n.index)),
                (function(e) {
                  var t = e.fields.filter(function(e) {
                    return "asc" === W(e);
                  });
                  if (0 !== t.length && t.length !== e.fields.length)
                    throw new Error("unsupported mixed sorting");
                })(n.index);
              var o = n.name || "idx-" + i(),
                u = n.ddoc || "idx-" + i(),
                s = "_design/" + u,
                a = !1,
                f = !1;
              return (
                t.constructor.emit("debug", ["find", "creating index", s]),
                E(t, s, function(e) {
                  return (
                    e._rev && "query" !== e.language && (a = !0),
                    (e.language = "query"),
                    (e.views = e.views || {}),
                    !(f = !!e.views[o]) &&
                      ((e.views[o] = {
                        map: { fields: ve(n.index.fields) },
                        reduce: "_count",
                        options: { def: r }
                      }),
                      e)
                  );
                })
                  .then(function() {
                    if (a)
                      throw new Error(
                        'invalid language for ddoc with id "' +
                          s +
                          '" (should be "query")'
                      );
                  })
                  .then(function() {
                    var e = u + "/" + o;
                    return tt(t)
                      .query.call(t, e, { limit: 0, reduce: !1 })
                      .then(function() {
                        return {
                          id: s,
                          name: o,
                          result: f ? "exists" : "created"
                        };
                      });
                  })
              );
            }),
            _t = pe(wt),
            kt = pe(function(t, n) {
              return wt(t, n, !0).then(function(e) {
                return {
                  dbname: t.name,
                  index: e.index,
                  selector: n.selector,
                  range: {
                    start_key: e.queryOpts.startkey,
                    end_key: e.queryOpts.endkey
                  },
                  opts: {
                    use_index: n.use_index || [],
                    bookmark: "nil",
                    limit: n.limit,
                    skip: n.skip,
                    sort: n.sort || {},
                    fields: n.fields,
                    conflicts: !1,
                    r: [49]
                  },
                  limit: n.limit,
                  skip: n.skip || 0,
                  fields: n.fields
                };
              });
            }),
            $t = pe(it),
            xt = pe(function(e, t) {
              if (!t.ddoc)
                throw new Error("you must supply an index.ddoc when deleting");
              if (!t.name)
                throw new Error("you must supply an index.name when deleting");
              var n = t.ddoc,
                r = t.name;
              return E(e, n, function(e) {
                return 1 === Object.keys(e.views).length && e.views[r]
                  ? { _id: n, _deleted: !0 }
                  : (delete e.views[r], e);
              })
                .then(function() {
                  return tt(e).viewCleanup.apply(e);
                })
                .then(function() {
                  return { ok: !0 };
                });
            }),
            Ot = {};
          (Ot.createIndex = y(function(e, t) {
            if ("object" != typeof e)
              return t(new Error("you must provide an index to create"));
            (A(this) ? P : bt)(this, e, t);
          })),
            (Ot.find = y(function(e, t) {
              if (
                (void 0 === t && ((t = e), (e = void 0)), "object" != typeof e)
              )
                return t(
                  new Error("you must provide search parameters to find()")
                );
              (A(this) ? D : _t)(this, e, t);
            })),
            (Ot.explain = y(function(e, t) {
              if (
                (void 0 === t && ((t = e), (e = void 0)), "object" != typeof e)
              )
                return t(
                  new Error("you must provide search parameters to explain()")
                );
              (A(this) ? N : kt)(this, e, t);
            })),
            (Ot.getIndexes = y(function(e) {
              (A(this) ? I : $t)(this, e);
            })),
            (Ot.deleteIndex = y(function(e, t) {
              if ("object" != typeof e)
                return t(new Error("you must provide an index to delete"));
              (A(this) ? U : xt)(this, e, t);
            })),
            "undefined" == typeof PouchDB
              ? _(
                  "error",
                  'pouchdb-find plugin error: Cannot find global "PouchDB" object! Did you remember to include pouchdb.js?'
                )
              : PouchDB.plugin(Ot);
        }.call(
          this,
          "undefined" != typeof global
            ? global
            : "undefined" != typeof self
            ? self
            : "undefined" != typeof window
            ? window
            : {}
        ));
      },
      { 1: 1, 2: 2, 3: 3, 4: 4, 5: 5, 6: 6 }
    ]
  },
  {},
  [11]
);
