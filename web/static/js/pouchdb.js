/**
 * Minified by jsDelivr using Terser v3.14.1.
 * Original file: /npm/pouchdb@7.1.1/lib/index.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
"use strict";
function _interopDefault(e) {
  return e && "object" == typeof e && "default" in e ? e.default : e;
}
var ExportedSet,
  ExportedMap,
  cloneBuffer = _interopDefault(require("clone-buffer")),
  uuidV4 = _interopDefault(require("uuid")),
  crypto = _interopDefault(require("crypto")),
  nodeFetch = require("node-fetch"),
  nodeFetch__default = _interopDefault(nodeFetch),
  fetchCookie = _interopDefault(require("fetch-cookie")),
  levelup = _interopDefault(require("levelup")),
  ltgt = _interopDefault(require("ltgt")),
  Codec = _interopDefault(require("level-codec")),
  ReadableStreamCore = _interopDefault(require("readable-stream")),
  Deque = _interopDefault(require("double-ended-queue")),
  bufferFrom = _interopDefault(require("buffer-from")),
  vuvuzela = _interopDefault(require("vuvuzela")),
  fs = _interopDefault(require("fs")),
  path = _interopDefault(require("path")),
  level = _interopDefault(require("level")),
  through2 = require("through2"),
  LevelWriteStream = _interopDefault(require("level-write-stream")),
  vm = _interopDefault(require("vm")),
  getArguments = _interopDefault(require("argsarray")),
  inherits = _interopDefault(require("inherits")),
  events = require("events"),
  events__default = _interopDefault(events);
function mangle(e) {
  return "$" + e;
}
function unmangle(e) {
  return e.substring(1);
}
function Map$1() {
  this._store = {};
}
function Set$1(e) {
  if (((this._store = new Map$1()), e && Array.isArray(e)))
    for (var t = 0, n = e.length; t < n; t++) this.add(e[t]);
}
function supportsMapAndSet() {
  if (
    "undefined" == typeof Symbol ||
    "undefined" == typeof Map ||
    "undefined" == typeof Set
  )
    return !1;
  var e = Object.getOwnPropertyDescriptor(Map, Symbol.species);
  return e && "get" in e && Map[Symbol.species] === Map;
}
function isBinaryObject(e) {
  return e instanceof Buffer;
}
(Map$1.prototype.get = function(e) {
  var t = mangle(e);
  return this._store[t];
}),
  (Map$1.prototype.set = function(e, t) {
    var n = mangle(e);
    return (this._store[n] = t), !0;
  }),
  (Map$1.prototype.has = function(e) {
    return mangle(e) in this._store;
  }),
  (Map$1.prototype.delete = function(e) {
    var t = mangle(e),
      n = t in this._store;
    return delete this._store[t], n;
  }),
  (Map$1.prototype.forEach = function(e) {
    for (var t = Object.keys(this._store), n = 0, r = t.length; n < r; n++) {
      var o = t[n];
      e(this._store[o], (o = unmangle(o)));
    }
  }),
  Object.defineProperty(Map$1.prototype, "size", {
    get: function() {
      return Object.keys(this._store).length;
    }
  }),
  (Set$1.prototype.add = function(e) {
    return this._store.set(e, !0);
  }),
  (Set$1.prototype.has = function(e) {
    return this._store.has(e);
  }),
  (Set$1.prototype.forEach = function(e) {
    this._store.forEach(function(t, n) {
      e(n);
    });
  }),
  Object.defineProperty(Set$1.prototype, "size", {
    get: function() {
      return this._store.size;
    }
  }),
  supportsMapAndSet()
    ? ((ExportedSet = Set), (ExportedMap = Map))
    : ((ExportedSet = Set$1), (ExportedMap = Map$1));
var funcToString = Function.prototype.toString,
  objectCtorString = funcToString.call(Object);
function isPlainObject(e) {
  var t = Object.getPrototypeOf(e);
  if (null === t) return !0;
  var n = t.constructor;
  return (
    "function" == typeof n &&
    n instanceof n &&
    funcToString.call(n) == objectCtorString
  );
}
function clone(e) {
  var t, n, r;
  if (!e || "object" != typeof e) return e;
  if (Array.isArray(e)) {
    for (t = [], n = 0, r = e.length; n < r; n++) t[n] = clone(e[n]);
    return t;
  }
  if (e instanceof Date) return e.toISOString();
  if (isBinaryObject(e)) return cloneBuffer(e);
  if (!isPlainObject(e)) return e;
  for (n in ((t = {}), e))
    if (Object.prototype.hasOwnProperty.call(e, n)) {
      var o = clone(e[n]);
      void 0 !== o && (t[n] = o);
    }
  return t;
}
function once(e) {
  var t = !1;
  return getArguments(function(n) {
    if (t) throw new Error("once called more than once");
    (t = !0), e.apply(this, n);
  });
}
function toPromise(e) {
  return getArguments(function(t) {
    t = clone(t);
    var n = this,
      r = "function" == typeof t[t.length - 1] && t.pop(),
      o = new Promise(function(r, o) {
        var i;
        try {
          var a = once(function(e, t) {
            e ? o(e) : r(t);
          });
          t.push(a), (i = e.apply(n, t)) && "function" == typeof i.then && r(i);
        } catch (e) {
          o(e);
        }
      });
    return (
      r &&
        o.then(function(e) {
          r(null, e);
        }, r),
      o
    );
  });
}
function logApiCall(e, t, n) {
  if (e.constructor.listeners("debug").length) {
    for (var r = ["api", e.name, t], o = 0; o < n.length - 1; o++) r.push(n[o]);
    e.constructor.emit("debug", r);
    var i = n[n.length - 1];
    n[n.length - 1] = function(n, r) {
      var o = ["api", e.name, t];
      (o = o.concat(n ? ["error", n] : ["success", r])),
        e.constructor.emit("debug", o),
        i(n, r);
    };
  }
}
function adapterFun(e, t) {
  return toPromise(
    getArguments(function(n) {
      if (this._closed) return Promise.reject(new Error("database is closed"));
      if (this._destroyed)
        return Promise.reject(new Error("database is destroyed"));
      var r = this;
      return (
        logApiCall(r, e, n),
        this.taskqueue.isReady
          ? t.apply(this, n)
          : new Promise(function(t, o) {
              r.taskqueue.addTask(function(i) {
                i ? o(i) : t(r[e].apply(r, n));
              });
            })
      );
    })
  );
}
function pick(e, t) {
  for (var n = {}, r = 0, o = t.length; r < o; r++) {
    var i = t[r];
    i in e && (n[i] = e[i]);
  }
  return n;
}
var MAX_NUM_CONCURRENT_REQUESTS = 6;
function identityFunction(e) {
  return e;
}
function formatResultForOpenRevsGet(e) {
  return [{ ok: e }];
}
function bulkGet(e, t, n) {
  var r = t.docs,
    o = new ExportedMap();
  r.forEach(function(e) {
    o.has(e.id) ? o.get(e.id).push(e) : o.set(e.id, [e]);
  });
  var i = o.size,
    a = 0,
    c = new Array(i);
  function s() {
    var e;
    ++a === i &&
      ((e = []),
      c.forEach(function(t) {
        t.docs.forEach(function(n) {
          e.push({ id: t.id, docs: [n] });
        });
      }),
      n(null, { results: e }));
  }
  var u = [];
  o.forEach(function(e, t) {
    u.push(t);
  });
  var l = 0;
  function f() {
    if (!(l >= u.length)) {
      var n = Math.min(l + MAX_NUM_CONCURRENT_REQUESTS, u.length),
        r = u.slice(l, n);
      !(function(n, r) {
        n.forEach(function(n, i) {
          var a = r + i,
            u = o.get(n),
            l = pick(u[0], ["atts_since", "attachments"]);
          (l.open_revs = u.map(function(e) {
            return e.rev;
          })),
            (l.open_revs = l.open_revs.filter(identityFunction));
          var d = identityFunction;
          0 === l.open_revs.length &&
            (delete l.open_revs, (d = formatResultForOpenRevsGet)),
            ["revs", "attachments", "binary", "ajax", "latest"].forEach(
              function(e) {
                e in t && (l[e] = t[e]);
              }
            ),
            e.get(n, l, function(e, t) {
              var r, o, i;
              (r = e ? [{ error: e }] : d(t)),
                (o = n),
                (i = r),
                (c[a] = { id: o, docs: i }),
                s(),
                f();
            });
        });
      })(r, l),
        (l += r.length);
    }
  }
  f();
}
function hasLocalStorage() {
  return !1;
}
function nextTick(e) {
  process.nextTick(e);
}
function attachBrowserEvents(e) {
  hasLocalStorage() &&
    addEventListener("storage", function(t) {
      e.emit(t.key);
    });
}
function Changes() {
  events.EventEmitter.call(this),
    (this._listeners = {}),
    attachBrowserEvents(this);
}
function guardedConsole(e) {
  if ("undefined" != typeof console && "function" == typeof console[e]) {
    var t = Array.prototype.slice.call(arguments, 1);
    console[e].apply(console, t);
  }
}
function randomNumber(e, t) {
  return (
    (e = parseInt(e, 10) || 0),
    (t = parseInt(t, 10)) != t || t <= e ? (t = (e || 1) << 1) : (t += 1),
    t > 6e5 && ((e = 3e5), (t = 6e5)),
    ~~((t - e) * Math.random() + e)
  );
}
function defaultBackOff(e) {
  var t = 0;
  return e || (t = 2e3), randomNumber(e, t);
}
inherits(Changes, events.EventEmitter),
  (Changes.prototype.addListener = function(e, t, n, r) {
    if (!this._listeners[t]) {
      var o = this,
        i = !1;
      (this._listeners[t] = a), this.on(e, a);
    }
    function a() {
      if (o._listeners[t])
        if (i) i = "waiting";
        else {
          i = !0;
          var e = pick(r, [
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
              "waiting" === i && nextTick(a), (i = !1);
            })
            .on("error", function() {
              i = !1;
            });
        }
    }
  }),
  (Changes.prototype.removeListener = function(e, t) {
    t in this._listeners &&
      (events.EventEmitter.prototype.removeListener.call(
        this,
        e,
        this._listeners[t]
      ),
      delete this._listeners[t]);
  }),
  (Changes.prototype.notifyLocalWindows = function(e) {
    hasLocalStorage() &&
      (localStorage[e] = "a" === localStorage[e] ? "b" : "a");
  }),
  (Changes.prototype.notify = function(e) {
    this.emit(e), this.notifyLocalWindows(e);
  });
var assign,
  res = function() {},
  $inject_Object_assign = (assign =
    "function" == typeof Object.assign
      ? Object.assign
      : function(e) {
          for (var t = Object(e), n = 1; n < arguments.length; n++) {
            var r = arguments[n];
            if (null != r)
              for (var o in r)
                Object.prototype.hasOwnProperty.call(r, o) && (t[o] = r[o]);
          }
          return t;
        });
function PouchError(e, t, n) {
  Error.call(this, n),
    (this.status = e),
    (this.name = t),
    (this.message = n),
    (this.error = !0);
}
inherits(PouchError, Error),
  (PouchError.prototype.toString = function() {
    return JSON.stringify({
      status: this.status,
      name: this.name,
      message: this.message,
      reason: this.reason
    });
  });
var UNAUTHORIZED = new PouchError(
    401,
    "unauthorized",
    "Name or password is incorrect."
  ),
  MISSING_BULK_DOCS = new PouchError(
    400,
    "bad_request",
    "Missing JSON list of 'docs'"
  ),
  MISSING_DOC = new PouchError(404, "not_found", "missing"),
  REV_CONFLICT = new PouchError(409, "conflict", "Document update conflict"),
  INVALID_ID = new PouchError(
    400,
    "bad_request",
    "_id field must contain a string"
  ),
  MISSING_ID = new PouchError(412, "missing_id", "_id is required for puts"),
  RESERVED_ID = new PouchError(
    400,
    "bad_request",
    "Only reserved document ids may start with underscore."
  ),
  NOT_OPEN = new PouchError(412, "precondition_failed", "Database not open"),
  UNKNOWN_ERROR = new PouchError(
    500,
    "unknown_error",
    "Database encountered an unknown error"
  ),
  BAD_ARG = new PouchError(500, "badarg", "Some query argument is invalid"),
  INVALID_REQUEST = new PouchError(
    400,
    "invalid_request",
    "Request was invalid"
  ),
  QUERY_PARSE_ERROR = new PouchError(
    400,
    "query_parse_error",
    "Some query parameter is invalid"
  ),
  DOC_VALIDATION = new PouchError(
    500,
    "doc_validation",
    "Bad special document member"
  ),
  BAD_REQUEST = new PouchError(
    400,
    "bad_request",
    "Something wrong with the request"
  ),
  NOT_AN_OBJECT = new PouchError(
    400,
    "bad_request",
    "Document must be a JSON object"
  ),
  DB_MISSING = new PouchError(404, "not_found", "Database not found"),
  IDB_ERROR = new PouchError(500, "indexed_db_went_bad", "unknown"),
  WSQ_ERROR = new PouchError(500, "web_sql_went_bad", "unknown"),
  LDB_ERROR = new PouchError(500, "levelDB_went_went_bad", "unknown"),
  FORBIDDEN = new PouchError(
    403,
    "forbidden",
    "Forbidden by design doc validate_doc_update function"
  ),
  INVALID_REV = new PouchError(400, "bad_request", "Invalid rev format"),
  FILE_EXISTS = new PouchError(
    412,
    "file_exists",
    "The database could not be created, the file already exists."
  ),
  MISSING_STUB = new PouchError(
    412,
    "missing_stub",
    "A pre-existing attachment stub wasn't found"
  ),
  INVALID_URL = new PouchError(413, "invalid_url", "Provided URL is invalid");
function createError(e, t) {
  function n(t) {
    for (var n in e) "function" != typeof e[n] && (this[n] = e[n]);
    void 0 !== t && (this.reason = t);
  }
  return (n.prototype = PouchError.prototype), new n(t);
}
function generateErrorFromResponse(e) {
  if ("object" != typeof e) {
    var t = e;
    (e = UNKNOWN_ERROR).data = t;
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
function tryFilter(e, t, n) {
  try {
    return !e(t, n);
  } catch (e) {
    var r = "Filter function threw: " + e.toString();
    return createError(BAD_REQUEST, r);
  }
}
function filterChange(e) {
  var t = {},
    n = e.filter && "function" == typeof e.filter;
  return (
    (t.query = e.query_params),
    function(r) {
      r.doc || (r.doc = {});
      var o = n && tryFilter(e.filter, r.doc, t);
      if ("object" == typeof o) return o;
      if (o) return !1;
      if (e.include_docs) {
        if (!e.attachments)
          for (var i in r.doc._attachments)
            r.doc._attachments.hasOwnProperty(i) &&
              (r.doc._attachments[i].stub = !0);
      } else delete r.doc;
      return !0;
    }
  );
}
function flatten(e) {
  for (var t = [], n = 0, r = e.length; n < r; n++) t = t.concat(e[n]);
  return t;
}
function f() {}
var res$1,
  hasName = f.name,
  functionName = (res$1 = hasName
    ? function(e) {
        return e.name;
      }
    : function(e) {
        var t = e.toString().match(/^\s*function\s*(?:(\S+)\s*)?\(/);
        return t && t[1] ? t[1] : "";
      });
function invalidIdError(e) {
  var t;
  if (
    (e
      ? "string" != typeof e
        ? (t = createError(INVALID_ID))
        : /^_/.test(e) &&
          !/^_(design|local)/.test(e) &&
          (t = createError(RESERVED_ID))
      : (t = createError(MISSING_ID)),
    t)
  )
    throw t;
}
function isRemote(e) {
  return "boolean" == typeof e._remote
    ? e._remote
    : "function" == typeof e.type &&
        (guardedConsole(
          "warn",
          "db.type() is deprecated and will be removed in a future version of PouchDB"
        ),
        "http" === e.type());
}
function listenerCount(e, t) {
  return "listenerCount" in e
    ? e.listenerCount(t)
    : events.EventEmitter.listenerCount(e, t);
}
function parseDesignDocFunctionName(e) {
  if (!e) return null;
  var t = e.split("/");
  return 2 === t.length ? t : 1 === t.length ? [e, e] : null;
}
function normalizeDesignDocFunctionName(e) {
  var t = parseDesignDocFunctionName(e);
  return t ? t.join("/") : null;
}
var keys = [
    "source",
    "protocol",
    "authority",
    "userInfo",
    "user",
    "password",
    "host",
    "port",
    "relative",
    "path",
    "directory",
    "file",
    "query",
    "anchor"
  ],
  qName = "queryKey",
  qParser = /(?:^|&)([^&=]*)=?([^&]*)/g,
  parser = /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;
function parseUri(e) {
  for (var t = parser.exec(e), n = {}, r = 14; r--; ) {
    var o = keys[r],
      i = t[r] || "",
      a = -1 !== ["user", "password"].indexOf(o);
    n[o] = a ? decodeURIComponent(i) : i;
  }
  return (
    (n[qName] = {}),
    n[keys[12]].replace(qParser, function(e, t, r) {
      t && (n[qName][t] = r);
    }),
    n
  );
}
function upsert(e, t, n) {
  return new Promise(function(r, o) {
    e.get(t, function(i, a) {
      if (i) {
        if (404 !== i.status) return o(i);
        a = {};
      }
      var c = a._rev,
        s = n(a);
      if (!s) return r({ updated: !1, rev: c });
      (s._id = t), (s._rev = c), r(tryAndPut(e, s, n));
    });
  });
}
function tryAndPut(e, t, n) {
  return e.put(t).then(
    function(e) {
      return { updated: !0, rev: e.rev };
    },
    function(r) {
      if (409 !== r.status) throw r;
      return upsert(e, t._id, n);
    }
  );
}
function binaryMd5(e, t) {
  t(
    crypto
      .createHash("md5")
      .update(e, "binary")
      .digest("base64")
  );
}
function stringMd5(e) {
  return crypto
    .createHash("md5")
    .update(e, "binary")
    .digest("hex");
}
function rev(e, t) {
  var n = clone(e);
  return t
    ? (delete n._rev_tree, stringMd5(JSON.stringify(n)))
    : uuidV4
        .v4()
        .replace(/-/g, "")
        .toLowerCase();
}
var uuid = uuidV4.v4;
function winningRev(e) {
  for (var t, n, r, o, i = e.rev_tree.slice(); (o = i.pop()); ) {
    var a = o.ids,
      c = a[2],
      s = o.pos;
    if (c.length)
      for (var u = 0, l = c.length; u < l; u++)
        i.push({ pos: s + 1, ids: c[u] });
    else {
      var f = !!a[1].deleted,
        d = a[0];
      (t && !(r !== f ? r : n !== s ? n < s : t < d)) ||
        ((t = d), (n = s), (r = f));
    }
  }
  return n + "-" + t;
}
function traverseRevTree(e, t) {
  for (var n, r = e.slice(); (n = r.pop()); )
    for (
      var o = n.pos,
        i = n.ids,
        a = i[2],
        c = t(0 === a.length, o, i[0], n.ctx, i[1]),
        s = 0,
        u = a.length;
      s < u;
      s++
    )
      r.push({ pos: o + 1, ids: a[s], ctx: c });
}
function sortByPos(e, t) {
  return e.pos - t.pos;
}
function collectLeaves(e) {
  var t = [];
  traverseRevTree(e, function(e, n, r, o, i) {
    e && t.push({ rev: n + "-" + r, pos: n, opts: i });
  }),
    t.sort(sortByPos).reverse();
  for (var n = 0, r = t.length; n < r; n++) delete t[n].pos;
  return t;
}
function collectConflicts(e) {
  for (
    var t = winningRev(e),
      n = collectLeaves(e.rev_tree),
      r = [],
      o = 0,
      i = n.length;
    o < i;
    o++
  ) {
    var a = n[o];
    a.rev === t || a.opts.deleted || r.push(a.rev);
  }
  return r;
}
function compactTree(e) {
  var t = [];
  return (
    traverseRevTree(e.rev_tree, function(e, n, r, o, i) {
      "available" !== i.status ||
        e ||
        (t.push(n + "-" + r), (i.status = "missing"));
    }),
    t
  );
}
function rootToLeaf(e) {
  for (var t, n = [], r = e.slice(); (t = r.pop()); ) {
    var o = t.pos,
      i = t.ids,
      a = i[0],
      c = i[1],
      s = i[2],
      u = 0 === s.length,
      l = t.history ? t.history.slice() : [];
    l.push({ id: a, opts: c }), u && n.push({ pos: o + 1 - l.length, ids: l });
    for (var f = 0, d = s.length; f < d; f++)
      r.push({ pos: o + 1, ids: s[f], history: l });
  }
  return n.reverse();
}
function sortByPos$1(e, t) {
  return e.pos - t.pos;
}
function binarySearch(e, t, n) {
  for (var r, o = 0, i = e.length; o < i; )
    n(e[(r = (o + i) >>> 1)], t) < 0 ? (o = r + 1) : (i = r);
  return o;
}
function insertSorted(e, t, n) {
  var r = binarySearch(e, t, n);
  e.splice(r, 0, t);
}
function pathToTree(e, t) {
  for (var n, r, o = t, i = e.length; o < i; o++) {
    var a = e[o],
      c = [a.id, a.opts, []];
    r ? (r[2].push(c), (r = c)) : (n = r = c);
  }
  return n;
}
function compareTree(e, t) {
  return e[0] < t[0] ? -1 : 1;
}
function mergeTree(e, t) {
  for (var n = [{ tree1: e, tree2: t }], r = !1; n.length > 0; ) {
    var o = n.pop(),
      i = o.tree1,
      a = o.tree2;
    (i[1].status || a[1].status) &&
      (i[1].status =
        "available" === i[1].status || "available" === a[1].status
          ? "available"
          : "missing");
    for (var c = 0; c < a[2].length; c++)
      if (i[2][0]) {
        for (var s = !1, u = 0; u < i[2].length; u++)
          i[2][u][0] === a[2][c][0] &&
            (n.push({ tree1: i[2][u], tree2: a[2][c] }), (s = !0));
        s || ((r = "new_branch"), insertSorted(i[2], a[2][c], compareTree));
      } else (r = "new_leaf"), (i[2][0] = a[2][c]);
  }
  return { conflicts: r, tree: e };
}
function doMerge(e, t, n) {
  var r,
    o = [],
    i = !1,
    a = !1;
  if (!e.length) return { tree: [t], conflicts: "new_leaf" };
  for (var c = 0, s = e.length; c < s; c++) {
    var u = e[c];
    if (u.pos === t.pos && u.ids[0] === t.ids[0])
      (r = mergeTree(u.ids, t.ids)),
        o.push({ pos: u.pos, ids: r.tree }),
        (i = i || r.conflicts),
        (a = !0);
    else if (!0 !== n) {
      var l = u.pos < t.pos ? u : t,
        f = u.pos < t.pos ? t : u,
        d = f.pos - l.pos,
        p = [],
        h = [];
      for (
        h.push({ ids: l.ids, diff: d, parent: null, parentIdx: null });
        h.length > 0;

      ) {
        var v = h.pop();
        if (0 !== v.diff)
          for (var _ = v.ids[2], m = 0, g = _.length; m < g; m++)
            h.push({
              ids: _[m],
              diff: v.diff - 1,
              parent: v.ids,
              parentIdx: m
            });
        else v.ids[0] === f.ids[0] && p.push(v);
      }
      var y = p[0];
      y
        ? ((r = mergeTree(y.ids, f.ids)),
          (y.parent[2][y.parentIdx] = r.tree),
          o.push({ pos: l.pos, ids: l.ids }),
          (i = i || r.conflicts),
          (a = !0))
        : o.push(u);
    } else o.push(u);
  }
  return (
    a || o.push(t),
    o.sort(sortByPos$1),
    { tree: o, conflicts: i || "internal_node" }
  );
}
function stem(e, t) {
  for (var n, r, o = rootToLeaf(e), i = 0, a = o.length; i < a; i++) {
    var c,
      s = o[i],
      u = s.ids;
    if (u.length > t) {
      n || (n = {});
      var l = u.length - t;
      c = { pos: s.pos + l, ids: pathToTree(u, l) };
      for (var f = 0; f < l; f++) {
        var d = s.pos + f + "-" + u[f].id;
        n[d] = !0;
      }
    } else c = { pos: s.pos, ids: pathToTree(u, 0) };
    r = r ? doMerge(r, c, !0).tree : [c];
  }
  return (
    n &&
      traverseRevTree(r, function(e, t, r) {
        delete n[t + "-" + r];
      }),
    { tree: r, revs: n ? Object.keys(n) : [] }
  );
}
function merge(e, t, n) {
  var r = doMerge(e, t),
    o = stem(r.tree, n);
  return { tree: o.tree, stemmedRevs: o.revs, conflicts: r.conflicts };
}
function revExists(e, t) {
  for (
    var n, r = e.slice(), o = t.split("-"), i = parseInt(o[0], 10), a = o[1];
    (n = r.pop());

  ) {
    if (n.pos === i && n.ids[0] === a) return !0;
    for (var c = n.ids[2], s = 0, u = c.length; s < u; s++)
      r.push({ pos: n.pos + 1, ids: c[s] });
  }
  return !1;
}
function getTrees(e) {
  return e.ids;
}
function isDeleted(e, t) {
  t || (t = winningRev(e));
  for (
    var n, r = t.substring(t.indexOf("-") + 1), o = e.rev_tree.map(getTrees);
    (n = o.pop());

  ) {
    if (n[0] === r) return !!n[1].deleted;
    o = o.concat(n[2]);
  }
}
function isLocalId(e) {
  return /^_local/.test(e);
}
function latest(e, t) {
  for (var n, r = t.rev_tree.slice(); (n = r.pop()); ) {
    var o = n.pos,
      i = n.ids,
      a = i[0],
      c = i[1],
      s = i[2],
      u = 0 === s.length,
      l = n.history ? n.history.slice() : [];
    if ((l.push({ id: a, pos: o, opts: c }), u))
      for (var f = 0, d = l.length; f < d; f++) {
        var p = l[f];
        if (p.pos + "-" + p.id === e) return o + "-" + a;
      }
    for (var h = 0, v = s.length; h < v; h++)
      r.push({ pos: o + 1, ids: s[h], history: l });
  }
  throw new Error(
    "Unable to resolve latest revision for id " + t.id + ", rev " + e
  );
}
function tryCatchInChangeListener(e, t, n, r) {
  try {
    e.emit("change", t, n, r);
  } catch (e) {
    guardedConsole("error", 'Error in .on("change", function):', e);
  }
}
function Changes$1(e, t, n) {
  events.EventEmitter.call(this);
  var r = this;
  this.db = e;
  var o = ((t = t ? clone(t) : {}).complete = once(function(t, n) {
    t
      ? listenerCount(r, "error") > 0 && r.emit("error", t)
      : r.emit("complete", n),
      r.removeAllListeners(),
      e.removeListener("destroyed", i);
  }));
  function i() {
    r.cancel();
  }
  n &&
    (r.on("complete", function(e) {
      n(null, e);
    }),
    r.on("error", n)),
    e.once("destroyed", i),
    (t.onChange = function(e, t, n) {
      r.isCancelled || tryCatchInChangeListener(r, e, t, n);
    });
  var a = new Promise(function(e, n) {
    t.complete = function(t, r) {
      t ? n(t) : e(r);
    };
  });
  r.once("cancel", function() {
    e.removeListener("destroyed", i), t.complete(null, { status: "cancelled" });
  }),
    (this.then = a.then.bind(a)),
    (this.catch = a.catch.bind(a)),
    this.then(function(e) {
      o(null, e);
    }, o),
    e.taskqueue.isReady
      ? r.validateChanges(t)
      : e.taskqueue.addTask(function(e) {
          e
            ? t.complete(e)
            : r.isCancelled
            ? r.emit("cancel")
            : r.validateChanges(t);
        });
}
function processChange(e, t, n) {
  var r = [{ rev: e._rev }];
  "all_docs" === n.style &&
    (r = collectLeaves(t.rev_tree).map(function(e) {
      return { rev: e.rev };
    }));
  var o = { id: t.id, changes: r, doc: e };
  return (
    isDeleted(t, e._rev) && (o.deleted = !0),
    n.conflicts &&
      ((o.doc._conflicts = collectConflicts(t)),
      o.doc._conflicts.length || delete o.doc._conflicts),
    o
  );
}
function compare(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function yankError(e, t) {
  return function(n, r) {
    n || (r[0] && r[0].error)
      ? (((n = n || r[0]).docId = t), e(n))
      : e(null, r.length ? r[0] : r);
  };
}
function cleanDocs(e) {
  for (var t = 0; t < e.length; t++) {
    var n = e[t];
    if (n._deleted) delete n._attachments;
    else if (n._attachments)
      for (var r = Object.keys(n._attachments), o = 0; o < r.length; o++) {
        var i = r[o];
        n._attachments[i] = pick(n._attachments[i], [
          "data",
          "digest",
          "content_type",
          "length",
          "revpos",
          "stub"
        ]);
      }
  }
}
function compareByIdThenRev(e, t) {
  var n = compare(e._id, t._id);
  return 0 !== n
    ? n
    : compare(
        e._revisions ? e._revisions.start : 0,
        t._revisions ? t._revisions.start : 0
      );
}
function computeHeight(e) {
  var t = {},
    n = [];
  return (
    traverseRevTree(e, function(e, r, o, i) {
      var a = r + "-" + o;
      return e && (t[a] = 0), void 0 !== i && n.push({ from: i, to: a }), a;
    }),
    n.reverse(),
    n.forEach(function(e) {
      void 0 === t[e.from]
        ? (t[e.from] = 1 + t[e.to])
        : (t[e.from] = Math.min(t[e.from], 1 + t[e.to]));
    }),
    t
  );
}
function allDocsKeysParse(e) {
  var t =
    "limit" in e
      ? e.keys.slice(e.skip, e.limit + e.skip)
      : e.skip > 0
      ? e.keys.slice(e.skip)
      : e.keys;
  (e.keys = t),
    (e.skip = 0),
    delete e.limit,
    e.descending && (t.reverse(), (e.descending = !1));
}
function doNextCompaction(e) {
  var t = e._compactionQueue[0],
    n = t.opts,
    r = t.callback;
  e.get("_local/compaction")
    .catch(function() {
      return !1;
    })
    .then(function(t) {
      t && t.last_seq && (n.last_seq = t.last_seq),
        e._compact(n, function(t, n) {
          t ? r(t) : r(null, n),
            nextTick(function() {
              e._compactionQueue.shift(),
                e._compactionQueue.length && doNextCompaction(e);
            });
        });
    });
}
function attachmentNameError(e) {
  return (
    "_" === e.charAt(0) &&
    e +
      " is not a valid attachment name, attachment names cannot start with '_'"
  );
}
function AbstractPouchDB() {
  for (var e in (events.EventEmitter.call(this), AbstractPouchDB.prototype))
    "function" == typeof this[e] && (this[e] = this[e].bind(this));
}
function TaskQueue() {
  (this.isReady = !1), (this.failed = !1), (this.queue = []);
}
function parseAdapter(e, t) {
  var n = e.match(/([a-z-]*):\/\/(.*)/);
  if (n)
    return {
      name: /https?/.test(n[1]) ? n[1] + "://" + n[2] : n[2],
      adapter: n[1]
    };
  var r = PouchDB.adapters,
    o = PouchDB.preferredAdapters,
    i = PouchDB.prefix,
    a = t.adapter;
  if (!a)
    for (
      var c = 0;
      c < o.length &&
      "idb" === (a = o[c]) &&
      "websql" in r &&
      hasLocalStorage() &&
      localStorage["_pouch__websqldb_" + i + e];
      ++c
    )
      guardedConsole(
        "log",
        'PouchDB is downgrading "' +
          e +
          '" to WebSQL to avoid data loss, because it was already opened with WebSQL.'
      );
  var s = r[a];
  return {
    name: !(s && "use_prefix" in s) || s.use_prefix ? i + e : e,
    adapter: a
  };
}
function prepareForDestruction(e) {
  function t(t) {
    e.removeListener("closed", n), t || e.constructor.emit("destroyed", e.name);
  }
  function n() {
    e.removeListener("destroyed", t), e.constructor.emit("unref", e);
  }
  e.once("destroyed", t), e.once("closed", n), e.constructor.emit("ref", e);
}
function PouchDB(e, t) {
  if (!(this instanceof PouchDB)) return new PouchDB(e, t);
  var n = this;
  if (
    ((t = t || {}),
    e && "object" == typeof e && ((e = (t = e).name), delete t.name),
    void 0 === t.deterministic_revs && (t.deterministic_revs = !0),
    (this.__opts = t = clone(t)),
    (n.auto_compaction = t.auto_compaction),
    (n.prefix = PouchDB.prefix),
    "string" != typeof e)
  )
    throw new Error("Missing/invalid DB name");
  var r = parseAdapter((t.prefix || "") + e, t);
  if (
    ((t.name = r.name),
    (t.adapter = t.adapter || r.adapter),
    (n.name = e),
    (n._adapter = t.adapter),
    PouchDB.emit("debug", ["adapter", "Picked adapter: ", t.adapter]),
    !PouchDB.adapters[t.adapter] || !PouchDB.adapters[t.adapter].valid())
  )
    throw new Error("Invalid Adapter: " + t.adapter);
  AbstractPouchDB.call(n),
    (n.taskqueue = new TaskQueue()),
    (n.adapter = t.adapter),
    PouchDB.adapters[t.adapter].call(n, t, function(e) {
      if (e) return n.taskqueue.fail(e);
      prepareForDestruction(n),
        n.emit("created", n),
        PouchDB.emit("created", n.name),
        n.taskqueue.ready(n);
    });
}
inherits(Changes$1, events.EventEmitter),
  (Changes$1.prototype.cancel = function() {
    (this.isCancelled = !0), this.db.taskqueue.isReady && this.emit("cancel");
  }),
  (Changes$1.prototype.validateChanges = function(e) {
    var t = e.complete,
      n = this;
    PouchDB._changesFilterPlugin
      ? PouchDB._changesFilterPlugin.validate(e, function(r) {
          if (r) return t(r);
          n.doChanges(e);
        })
      : n.doChanges(e);
  }),
  (Changes$1.prototype.doChanges = function(e) {
    var t = this,
      n = e.complete;
    if (
      ("live" in (e = clone(e)) &&
        !("continuous" in e) &&
        (e.continuous = e.live),
      (e.processChange = processChange),
      "latest" === e.since && (e.since = "now"),
      e.since || (e.since = 0),
      "now" !== e.since)
    ) {
      if (PouchDB._changesFilterPlugin) {
        if (
          (PouchDB._changesFilterPlugin.normalize(e),
          PouchDB._changesFilterPlugin.shouldFilter(this, e))
        )
          return PouchDB._changesFilterPlugin.filter(this, e);
      } else
        ["doc_ids", "filter", "selector", "view"].forEach(function(t) {
          t in e &&
            guardedConsole(
              "warn",
              'The "' +
                t +
                '" option was passed in to changes/replicate, but pouchdb-changes-filter plugin is not installed, so it was ignored. Please install the plugin to enable filtering.'
            );
        });
      "descending" in e || (e.descending = !1),
        (e.limit = 0 === e.limit ? 1 : e.limit),
        (e.complete = n);
      var r = this.db._changes(e);
      if (r && "function" == typeof r.cancel) {
        var o = t.cancel;
        t.cancel = getArguments(function(e) {
          r.cancel(), o.apply(this, e);
        });
      }
    } else
      this.db.info().then(function(r) {
        t.isCancelled
          ? n(null, { status: "cancelled" })
          : ((e.since = r.update_seq), t.doChanges(e));
      }, n);
  }),
  inherits(AbstractPouchDB, events.EventEmitter),
  (AbstractPouchDB.prototype.post = adapterFun("post", function(e, t, n) {
    if (
      ("function" == typeof t && ((n = t), (t = {})),
      "object" != typeof e || Array.isArray(e))
    )
      return n(createError(NOT_AN_OBJECT));
    this.bulkDocs({ docs: [e] }, t, yankError(n, e._id));
  })),
  (AbstractPouchDB.prototype.put = adapterFun("put", function(e, t, n) {
    if (
      ("function" == typeof t && ((n = t), (t = {})),
      "object" != typeof e || Array.isArray(e))
    )
      return n(createError(NOT_AN_OBJECT));
    if (
      (invalidIdError(e._id),
      isLocalId(e._id) && "function" == typeof this._putLocal)
    )
      return e._deleted ? this._removeLocal(e, n) : this._putLocal(e, n);
    var r,
      o,
      i,
      a,
      c = this;
    function s(n) {
      "function" == typeof c._put && !1 !== t.new_edits
        ? c._put(e, t, n)
        : c.bulkDocs({ docs: [e] }, t, yankError(n, e._id));
    }
    t.force && e._rev
      ? ((r = e._rev.split("-")),
        (o = r[1]),
        (i = parseInt(r[0], 10) + 1),
        (a = rev()),
        (e._revisions = { start: i, ids: [a, o] }),
        (e._rev = i + "-" + a),
        (t.new_edits = !1),
        s(function(t) {
          var r = t ? null : { ok: !0, id: e._id, rev: e._rev };
          n(t, r);
        }))
      : s(n);
  })),
  (AbstractPouchDB.prototype.putAttachment = adapterFun(
    "putAttachment",
    function(e, t, n, r, o) {
      var i = this;
      function a(e) {
        var n = "_rev" in e ? parseInt(e._rev, 10) : 0;
        return (
          (e._attachments = e._attachments || {}),
          (e._attachments[t] = { content_type: o, data: r, revpos: ++n }),
          i.put(e)
        );
      }
      return (
        "function" == typeof o && ((o = r), (r = n), (n = null)),
        void 0 === o && ((o = r), (r = n), (n = null)),
        o ||
          guardedConsole(
            "warn",
            "Attachment",
            t,
            "on document",
            e,
            "is missing content_type"
          ),
        i.get(e).then(
          function(e) {
            if (e._rev !== n) throw createError(REV_CONFLICT);
            return a(e);
          },
          function(t) {
            if (t.reason === MISSING_DOC.message) return a({ _id: e });
            throw t;
          }
        )
      );
    }
  )),
  (AbstractPouchDB.prototype.removeAttachment = adapterFun(
    "removeAttachment",
    function(e, t, n, r) {
      var o = this;
      o.get(e, function(e, i) {
        if (e) r(e);
        else if (i._rev === n) {
          if (!i._attachments) return r();
          delete i._attachments[t],
            0 === Object.keys(i._attachments).length && delete i._attachments,
            o.put(i, r);
        } else r(createError(REV_CONFLICT));
      });
    }
  )),
  (AbstractPouchDB.prototype.remove = adapterFun("remove", function(
    e,
    t,
    n,
    r
  ) {
    var o;
    "string" == typeof t
      ? ((o = { _id: e, _rev: t }),
        "function" == typeof n && ((r = n), (n = {})))
      : ((o = e),
        "function" == typeof t ? ((r = t), (n = {})) : ((r = n), (n = t))),
      ((n = n || {}).was_delete = !0);
    var i = { _id: o._id, _rev: o._rev || n.rev, _deleted: !0 };
    if (isLocalId(i._id) && "function" == typeof this._removeLocal)
      return this._removeLocal(o, r);
    this.bulkDocs({ docs: [i] }, n, yankError(r, i._id));
  })),
  (AbstractPouchDB.prototype.revsDiff = adapterFun("revsDiff", function(
    e,
    t,
    n
  ) {
    "function" == typeof t && ((n = t), (t = {}));
    var r = Object.keys(e);
    if (!r.length) return n(null, {});
    var o = 0,
      i = new ExportedMap();
    function a(e, t) {
      i.has(e) || i.set(e, { missing: [] }), i.get(e).missing.push(t);
    }
    r.map(function(t) {
      this._getRevisionTree(t, function(c, s) {
        if (c && 404 === c.status && "missing" === c.message)
          i.set(t, { missing: e[t] });
        else {
          if (c) return n(c);
          !(function(t, n) {
            var r = e[t].slice(0);
            traverseRevTree(n, function(e, n, o, i, c) {
              var s = n + "-" + o,
                u = r.indexOf(s);
              -1 !== u && (r.splice(u, 1), "available" !== c.status && a(t, s));
            }),
              r.forEach(function(e) {
                a(t, e);
              });
          })(t, s);
        }
        if (++o === r.length) {
          var u = {};
          return (
            i.forEach(function(e, t) {
              u[t] = e;
            }),
            n(null, u)
          );
        }
      });
    }, this);
  })),
  (AbstractPouchDB.prototype.bulkGet = adapterFun("bulkGet", function(e, t) {
    bulkGet(this, e, t);
  })),
  (AbstractPouchDB.prototype.compactDocument = adapterFun(
    "compactDocument",
    function(e, t, n) {
      var r = this;
      this._getRevisionTree(e, function(o, i) {
        if (o) return n(o);
        var a = computeHeight(i),
          c = [],
          s = [];
        Object.keys(a).forEach(function(e) {
          a[e] > t && c.push(e);
        }),
          traverseRevTree(i, function(e, t, n, r, o) {
            var i = t + "-" + n;
            "available" === o.status && -1 !== c.indexOf(i) && s.push(i);
          }),
          r._doCompaction(e, s, n);
      });
    }
  )),
  (AbstractPouchDB.prototype.compact = adapterFun("compact", function(e, t) {
    "function" == typeof e && ((t = e), (e = {}));
    (e = e || {}),
      (this._compactionQueue = this._compactionQueue || []),
      this._compactionQueue.push({ opts: e, callback: t }),
      1 === this._compactionQueue.length && doNextCompaction(this);
  })),
  (AbstractPouchDB.prototype._compact = function(e, t) {
    var n = this,
      r = { return_docs: !1, last_seq: e.last_seq || 0 },
      o = [];
    n.changes(r)
      .on("change", function(e) {
        o.push(n.compactDocument(e.id, 0));
      })
      .on("complete", function(e) {
        var r = e.last_seq;
        Promise.all(o)
          .then(function() {
            return upsert(n, "_local/compaction", function(e) {
              return (!e.last_seq || e.last_seq < r) && ((e.last_seq = r), e);
            });
          })
          .then(function() {
            t(null, { ok: !0 });
          })
          .catch(t);
      })
      .on("error", t);
  }),
  (AbstractPouchDB.prototype.get = adapterFun("get", function(e, t, n) {
    if (("function" == typeof t && ((n = t), (t = {})), "string" != typeof e))
      return n(createError(INVALID_ID));
    if (isLocalId(e) && "function" == typeof this._getLocal)
      return this._getLocal(e, n);
    var r = [],
      o = this;
    function i() {
      var i = [],
        a = r.length;
      if (!a) return n(null, i);
      r.forEach(function(r) {
        o.get(
          e,
          {
            rev: r,
            revs: t.revs,
            latest: t.latest,
            attachments: t.attachments,
            binary: t.binary
          },
          function(e, t) {
            if (e) i.push({ missing: r });
            else {
              for (var o, c = 0, s = i.length; c < s; c++)
                if (i[c].ok && i[c].ok._rev === t._rev) {
                  o = !0;
                  break;
                }
              o || i.push({ ok: t });
            }
            --a || n(null, i);
          }
        );
      });
    }
    if (!t.open_revs)
      return this._get(e, t, function(r, i) {
        if (r) return (r.docId = e), n(r);
        var a = i.doc,
          c = i.metadata,
          s = i.ctx;
        if (t.conflicts) {
          var u = collectConflicts(c);
          u.length && (a._conflicts = u);
        }
        if (
          (isDeleted(c, a._rev) && (a._deleted = !0), t.revs || t.revs_info)
        ) {
          for (
            var l = a._rev.split("-"),
              f = parseInt(l[0], 10),
              d = l[1],
              p = rootToLeaf(c.rev_tree),
              h = null,
              v = 0;
            v < p.length;
            v++
          ) {
            var _ = p[v],
              m = _.ids
                .map(function(e) {
                  return e.id;
                })
                .indexOf(d);
            (m === f - 1 || (!h && -1 !== m)) && (h = _);
          }
          if (!h) return ((r = new Error("invalid rev tree")).docId = e), n(r);
          var g =
              h.ids
                .map(function(e) {
                  return e.id;
                })
                .indexOf(a._rev.split("-")[1]) + 1,
            y = h.ids.length - g;
          if (
            (h.ids.splice(g, y),
            h.ids.reverse(),
            t.revs &&
              (a._revisions = {
                start: h.pos + h.ids.length - 1,
                ids: h.ids.map(function(e) {
                  return e.id;
                })
              }),
            t.revs_info)
          ) {
            var b = h.pos + h.ids.length;
            a._revs_info = h.ids.map(function(e) {
              return { rev: --b + "-" + e.id, status: e.opts.status };
            });
          }
        }
        if (t.attachments && a._attachments) {
          var E = a._attachments,
            w = Object.keys(E).length;
          if (0 === w) return n(null, a);
          Object.keys(E).forEach(function(e) {
            this._getAttachment(
              a._id,
              e,
              E[e],
              { rev: a._rev, binary: t.binary, ctx: s },
              function(t, r) {
                var o = a._attachments[e];
                (o.data = r), delete o.stub, delete o.length, --w || n(null, a);
              }
            );
          }, o);
        } else {
          if (a._attachments)
            for (var k in a._attachments)
              a._attachments.hasOwnProperty(k) && (a._attachments[k].stub = !0);
          n(null, a);
        }
      });
    if ("all" === t.open_revs)
      this._getRevisionTree(e, function(e, t) {
        if (e) return n(e);
        (r = collectLeaves(t).map(function(e) {
          return e.rev;
        })),
          i();
      });
    else {
      if (!Array.isArray(t.open_revs))
        return n(createError(UNKNOWN_ERROR, "function_clause"));
      r = t.open_revs;
      for (var a = 0; a < r.length; a++) {
        var c = r[a];
        if ("string" != typeof c || !/^\d+-/.test(c))
          return n(createError(INVALID_REV));
      }
      i();
    }
  })),
  (AbstractPouchDB.prototype.getAttachment = adapterFun(
    "getAttachment",
    function(e, t, n, r) {
      var o = this;
      n instanceof Function && ((r = n), (n = {})),
        this._get(e, n, function(i, a) {
          return i
            ? r(i)
            : a.doc._attachments && a.doc._attachments[t]
            ? ((n.ctx = a.ctx),
              (n.binary = !0),
              void o._getAttachment(e, t, a.doc._attachments[t], n, r))
            : r(createError(MISSING_DOC));
        });
    }
  )),
  (AbstractPouchDB.prototype.allDocs = adapterFun("allDocs", function(e, t) {
    if (
      ("function" == typeof e && ((t = e), (e = {})),
      (e.skip = void 0 !== e.skip ? e.skip : 0),
      e.start_key && (e.startkey = e.start_key),
      e.end_key && (e.endkey = e.end_key),
      "keys" in e)
    ) {
      if (!Array.isArray(e.keys))
        return t(new TypeError("options.keys must be an array"));
      var n = ["startkey", "endkey", "key"].filter(function(t) {
        return t in e;
      })[0];
      if (n)
        return void t(
          createError(
            QUERY_PARSE_ERROR,
            "Query parameter `" + n + "` is not compatible with multi-get"
          )
        );
      if (!isRemote(this) && (allDocsKeysParse(e), 0 === e.keys.length))
        return this._allDocs({ limit: 0 }, t);
    }
    return this._allDocs(e, t);
  })),
  (AbstractPouchDB.prototype.changes = function(e, t) {
    return (
      "function" == typeof e && ((t = e), (e = {})),
      ((e = e || {}).return_docs =
        "return_docs" in e ? e.return_docs : !e.live),
      new Changes$1(this, e, t)
    );
  }),
  (AbstractPouchDB.prototype.close = adapterFun("close", function(e) {
    return (this._closed = !0), this.emit("closed"), this._close(e);
  })),
  (AbstractPouchDB.prototype.info = adapterFun("info", function(e) {
    var t = this;
    this._info(function(n, r) {
      if (n) return e(n);
      (r.db_name = r.db_name || t.name),
        (r.auto_compaction = !(!t.auto_compaction || isRemote(t))),
        (r.adapter = t.adapter),
        e(null, r);
    });
  })),
  (AbstractPouchDB.prototype.id = adapterFun("id", function(e) {
    return this._id(e);
  })),
  (AbstractPouchDB.prototype.type = function() {
    return "function" == typeof this._type ? this._type() : this.adapter;
  }),
  (AbstractPouchDB.prototype.bulkDocs = adapterFun("bulkDocs", function(
    e,
    t,
    n
  ) {
    if (
      ("function" == typeof t && ((n = t), (t = {})),
      (t = t || {}),
      Array.isArray(e) && (e = { docs: e }),
      !e || !e.docs || !Array.isArray(e.docs))
    )
      return n(createError(MISSING_BULK_DOCS));
    for (var r = 0; r < e.docs.length; ++r)
      if ("object" != typeof e.docs[r] || Array.isArray(e.docs[r]))
        return n(createError(NOT_AN_OBJECT));
    var o;
    if (
      (e.docs.forEach(function(e) {
        e._attachments &&
          Object.keys(e._attachments).forEach(function(t) {
            (o = o || attachmentNameError(t)),
              e._attachments[t].content_type ||
                guardedConsole(
                  "warn",
                  "Attachment",
                  t,
                  "on document",
                  e._id,
                  "is missing content_type"
                );
          });
      }),
      o)
    )
      return n(createError(BAD_REQUEST, o));
    "new_edits" in t || (t.new_edits = !("new_edits" in e) || e.new_edits);
    var i = this;
    t.new_edits || isRemote(i) || e.docs.sort(compareByIdThenRev),
      cleanDocs(e.docs);
    var a = e.docs.map(function(e) {
      return e._id;
    });
    return this._bulkDocs(e, t, function(e, r) {
      if (e) return n(e);
      if (
        (t.new_edits ||
          (r = r.filter(function(e) {
            return e.error;
          })),
        !isRemote(i))
      )
        for (var o = 0, c = r.length; o < c; o++) r[o].id = r[o].id || a[o];
      n(null, r);
    });
  })),
  (AbstractPouchDB.prototype.registerDependentDatabase = adapterFun(
    "registerDependentDatabase",
    function(e, t) {
      var n = new this.constructor(e, this.__opts);
      upsert(this, "_local/_pouch_dependentDbs", function(t) {
        return (
          (t.dependentDbs = t.dependentDbs || {}),
          !t.dependentDbs[e] && ((t.dependentDbs[e] = !0), t)
        );
      })
        .then(function() {
          t(null, { db: n });
        })
        .catch(t);
    }
  )),
  (AbstractPouchDB.prototype.destroy = adapterFun("destroy", function(e, t) {
    "function" == typeof e && ((t = e), (e = {}));
    var n = this,
      r = !("use_prefix" in n) || n.use_prefix;
    function o() {
      n._destroy(e, function(e, r) {
        if (e) return t(e);
        (n._destroyed = !0), n.emit("destroyed"), t(null, r || { ok: !0 });
      });
    }
    if (isRemote(n)) return o();
    n.get("_local/_pouch_dependentDbs", function(e, i) {
      if (e) return 404 !== e.status ? t(e) : o();
      var a = i.dependentDbs,
        c = n.constructor,
        s = Object.keys(a).map(function(e) {
          var t = r ? e.replace(new RegExp("^" + c.prefix), "") : e;
          return new c(t, n.__opts).destroy();
        });
      Promise.all(s).then(o, t);
    });
  })),
  (TaskQueue.prototype.execute = function() {
    var e;
    if (this.failed) for (; (e = this.queue.shift()); ) e(this.failed);
    else for (; (e = this.queue.shift()); ) e();
  }),
  (TaskQueue.prototype.fail = function(e) {
    (this.failed = e), this.execute();
  }),
  (TaskQueue.prototype.ready = function(e) {
    (this.isReady = !0), (this.db = e), this.execute();
  }),
  (TaskQueue.prototype.addTask = function(e) {
    this.queue.push(e), this.failed && this.execute();
  }),
  inherits(PouchDB, AbstractPouchDB);
var fetch = fetchCookie(nodeFetch__default);
function AbortController() {
  return { abort: function() {} };
}
(PouchDB.adapters = {}),
  (PouchDB.preferredAdapters = []),
  (PouchDB.prefix = "_pouch_");
var eventEmitter = new events.EventEmitter();
function setUpEventEmitter(e) {
  Object.keys(events.EventEmitter.prototype).forEach(function(t) {
    "function" == typeof events.EventEmitter.prototype[t] &&
      (e[t] = eventEmitter[t].bind(eventEmitter));
  });
  var t = (e._destructionListeners = new ExportedMap());
  e.on("ref", function(e) {
    t.has(e.name) || t.set(e.name, []), t.get(e.name).push(e);
  }),
    e.on("unref", function(e) {
      if (t.has(e.name)) {
        var n = t.get(e.name),
          r = n.indexOf(e);
        r < 0 ||
          (n.splice(r, 1), n.length > 1 ? t.set(e.name, n) : t.delete(e.name));
      }
    }),
    e.on("destroyed", function(e) {
      if (t.has(e)) {
        var n = t.get(e);
        t.delete(e),
          n.forEach(function(e) {
            e.emit("destroyed", !0);
          });
      }
    });
}
setUpEventEmitter(PouchDB),
  (PouchDB.adapter = function(e, t, n) {
    t.valid() &&
      ((PouchDB.adapters[e] = t), n && PouchDB.preferredAdapters.push(e));
  }),
  (PouchDB.plugin = function(e) {
    if ("function" == typeof e) e(PouchDB);
    else {
      if ("object" != typeof e || 0 === Object.keys(e).length)
        throw new Error(
          'Invalid plugin: got "' + e + '", expected an object or a function'
        );
      Object.keys(e).forEach(function(t) {
        PouchDB.prototype[t] = e[t];
      });
    }
    return (
      this.__defaults &&
        (PouchDB.__defaults = $inject_Object_assign({}, this.__defaults)),
      PouchDB
    );
  }),
  (PouchDB.defaults = function(e) {
    function t(e, n) {
      if (!(this instanceof t)) return new t(e, n);
      (n = n || {}),
        e && "object" == typeof e && ((e = (n = e).name), delete n.name),
        (n = $inject_Object_assign({}, t.__defaults, n)),
        PouchDB.call(this, e, n);
    }
    return (
      inherits(t, PouchDB),
      (t.preferredAdapters = PouchDB.preferredAdapters.slice()),
      Object.keys(PouchDB).forEach(function(e) {
        e in t || (t[e] = PouchDB[e]);
      }),
      (t.__defaults = $inject_Object_assign({}, this.__defaults, e)),
      t
    );
  }),
  (PouchDB.fetch = function(e, t) {
    return fetch(e, t);
  });
var version = "7.1.1";
function getFieldFromDoc(e, t) {
  for (var n = e, r = 0, o = t.length; r < o; r++) {
    if (!(n = n[t[r]])) break;
  }
  return n;
}
function compare$1(e, t) {
  return e < t ? -1 : e > t ? 1 : 0;
}
function parseField(e) {
  for (var t = [], n = "", r = 0, o = e.length; r < o; r++) {
    var i = e[r];
    "." === i
      ? r > 0 && "\\" === e[r - 1]
        ? (n = n.substring(0, n.length - 1) + ".")
        : (t.push(n), (n = ""))
      : (n += i);
  }
  return t.push(n), t;
}
var combinationFields = ["$or", "$nor", "$not"];
function isCombinationalField(e) {
  return combinationFields.indexOf(e) > -1;
}
function getKey(e) {
  return Object.keys(e)[0];
}
function getValue(e) {
  return e[getKey(e)];
}
function mergeAndedSelectors(e) {
  var t = {};
  return (
    e.forEach(function(e) {
      Object.keys(e).forEach(function(n) {
        var r = e[n];
        if (("object" != typeof r && (r = { $eq: r }), isCombinationalField(n)))
          r instanceof Array
            ? (t[n] = r.map(function(e) {
                return mergeAndedSelectors([e]);
              }))
            : (t[n] = mergeAndedSelectors([r]));
        else {
          var o = (t[n] = t[n] || {});
          Object.keys(r).forEach(function(e) {
            var t = r[e];
            return "$gt" === e || "$gte" === e
              ? mergeGtGte(e, t, o)
              : "$lt" === e || "$lte" === e
              ? mergeLtLte(e, t, o)
              : "$ne" === e
              ? mergeNe(t, o)
              : "$eq" === e
              ? mergeEq(t, o)
              : void (o[e] = t);
          });
        }
      });
    }),
    t
  );
}
function mergeGtGte(e, t, n) {
  void 0 === n.$eq &&
    (void 0 !== n.$gte
      ? "$gte" === e
        ? t > n.$gte && (n.$gte = t)
        : t >= n.$gte && (delete n.$gte, (n.$gt = t))
      : void 0 !== n.$gt
      ? "$gte" === e
        ? t > n.$gt && (delete n.$gt, (n.$gte = t))
        : t > n.$gt && (n.$gt = t)
      : (n[e] = t));
}
function mergeLtLte(e, t, n) {
  void 0 === n.$eq &&
    (void 0 !== n.$lte
      ? "$lte" === e
        ? t < n.$lte && (n.$lte = t)
        : t <= n.$lte && (delete n.$lte, (n.$lt = t))
      : void 0 !== n.$lt
      ? "$lte" === e
        ? t < n.$lt && (delete n.$lt, (n.$lte = t))
        : t < n.$lt && (n.$lt = t)
      : (n[e] = t));
}
function mergeNe(e, t) {
  "$ne" in t ? t.$ne.push(e) : (t.$ne = [e]);
}
function mergeEq(e, t) {
  delete t.$gt,
    delete t.$gte,
    delete t.$lt,
    delete t.$lte,
    delete t.$ne,
    (t.$eq = e);
}
function mergeAndedSelectorsNested(e) {
  for (var t in e) {
    if (Array.isArray(e))
      for (var n in e) e[n].$and && (e[n] = mergeAndedSelectors(e[n].$and));
    var r = e[t];
    "object" == typeof r && mergeAndedSelectorsNested(r);
  }
  return e;
}
function isAndInSelector(e, t) {
  for (var n in e) {
    "$and" === n && (t = !0);
    var r = e[n];
    "object" == typeof r && (t = isAndInSelector(r, t));
  }
  return t;
}
function massageSelector(e) {
  var t = clone(e),
    n = !1;
  isAndInSelector(t, !1) &&
    ("$and" in (t = mergeAndedSelectorsNested(t)) &&
      (t = mergeAndedSelectors(t.$and)),
    (n = !0)),
    ["$or", "$nor"].forEach(function(e) {
      e in t &&
        t[e].forEach(function(e) {
          for (var t = Object.keys(e), n = 0; n < t.length; n++) {
            var r = t[n],
              o = e[r];
            ("object" == typeof o && null !== o) || (e[r] = { $eq: o });
          }
        });
    }),
    "$not" in t && (t.$not = mergeAndedSelectors([t.$not]));
  for (var r = Object.keys(t), o = 0; o < r.length; o++) {
    var i = r[o],
      a = t[i];
    "object" != typeof a || null === a
      ? (a = { $eq: a })
      : "$ne" in a && !n && (a.$ne = [a.$ne]),
      (t[i] = a);
  }
  return t;
}
function pad(e, t, n) {
  for (var r = "", o = n - e.length; r.length < o; ) r += t;
  return r;
}
function padLeft(e, t, n) {
  return pad(e, t, n) + e;
}
var MIN_MAGNITUDE = -324,
  MAGNITUDE_DIGITS = 3,
  SEP = "";
function collate(e, t) {
  if (e === t) return 0;
  (e = normalizeKey(e)), (t = normalizeKey(t));
  var n = collationIndex(e),
    r = collationIndex(t);
  if (n - r != 0) return n - r;
  switch (typeof e) {
    case "number":
      return e - t;
    case "boolean":
      return e < t ? -1 : 1;
    case "string":
      return stringCollate(e, t);
  }
  return Array.isArray(e) ? arrayCollate(e, t) : objectCollate(e, t);
}
function normalizeKey(e) {
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
        for (var r = 0; r < n; r++) e[r] = normalizeKey(t[r]);
      } else {
        if (e instanceof Date) return e.toJSON();
        if (null !== e)
          for (var o in ((e = {}), t))
            if (t.hasOwnProperty(o)) {
              var i = t[o];
              void 0 !== i && (e[o] = normalizeKey(i));
            }
      }
  }
  return e;
}
function indexify(e) {
  if (null !== e)
    switch (typeof e) {
      case "boolean":
        return e ? 1 : 0;
      case "number":
        return numToIndexableString(e);
      case "string":
        return e
          .replace(/\u0002/g, "")
          .replace(/\u0001/g, "")
          .replace(/\u0000/g, "");
      case "object":
        var t = Array.isArray(e),
          n = t ? e : Object.keys(e),
          r = -1,
          o = n.length,
          i = "";
        if (t) for (; ++r < o; ) i += toIndexableString(n[r]);
        else
          for (; ++r < o; ) {
            var a = n[r];
            i += toIndexableString(a) + toIndexableString(e[a]);
          }
        return i;
    }
  return "";
}
function toIndexableString(e) {
  return collationIndex((e = normalizeKey(e))) + SEP + indexify(e) + "\0";
}
function parseNumber(e, t) {
  var n,
    r = t;
  if ("1" === e[t]) (n = 0), t++;
  else {
    var o = "0" === e[t];
    t++;
    var i = "",
      a = e.substring(t, t + MAGNITUDE_DIGITS),
      c = parseInt(a, 10) + MIN_MAGNITUDE;
    for (o && (c = -c), t += MAGNITUDE_DIGITS; ; ) {
      var s = e[t];
      if ("\0" === s) break;
      (i += s), t++;
    }
    (n =
      1 === (i = i.split(".")).length
        ? parseInt(i, 10)
        : parseFloat(i[0] + "." + i[1])),
      o && (n -= 10),
      0 !== c && (n = parseFloat(n + "e" + c));
  }
  return { num: n, length: t - r };
}
function pop(e, t) {
  var n = e.pop();
  if (t.length) {
    var r = t[t.length - 1];
    n === r.element && (t.pop(), (r = t[t.length - 1]));
    var o = r.element,
      i = r.index;
    if (Array.isArray(o)) o.push(n);
    else if (i === e.length - 2) {
      o[e.pop()] = n;
    } else e.push(n);
  }
}
function parseIndexableString(e) {
  for (var t = [], n = [], r = 0; ; ) {
    var o = e[r++];
    if ("\0" !== o)
      switch (o) {
        case "1":
          t.push(null);
          break;
        case "2":
          t.push("1" === e[r]), r++;
          break;
        case "3":
          var i = parseNumber(e, r);
          t.push(i.num), (r += i.length);
          break;
        case "4":
          for (var a = ""; ; ) {
            var c = e[r];
            if ("\0" === c) break;
            (a += c), r++;
          }
          (a = a
            .replace(/\u0001\u0001/g, "\0")
            .replace(/\u0001\u0002/g, "")
            .replace(/\u0002\u0002/g, "")),
            t.push(a);
          break;
        case "5":
          var s = { element: [], index: t.length };
          t.push(s.element), n.push(s);
          break;
        case "6":
          var u = { element: {}, index: t.length };
          t.push(u.element), n.push(u);
          break;
        default:
          throw new Error(
            "bad collationIndex or unexpectedly reached end of input: " + o
          );
      }
    else {
      if (1 === t.length) return t.pop();
      pop(t, n);
    }
  }
}
function arrayCollate(e, t) {
  for (var n = Math.min(e.length, t.length), r = 0; r < n; r++) {
    var o = collate(e[r], t[r]);
    if (0 !== o) return o;
  }
  return e.length === t.length ? 0 : e.length > t.length ? 1 : -1;
}
function stringCollate(e, t) {
  return e === t ? 0 : e > t ? 1 : -1;
}
function objectCollate(e, t) {
  for (
    var n = Object.keys(e),
      r = Object.keys(t),
      o = Math.min(n.length, r.length),
      i = 0;
    i < o;
    i++
  ) {
    var a = collate(n[i], r[i]);
    if (0 !== a) return a;
    if (0 !== (a = collate(e[n[i]], t[r[i]]))) return a;
  }
  return n.length === r.length ? 0 : n.length > r.length ? 1 : -1;
}
function collationIndex(e) {
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
function numToIndexableString(e) {
  if (0 === e) return "1";
  var t = e.toExponential().split(/e\+?/),
    n = parseInt(t[1], 10),
    r = e < 0,
    o = r ? "0" : "2",
    i = padLeft(
      ((r ? -n : n) - MIN_MAGNITUDE).toString(),
      "0",
      MAGNITUDE_DIGITS
    );
  o += SEP + i;
  var a = Math.abs(parseFloat(t[0]));
  r && (a = 10 - a);
  var c = a.toFixed(20);
  return (c = c.replace(/\.?0+$/, "")), (o += SEP + c);
}
function createFieldSorter(e) {
  function t(t) {
    return e.map(function(e) {
      var n = parseField(getKey(e));
      return getFieldFromDoc(t, n);
    });
  }
  return function(e, n) {
    var r = collate(t(e.doc), t(n.doc));
    return 0 !== r ? r : compare$1(e.doc._id, n.doc._id);
  };
}
function filterInMemoryFields(e, t, n) {
  if (
    ((e = e.filter(function(e) {
      return rowFilter(e.doc, t.selector, n);
    })),
    t.sort)
  ) {
    var r = createFieldSorter(t.sort);
    (e = e.sort(r)),
      "string" != typeof t.sort[0] &&
        "desc" === getValue(t.sort[0]) &&
        (e = e.reverse());
  }
  if ("limit" in t || "skip" in t) {
    var o = t.skip || 0,
      i = ("limit" in t ? t.limit : e.length) + o;
    e = e.slice(o, i);
  }
  return e;
}
function rowFilter(e, t, n) {
  return n.every(function(n) {
    var r = t[n],
      o = parseField(n),
      i = getFieldFromDoc(e, o);
    return isCombinationalField(n)
      ? matchCominationalSelector(n, r, e)
      : matchSelector(r, e, o, i);
  });
}
function matchSelector(e, t, n, r) {
  return (
    !e ||
    ("object" == typeof e
      ? Object.keys(e).every(function(o) {
          var i = e[o];
          return match(o, t, i, n, r);
        })
      : e === r)
  );
}
function matchCominationalSelector(e, t, n) {
  return "$or" === e
    ? t.some(function(e) {
        return rowFilter(n, e, Object.keys(e));
      })
    : "$not" === e
    ? !rowFilter(n, t, Object.keys(t))
    : !t.find(function(e) {
        return rowFilter(n, e, Object.keys(e));
      });
}
function match(e, t, n, r, o) {
  if (!matchers[e])
    throw new Error(
      'unknown operator "' +
        e +
        '" - should be one of $eq, $lte, $lt, $gt, $gte, $exists, $ne, $in, $nin, $size, $mod, $regex, $elemMatch, $type, $allMatch or $all'
    );
  return matchers[e](t, n, r, o);
}
function fieldExists(e) {
  return null != e;
}
function fieldIsNotUndefined(e) {
  return void 0 !== e;
}
function modField(e, t) {
  var n = t[0],
    r = t[1];
  if (0 === n) throw new Error("Bad divisor, cannot divide by zero");
  if (parseInt(n, 10) !== n) throw new Error("Divisor is not an integer");
  if (parseInt(r, 10) !== r) throw new Error("Modulus is not an integer");
  return parseInt(e, 10) === e && e % n === r;
}
function arrayContainsValue(e, t) {
  return t.some(function(t) {
    return e instanceof Array ? e.indexOf(t) > -1 : e === t;
  });
}
function arrayContainsAllValues(e, t) {
  return t.every(function(t) {
    return e.indexOf(t) > -1;
  });
}
function arraySize(e, t) {
  return e.length === t;
}
function regexMatch(e, t) {
  return new RegExp(t).test(e);
}
function typeMatch(e, t) {
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
}
var matchers = {
  $elemMatch: function(e, t, n, r) {
    return (
      !!Array.isArray(r) &&
      0 !== r.length &&
      ("object" == typeof r[0]
        ? r.some(function(e) {
            return rowFilter(e, t, Object.keys(t));
          })
        : r.some(function(r) {
            return matchSelector(t, e, n, r);
          }))
    );
  },
  $allMatch: function(e, t, n, r) {
    return (
      !!Array.isArray(r) &&
      0 !== r.length &&
      ("object" == typeof r[0]
        ? r.every(function(e) {
            return rowFilter(e, t, Object.keys(t));
          })
        : r.every(function(r) {
            return matchSelector(t, e, n, r);
          }))
    );
  },
  $eq: function(e, t, n, r) {
    return fieldIsNotUndefined(r) && 0 === collate(r, t);
  },
  $gte: function(e, t, n, r) {
    return fieldIsNotUndefined(r) && collate(r, t) >= 0;
  },
  $gt: function(e, t, n, r) {
    return fieldIsNotUndefined(r) && collate(r, t) > 0;
  },
  $lte: function(e, t, n, r) {
    return fieldIsNotUndefined(r) && collate(r, t) <= 0;
  },
  $lt: function(e, t, n, r) {
    return fieldIsNotUndefined(r) && collate(r, t) < 0;
  },
  $exists: function(e, t, n, r) {
    return t ? fieldIsNotUndefined(r) : !fieldIsNotUndefined(r);
  },
  $mod: function(e, t, n, r) {
    return fieldExists(r) && modField(r, t);
  },
  $ne: function(e, t, n, r) {
    return t.every(function(e) {
      return 0 !== collate(r, e);
    });
  },
  $in: function(e, t, n, r) {
    return fieldExists(r) && arrayContainsValue(r, t);
  },
  $nin: function(e, t, n, r) {
    return fieldExists(r) && !arrayContainsValue(r, t);
  },
  $size: function(e, t, n, r) {
    return fieldExists(r) && arraySize(r, t);
  },
  $all: function(e, t, n, r) {
    return Array.isArray(r) && arrayContainsAllValues(r, t);
  },
  $regex: function(e, t, n, r) {
    return fieldExists(r) && regexMatch(r, t);
  },
  $type: function(e, t, n, r) {
    return typeMatch(r, t);
  }
};
function matchesSelector(e, t) {
  if ("object" != typeof t)
    throw new Error("Selector error: expected a JSON object");
  var n = filterInMemoryFields(
    [{ doc: e }],
    { selector: (t = massageSelector(t)) },
    Object.keys(t)
  );
  return n && 1 === n.length;
}
function evalFilter(e) {
  var t = '(function() {\n"use strict";\nreturn ' + e + "\n})()";
  return vm.runInNewContext(t);
}
function evalView(e) {
  var t = [
    '"use strict";',
    "var emitted = false;",
    "var emit = function (a, b) {",
    "  emitted = true;",
    "};",
    "var view = " + e + ";",
    "view(doc);",
    "if (emitted) {",
    "  return true;",
    "}"
  ].join("\n");
  return vm.runInNewContext("(function(doc) {\n" + t + "\n})");
}
function validate(e, t) {
  if (e.selector && e.filter && "_selector" !== e.filter) {
    var n = "string" == typeof e.filter ? e.filter : "function";
    return t(new Error('selector invalid for filter "' + n + '"'));
  }
  t();
}
function normalize(e) {
  e.view && !e.filter && (e.filter = "_view"),
    e.selector && !e.filter && (e.filter = "_selector"),
    e.filter &&
      "string" == typeof e.filter &&
      ("_view" === e.filter
        ? (e.view = normalizeDesignDocFunctionName(e.view))
        : (e.filter = normalizeDesignDocFunctionName(e.filter)));
}
function shouldFilter(e, t) {
  return (
    t.filter && "string" == typeof t.filter && !t.doc_ids && !isRemote(e.db)
  );
}
function filter(e, t) {
  var n = t.complete;
  if ("_view" === t.filter) {
    if (!t.view || "string" != typeof t.view) {
      var r = createError(
        BAD_REQUEST,
        "`view` filter parameter not found or invalid."
      );
      return n(r);
    }
    var o = parseDesignDocFunctionName(t.view);
    e.db.get("_design/" + o[0], function(r, i) {
      if (e.isCancelled) return n(null, { status: "cancelled" });
      if (r) return n(generateErrorFromResponse(r));
      var a = i && i.views && i.views[o[1]] && i.views[o[1]].map;
      if (!a)
        return n(
          createError(
            MISSING_DOC,
            i.views ? "missing json key: " + o[1] : "missing json key: views"
          )
        );
      (t.filter = evalView(a)), e.doChanges(t);
    });
  } else if (t.selector)
    (t.filter = function(e) {
      return matchesSelector(e, t.selector);
    }),
      e.doChanges(t);
  else {
    var i = parseDesignDocFunctionName(t.filter);
    e.db.get("_design/" + i[0], function(r, o) {
      if (e.isCancelled) return n(null, { status: "cancelled" });
      if (r) return n(generateErrorFromResponse(r));
      var a = o && o.filters && o.filters[i[1]];
      if (!a)
        return n(
          createError(
            MISSING_DOC,
            o && o.filters
              ? "missing json key: " + i[1]
              : "missing json key: filters"
          )
        );
      (t.filter = evalFilter(a)), e.doChanges(t);
    });
  }
}
function applyChangesFilterPlugin(e) {
  e._changesFilterPlugin = {
    validate: validate,
    normalize: normalize,
    shouldFilter: shouldFilter,
    filter: filter
  };
}
function isFunction(e) {
  return "function" == typeof e;
}
function getPrefix(e) {
  return isFunction(e.prefix) ? e.prefix() : e;
}
function clone$1(e) {
  var t = {};
  for (var n in e) t[n] = e[n];
  return t;
}
function nut(e, t, n) {
  function r(e, r, o, i) {
    return t.encode([e, n.encodeKey(r, o, i)]);
  }
  function o(e, t) {
    return (
      t &&
        t.options &&
        ((e.keyEncoding = e.keyEncoding || t.options.keyEncoding),
        (e.valueEncoding = e.valueEncoding || t.options.valueEncoding)),
      e
    );
  }
  return (
    e.open(function() {}),
    {
      apply: function(t, i, a) {
        i = i || {};
        for (var c = [], s = -1, u = t.length; ++s < u; ) {
          var l = t[s];
          o(l, l.prefix),
            (l.prefix = getPrefix(l.prefix)),
            c.push({
              key: r(l.prefix, l.key, i, l),
              value: "del" !== l.type && n.encodeValue(l.value, i, l),
              type: l.type
            });
        }
        e.db.batch(c, i, a);
      },
      get: function(t, o, i, a) {
        return (
          (i.asBuffer = n.valueAsBuffer(i)),
          e.db.get(r(o, t, i), i, function(e, t) {
            e ? a(e) : a(null, n.decodeValue(t, i));
          })
        );
      },
      createDecoder: function(e) {
        return function(r, o) {
          return {
            key: n.decodeKey(t.decode(r)[1], e),
            value: n.decodeValue(o, e)
          };
        };
      },
      isClosed: function() {
        return e.isClosed();
      },
      close: function(t) {
        return e.close(t);
      },
      iterator: function(o) {
        var i,
          a = clone$1(o || {}),
          c = o.prefix || [];
        return (
          ltgt.toLtgt(
            o,
            a,
            function(e) {
              return r(c, e, a, {});
            },
            t.lowerBound,
            t.upperBound
          ),
          (a.prefix = null),
          (a.keyAsBuffer = a.valueAsBuffer = !1),
          "number" != typeof a.limit && (a.limit = -1),
          (a.keyAsBuffer = t.buffer),
          (a.valueAsBuffer = n.valueAsBuffer(a)),
          (i = e.db.iterator(a)),
          {
            next: function(e) {
              return i.next(e);
            },
            end: function(e) {
              i.end(e);
            }
          }
        );
      }
    }
  );
}
function NotFoundError() {
  Error.call(this);
}
PouchDB.plugin(applyChangesFilterPlugin),
  (PouchDB.version = version),
  inherits(NotFoundError, Error),
  (NotFoundError.prototype.name = "NotFoundError");
var EventEmitter = events__default.EventEmitter,
  version$1 = "6.5.4",
  NOT_FOUND_ERROR = new NotFoundError(),
  sublevel = function(e, t, n, r) {
    var o = new EventEmitter();
    function i(e) {
      var t,
        n = {};
      if (r) for (t in r) void 0 !== r[t] && (n[t] = r[t]);
      if (e) for (t in e) void 0 !== e[t] && (n[t] = e[t]);
      return n;
    }
    return (
      (o.sublevels = {}),
      (o.options = r),
      (o.version = version$1),
      (o.methods = {}),
      (t = t || []),
      (o.put = function(n, r, a, c) {
        "function" == typeof a && ((c = a), (a = {})),
          e.apply(
            [{ key: n, value: r, prefix: t.slice(), type: "put" }],
            i(a),
            function(e) {
              if (e) return c(e);
              o.emit("put", n, r), c(null);
            }
          );
      }),
      (o.prefix = function() {
        return t.slice();
      }),
      (o.batch = function(n, r, a) {
        "function" == typeof r && ((a = r), (r = {})),
          (n = n.map(function(e) {
            return {
              key: e.key,
              value: e.value,
              prefix: e.prefix || t,
              keyEncoding: e.keyEncoding,
              valueEncoding: e.valueEncoding,
              type: e.type
            };
          })),
          e.apply(n, i(r), function(e) {
            if (e) return a(e);
            o.emit("batch", n), a(null);
          });
      }),
      (o.get = function(n, r, o) {
        "function" == typeof r && ((o = r), (r = {})),
          e.get(n, t, i(r), function(e, t) {
            e ? o(NOT_FOUND_ERROR) : o(null, t);
          });
      }),
      (o.sublevel = function(r, a) {
        return (o.sublevels[r] =
          o.sublevels[r] || sublevel(e, t.concat(r), n, i(a)));
      }),
      (o.readStream = o.createReadStream = function(r) {
        var o;
        (r = i(r)).prefix = t;
        var a = e.iterator(r);
        return (o = n(r, e.createDecoder(r))).setIterator(a), o;
      }),
      (o.close = function(t) {
        e.close(t);
      }),
      (o.isOpen = e.isOpen),
      (o.isClosed = e.isClosed),
      o
    );
  },
  Readable = ReadableStreamCore.Readable;
function ReadStream(e, t) {
  if (!(this instanceof ReadStream)) return new ReadStream(e, t);
  Readable.call(this, { objectMode: !0, highWaterMark: e.highWaterMark }),
    (this._waiting = !1),
    (this._options = e),
    (this._makeData = t);
}
inherits(ReadStream, Readable),
  (ReadStream.prototype.setIterator = function(e) {
    return (
      (this._iterator = e),
      this._destroyed
        ? e.end(function() {})
        : this._waiting
        ? ((this._waiting = !1), this._read())
        : this
    );
  }),
  (ReadStream.prototype._read = function() {
    var e = this;
    if (!e._destroyed)
      return e._iterator
        ? void e._iterator.next(function(t, n, r) {
            if (t || (void 0 === n && void 0 === r))
              return t || e._destroyed || e.push(null), e._cleanup(t);
            (r = e._makeData(n, r)), e._destroyed || e.push(r);
          })
        : (this._waiting = !0);
  }),
  (ReadStream.prototype._cleanup = function(e) {
    if (!this._destroyed) {
      this._destroyed = !0;
      var t = this;
      e && "iterator has ended" !== e.message && t.emit("error", e),
        t._iterator
          ? t._iterator.end(function() {
              (t._iterator = null), t.emit("close");
            })
          : t.emit("close");
    }
  }),
  (ReadStream.prototype.destroy = function() {
    this._cleanup();
  });
var precodec = {
    encode: function(e) {
      return "ÿ" + e[0] + "ÿ" + e[1];
    },
    decode: function(e) {
      var t = e.toString(),
        n = t.indexOf("ÿ", 1);
      return [t.substring(1, n), t.substring(n + 1)];
    },
    lowerBound: "\0",
    upperBound: "ÿ"
  },
  codec = new Codec();
function sublevelPouch(e) {
  return sublevel(nut(e, precodec, codec), [], ReadStream, e.options);
}
function allDocsKeysQuery(e, t) {
  var n = t.keys,
    r = { offset: t.skip };
  return Promise.all(
    n.map(function(n) {
      var o = $inject_Object_assign({ key: n, deleted: "ok" }, t);
      return (
        ["limit", "skip", "keys"].forEach(function(e) {
          delete o[e];
        }),
        new Promise(function(i, a) {
          e._allDocs(o, function(e, o) {
            if (e) return a(e);
            t.update_seq &&
              void 0 !== o.update_seq &&
              (r.update_seq = o.update_seq),
              (r.total_rows = o.total_rows),
              i(o.rows[0] || { key: n, error: "not_found" });
          });
        })
      );
    })
  ).then(function(e) {
    return (r.rows = e), r;
  });
}
function toObject(e) {
  return e.reduce(function(e, t) {
    return (e[t] = !0), e;
  }, {});
}
var reservedWords = toObject([
    "_id",
    "_rev",
    "_attachments",
    "_deleted",
    "_revisions",
    "_revs_info",
    "_conflicts",
    "_deleted_conflicts",
    "_local_seq",
    "_rev_tree",
    "_replication_id",
    "_replication_state",
    "_replication_state_time",
    "_replication_state_reason",
    "_replication_stats",
    "_removed"
  ]),
  dataWords = toObject([
    "_attachments",
    "_replication_id",
    "_replication_state",
    "_replication_state_time",
    "_replication_state_reason",
    "_replication_stats"
  ]);
function parseRevisionInfo(e) {
  if (!/^\d+-./.test(e)) return createError(INVALID_REV);
  var t = e.indexOf("-"),
    n = e.substring(0, t),
    r = e.substring(t + 1);
  return { prefix: parseInt(n, 10), id: r };
}
function makeRevTreeFromRevisions(e, t) {
  for (
    var n = e.start - e.ids.length + 1,
      r = e.ids,
      o = [r[0], t, []],
      i = 1,
      a = r.length;
    i < a;
    i++
  )
    o = [r[i], { status: "missing" }, [o]];
  return [{ pos: n, ids: o }];
}
function parseDoc(e, t, n) {
  var r, o, i;
  n || (n = { deterministic_revs: !0 });
  var a = { status: "available" };
  if ((e._deleted && (a.deleted = !0), t))
    if (
      (e._id || (e._id = uuid()), (o = rev(e, n.deterministic_revs)), e._rev)
    ) {
      if ((i = parseRevisionInfo(e._rev)).error) return i;
      (e._rev_tree = [
        { pos: i.prefix, ids: [i.id, { status: "missing" }, [[o, a, []]]] }
      ]),
        (r = i.prefix + 1);
    } else (e._rev_tree = [{ pos: 1, ids: [o, a, []] }]), (r = 1);
  else if (
    (e._revisions &&
      ((e._rev_tree = makeRevTreeFromRevisions(e._revisions, a)),
      (r = e._revisions.start),
      (o = e._revisions.ids[0])),
    !e._rev_tree)
  ) {
    if ((i = parseRevisionInfo(e._rev)).error) return i;
    (r = i.prefix), (o = i.id), (e._rev_tree = [{ pos: r, ids: [o, a, []] }]);
  }
  invalidIdError(e._id), (e._rev = r + "-" + o);
  var c = { metadata: {}, data: {} };
  for (var s in e)
    if (Object.prototype.hasOwnProperty.call(e, s)) {
      var u = "_" === s[0];
      if (u && !reservedWords[s]) {
        var l = createError(DOC_VALIDATION, s);
        throw ((l.message = DOC_VALIDATION.message + ": " + s), l);
      }
      u && !dataWords[s] ? (c.metadata[s.slice(1)] = e[s]) : (c.data[s] = e[s]);
    }
  return c;
}
function thisAtob(e) {
  var t = new Buffer(e, "base64");
  if (t.toString("base64") !== e)
    throw new Error("attachment is not a valid base64 string");
  return t.toString("binary");
}
function thisBtoa(e) {
  return bufferFrom(e, "binary").toString("base64");
}
function typedBuffer(e, t, n) {
  var r = bufferFrom(e, t);
  return (r.type = n), r;
}
function b64ToBluffer(e, t) {
  return typedBuffer(e, "base64", t);
}
function binStringToBluffer(e, t) {
  return typedBuffer(e, "binary", t);
}
function blobToBase64(e, t) {
  t(e.toString("base64"));
}
function updateDoc(e, t, n, r, o, i, a, c) {
  if (revExists(t.rev_tree, n.metadata.rev) && !c) return (r[o] = n), i();
  var s = t.winningRev || winningRev(t),
    u = "deleted" in t ? t.deleted : isDeleted(t, s),
    l = "deleted" in n.metadata ? n.metadata.deleted : isDeleted(n.metadata),
    f = /^1-/.test(n.metadata.rev);
  if (u && !l && c && f) {
    var d = n.data;
    (d._rev = s), (d._id = n.metadata.id), (n = parseDoc(d, c));
  }
  var p = merge(t.rev_tree, n.metadata.rev_tree[0], e);
  if (
    c &&
    ((u && l && "new_leaf" !== p.conflicts) ||
      (!u && "new_leaf" !== p.conflicts) ||
      (u && !l && "new_branch" === p.conflicts))
  ) {
    var h = createError(REV_CONFLICT);
    return (r[o] = h), i();
  }
  var v = n.metadata.rev;
  (n.metadata.rev_tree = p.tree),
    (n.stemmedRevs = p.stemmedRevs || []),
    t.rev_map && (n.metadata.rev_map = t.rev_map);
  var _ = winningRev(n.metadata),
    m = isDeleted(n.metadata, _),
    g = u === m ? 0 : u < m ? -1 : 1;
  a(n, _, m, v === _ ? m : isDeleted(n.metadata, v), !0, g, o, i);
}
function rootIsMissing(e) {
  return "missing" === e.metadata.rev_tree[0].ids[1].status;
}
function processDocs(e, t, n, r, o, i, a, c, s) {
  e = e || 1e3;
  var u = c.new_edits,
    l = new ExportedMap(),
    f = 0,
    d = t.length;
  function p() {
    ++f === d && s && s();
  }
  t.forEach(function(e, t) {
    if (e._id && isLocalId(e._id)) {
      var r = e._deleted ? "_removeLocal" : "_putLocal";
      n[r](e, { ctx: o }, function(e, n) {
        (i[t] = e || n), p();
      });
    } else {
      var a = e.metadata.id;
      l.has(a) ? (d--, l.get(a).push([e, t])) : l.set(a, [[e, t]]);
    }
  }),
    l.forEach(function(t, n) {
      var o = 0;
      function s() {
        ++o < t.length ? l() : p();
      }
      function l() {
        var l = t[o],
          f = l[0],
          d = l[1];
        if (r.has(n)) updateDoc(e, r.get(n), f, i, d, s, a, u);
        else {
          var p = merge([], f.metadata.rev_tree[0], e);
          (f.metadata.rev_tree = p.tree),
            (f.stemmedRevs = p.stemmedRevs || []),
            (function(e, t, n) {
              var r = winningRev(e.metadata),
                o = isDeleted(e.metadata, r);
              if ("was_delete" in c && o)
                return (i[t] = createError(MISSING_DOC, "deleted")), n();
              if (u && rootIsMissing(e)) {
                var s = createError(REV_CONFLICT);
                return (i[t] = s), n();
              }
              a(e, r, o, o, !1, o ? 0 : 1, t, n);
            })(f, d, s);
        }
      }
      l();
    });
}
function safeJsonParse(e) {
  try {
    return JSON.parse(e);
  } catch (t) {
    return vuvuzela.parse(e);
  }
}
function safeJsonStringify(e) {
  try {
    return JSON.stringify(e);
  } catch (t) {
    return vuvuzela.stringify(e);
  }
}
function readAsBlobOrBuffer(e, t) {
  return (e.type = t), e;
}
function prepareAttachmentForStorage(e, t) {
  t(e);
}
function createEmptyBlobOrBuffer(e) {
  return typedBuffer("", "binary", e);
}
function getCacheFor(e, t) {
  var n = t.prefix()[0],
    r = e._cache,
    o = r.get(n);
  return o || ((o = new ExportedMap()), r.set(n, o)), o;
}
function LevelTransaction() {
  (this._batch = []), (this._cache = new ExportedMap());
}
(LevelTransaction.prototype.get = function(e, t, n) {
  var r = getCacheFor(this, e),
    o = r.get(t);
  return o
    ? nextTick(function() {
        n(null, o);
      })
    : null === o
    ? nextTick(function() {
        n({ name: "NotFoundError" });
      })
    : void e.get(t, function(e, o) {
        if (e) return "NotFoundError" === e.name && r.set(t, null), n(e);
        r.set(t, o), n(null, o);
      });
}),
  (LevelTransaction.prototype.batch = function(e) {
    for (var t = 0, n = e.length; t < n; t++) {
      var r = e[t],
        o = getCacheFor(this, r.prefix);
      "put" === r.type ? o.set(r.key, r.value) : o.set(r.key, null);
    }
    this._batch = this._batch.concat(e);
  }),
  (LevelTransaction.prototype.execute = function(e, t) {
    for (
      var n = new ExportedSet(), r = [], o = this._batch.length - 1;
      o >= 0;
      o--
    ) {
      var i = this._batch[o],
        a = i.prefix.prefix()[0] + "ÿ" + i.key;
      n.has(a) || (n.add(a), r.push(i));
    }
    e.batch(r, t);
  });
var DOC_STORE = "document-store",
  BY_SEQ_STORE = "by-sequence",
  ATTACHMENT_STORE = "attach-store",
  BINARY_STORE = "attach-binary-store",
  LOCAL_STORE = "local-store",
  META_STORE = "meta-store",
  dbStores = new ExportedMap(),
  UPDATE_SEQ_KEY = "_local_last_update_seq",
  DOC_COUNT_KEY = "_local_doc_count",
  UUID_KEY = "_local_uuid",
  MD5_PREFIX = "md5-",
  safeJsonEncoding = {
    encode: safeJsonStringify,
    decode: safeJsonParse,
    buffer: !1,
    type: "cheap-json"
  },
  levelChanges = new Changes();
function getWinningRev(e) {
  return "winningRev" in e ? e.winningRev : winningRev(e);
}
function getIsDeleted(e, t) {
  return "deleted" in e ? e.deleted : isDeleted(e, t);
}
function fetchAttachment(e, t, n) {
  var r = e.content_type;
  return new Promise(function(o, i) {
    t.binaryStore.get(e.digest, function(t, a) {
      var c;
      if (t) {
        if ("NotFoundError" !== t.name) return i(t);
        c = n.binary ? binStringToBluffer("", r) : "";
      } else c = n.binary ? readAsBlobOrBuffer(a, r) : a.toString("base64");
      delete e.stub, delete e.length, (e.data = c), o();
    });
  });
}
function fetchAttachments(e, t, n) {
  var r = [];
  return (
    e.forEach(function(e) {
      e.doc &&
        e.doc._attachments &&
        Object.keys(e.doc._attachments).forEach(function(t) {
          var n = e.doc._attachments[t];
          "data" in n || r.push(n);
        });
    }),
    Promise.all(
      r.map(function(e) {
        return fetchAttachment(e, t, n);
      })
    )
  );
}
function LevelPouch(e, t) {
  e = clone(e);
  var n,
    r,
    o = this,
    i = {},
    a = e.revs_limit,
    c = e.name;
  void 0 === e.createIfMissing && (e.createIfMissing = !0);
  var s,
    u = e.db,
    l = functionName(u);
  function f() {
    (i.docStore = r.sublevel(DOC_STORE, { valueEncoding: safeJsonEncoding })),
      (i.bySeqStore = r.sublevel(BY_SEQ_STORE, { valueEncoding: "json" })),
      (i.attachmentStore = r.sublevel(ATTACHMENT_STORE, {
        valueEncoding: "json"
      })),
      (i.binaryStore = r.sublevel(BINARY_STORE, { valueEncoding: "binary" })),
      (i.localStore = r.sublevel(LOCAL_STORE, { valueEncoding: "json" })),
      (i.metaStore = r.sublevel(META_STORE, { valueEncoding: "json" })),
      "object" == typeof e.migrate ? e.migrate.doMigrationTwo(r, i, d) : d();
  }
  function d() {
    i.metaStore.get(UPDATE_SEQ_KEY, function(e, a) {
      void 0 === r._updateSeq && (r._updateSeq = a || 0),
        i.metaStore.get(DOC_COUNT_KEY, function(e, a) {
          (r._docCount = e ? 0 : a),
            i.metaStore.get(UUID_KEY, function(e, r) {
              (n = e ? uuid() : r),
                i.metaStore.put(UUID_KEY, n, function() {
                  nextTick(function() {
                    t(null, o);
                  });
                });
            });
        });
    });
  }
  function p(e, t) {
    try {
      e.apply(null, t);
    } catch (e) {
      t[t.length - 1](e);
    }
  }
  function h() {
    var e = r._queue.peekFront();
    "read" === e.type
      ? (function(e) {
          var t = [e],
            n = 1,
            o = r._queue.get(n);
          for (; void 0 !== o && "read" === o.type; )
            t.push(o), n++, (o = r._queue.get(n));
          var i = 0;
          t.forEach(function(e) {
            var n = e.args,
              o = n[n.length - 1];
            (n[n.length - 1] = getArguments(function(e) {
              o.apply(null, e),
                ++i === t.length &&
                  nextTick(function() {
                    t.forEach(function() {
                      r._queue.shift();
                    }),
                      r._queue.length && h();
                  });
            })),
              p(e.fun, n);
          });
        })(e)
      : (function(e) {
          var t = e.args,
            n = t[t.length - 1];
          (t[t.length - 1] = getArguments(function(e) {
            n.apply(null, e),
              nextTick(function() {
                r._queue.shift(), r._queue.length && h();
              });
          })),
            p(e.fun, t);
        })(e);
  }
  function v(e) {
    return getArguments(function(t) {
      r._queue.push({ fun: e, args: t, type: "write" }),
        1 === r._queue.length && nextTick(h);
    });
  }
  function _(e) {
    return getArguments(function(t) {
      r._queue.push({ fun: e, args: t, type: "read" }),
        1 === r._queue.length && nextTick(h);
    });
  }
  function m(e) {
    return ("0000000000000000" + e).slice(-16);
  }
  function g(e, t) {
    "destroy" in u ? u.destroy(e, t) : t(null);
  }
  dbStores.has(l)
    ? (s = dbStores.get(l))
    : ((s = new ExportedMap()), dbStores.set(l, s)),
    s.has(c)
      ? ((r = s.get(c)), f())
      : s.set(
          c,
          sublevelPouch(
            levelup(u(c), e, function(n) {
              if (n) return s.delete(c), t(n);
              ((r = s.get(c))._docCount = -1),
                (r._queue = new Deque()),
                "object" == typeof e.migrate
                  ? e.migrate.doMigrationOne(c, r, f)
                  : f();
            })
          )
        ),
    (o._remote = !1),
    (o.type = function() {
      return "leveldb";
    }),
    (o._id = function(e) {
      e(null, n);
    }),
    (o._info = function(e) {
      var t = {
        doc_count: r._docCount,
        update_seq: r._updateSeq,
        backend_adapter: functionName(u)
      };
      return nextTick(function() {
        e(null, t);
      });
    }),
    (o._get = _(function(e, t, n) {
      (t = clone(t)),
        i.docStore.get(e, function(e, r) {
          if (e || !r) return n(createError(MISSING_DOC, "missing"));
          var o;
          if (t.rev) o = t.latest ? latest(t.rev, r) : t.rev;
          else if (((o = getWinningRev(r)), getIsDeleted(r, o)))
            return n(createError(MISSING_DOC, "deleted"));
          var a = r.rev_map[o];
          i.bySeqStore.get(m(a), function(e, t) {
            if (!t) return n(createError(MISSING_DOC));
            if ("_id" in t && t._id !== r.id)
              return n(new Error("wrong doc returned"));
            if (((t._id = r.id), "_rev" in t)) {
              if (t._rev !== o) return n(new Error("wrong doc returned"));
            } else t._rev = o;
            return n(null, { doc: t, metadata: r });
          });
        });
    })),
    (o._getAttachment = function(e, t, n, r, o) {
      var a = n.digest,
        c = n.content_type;
      i.binaryStore.get(a, function(e, t) {
        if (e)
          return "NotFoundError" !== e.name
            ? o(e)
            : o(null, r.binary ? createEmptyBlobOrBuffer(c) : "");
        r.binary
          ? o(null, readAsBlobOrBuffer(t, c))
          : o(null, t.toString("base64"));
      });
    }),
    (o._bulkDocs = v(function(e, t, n) {
      var s = t.new_edits,
        u = new Array(e.docs.length),
        l = new ExportedMap(),
        f = new ExportedMap(),
        d = new LevelTransaction(),
        p = 0,
        h = r._updateSeq,
        v = e.docs,
        _ = v.map(function(e) {
          if (e._id && isLocalId(e._id)) return e;
          var t = parseDoc(e, s, o.__opts);
          return (
            t.metadata && !t.metadata.rev_map && (t.metadata.rev_map = {}), t
          );
        }),
        g = _.filter(function(e) {
          return e.error;
        });
      if (g.length) return n(g[0]);
      function y(e, t) {
        var n = Promise.resolve();
        e.forEach(function(e, t) {
          n = n.then(function() {
            return new Promise(function(n, r) {
              o._doCompactionNoLock(t, e, { ctx: d }, function(e) {
                if (e) return r(e);
                n();
              });
            });
          });
        }),
          n.then(function() {
            t();
          }, t);
      }
      function b() {
        y(f, function(e) {
          if ((e && S(e), o.auto_compaction))
            return (
              (t = S),
              (n = new ExportedMap()),
              l.forEach(function(e, t) {
                n.set(t, compactTree(e));
              }),
              void y(n, t)
            );
          var t, n;
          S();
        });
      }
      function E(e, t, r, o, a, c, s, v) {
        p += c;
        var _ = null,
          g = 0;
        (e.metadata.winningRev = t),
          (e.metadata.deleted = r),
          (e.data._id = e.metadata.id),
          (e.data._rev = e.metadata.rev),
          o && (e.data._deleted = !0),
          e.stemmedRevs.length && f.set(e.metadata.id, e.stemmedRevs);
        var y = e.data._attachments ? Object.keys(e.data._attachments) : [];
        function b(e) {
          g++, _ || (e ? v((_ = e)) : g === y.length && C());
        }
        function E(e, t, n, r) {
          return function(o) {
            !(function(e, t, n, r, o) {
              var a = e.data._attachments[n];
              delete a.data, (a.digest = t), (a.length = r.length);
              var c = e.metadata.id,
                s = e.metadata.rev;
              (a.revpos = parseInt(s, 10)),
                k(c, s, t, function(e, n) {
                  return e
                    ? o(e)
                    : 0 === r.length
                    ? o(e)
                    : n
                    ? (d.batch([
                        {
                          type: "put",
                          prefix: i.binaryStore,
                          key: t,
                          value: bufferFrom(r, "binary")
                        }
                      ]),
                      void o())
                    : o(e);
                });
            })(e, MD5_PREFIX + o, t, n, r);
          };
        }
        function w(e, t, n) {
          return function(r) {
            binaryMd5(r, E(e, t, r, n));
          };
        }
        for (var S = 0; S < y.length; S++) {
          var D,
            O = y[S],
            A = e.data._attachments[O];
          if (A.stub) k(e.data._id, e.data._rev, A.digest, b);
          else if ("string" == typeof A.data) {
            try {
              D = thisAtob(A.data);
            } catch (e) {
              return void n(
                createError(BAD_ARG, "Attachment is not a valid base64 string")
              );
            }
            w(e, O, b)(D);
          } else prepareAttachmentForStorage(A.data, w(e, O, b));
        }
        function C() {
          var t = e.metadata.rev_map[e.metadata.rev];
          if (t) return v();
          (t = ++h), (e.metadata.rev_map[e.metadata.rev] = e.metadata.seq = t);
          var n = [
            { key: m(t), value: e.data, prefix: i.bySeqStore, type: "put" },
            {
              key: e.metadata.id,
              value: e.metadata,
              prefix: i.docStore,
              type: "put"
            }
          ];
          d.batch(n),
            (u[s] = { ok: !0, id: e.metadata.id, rev: e.metadata.rev }),
            l.set(e.metadata.id, e.metadata),
            v();
        }
        y.length || C();
      }
      var w = {};
      function k(e, t, n, r) {
        function o(r) {
          var o = [e, t].join("@"),
            a = {};
          return (
            r
              ? r.refs && ((a.refs = r.refs), (a.refs[o] = !0))
              : ((a.refs = {}), (a.refs[o] = !0)),
            new Promise(function(e) {
              d.batch([
                { type: "put", prefix: i.attachmentStore, key: n, value: a }
              ]),
                e(!r);
            })
          );
        }
        var a = w[n] || Promise.resolve();
        w[n] = a.then(function() {
          return new Promise(function(e, t) {
            d.get(i.attachmentStore, n, function(n, r) {
              if (n && "NotFoundError" !== n.name) return t(n);
              e(r);
            });
          })
            .then(o)
            .then(function(e) {
              r(null, e);
            }, r);
        });
      }
      function S(e) {
        if (e)
          return nextTick(function() {
            n(e);
          });
        d.batch([
          { prefix: i.metaStore, type: "put", key: UPDATE_SEQ_KEY, value: h },
          {
            prefix: i.metaStore,
            type: "put",
            key: DOC_COUNT_KEY,
            value: r._docCount + p
          }
        ]),
          d.execute(r, function(e) {
            if (e) return n(e);
            (r._docCount += p),
              (r._updateSeq = h),
              levelChanges.notify(c),
              nextTick(function() {
                n(null, u);
              });
          });
      }
      if (!_.length) return n(null, []);
      !(function(e) {
        var t = [];
        if (
          (v.forEach(function(e) {
            e &&
              e._attachments &&
              Object.keys(e._attachments).forEach(function(n) {
                var r = e._attachments[n];
                r.stub && t.push(r.digest);
              });
          }),
          !t.length)
        )
          return e();
        var n,
          r = 0;
        t.forEach(function(o) {
          !(function(e, t) {
            d.get(i.attachmentStore, e, function(n) {
              if (n) {
                var r = createError(
                  MISSING_STUB,
                  "unknown stub attachment with digest " + e
                );
                t(r);
              } else t();
            });
          })(o, function(o) {
            o && !n && (n = o), ++r === t.length && e(n);
          });
        });
      })(function(e) {
        if (e) return n(e);
        !(function(e) {
          var t,
            n = 0;
          function r() {
            if (++n === v.length) return e(t);
          }
          v.forEach(function(e) {
            if (e._id && isLocalId(e._id)) return r();
            d.get(i.docStore, e._id, function(n, o) {
              n ? "NotFoundError" !== n.name && (t = n) : l.set(e._id, o), r();
            });
          });
        })(function(e) {
          if (e) return n(e);
          processDocs(a, _, o, l, d, u, E, t, b);
        });
      });
    })),
    (o._allDocs = function(e, t) {
      return "keys" in e
        ? allDocsKeysQuery(this, e)
        : _(function(e, t) {
            (e = clone(e)),
              (function(e) {
                r.isClosed()
                  ? e(new Error("database is closed"))
                  : e(null, r._docCount);
              })(function(n, o) {
                if (n) return t(n);
                var a,
                  c = {},
                  s = e.skip || 0;
                if (
                  (e.startkey && (c.gte = e.startkey),
                  e.endkey && (c.lte = e.endkey),
                  e.key && (c.gte = c.lte = e.key),
                  e.descending)
                ) {
                  c.reverse = !0;
                  var u = c.lte;
                  (c.lte = c.gte), (c.gte = u);
                }
                if (
                  ("number" == typeof e.limit && (a = e.limit),
                  0 === a || ("gte" in c && "lte" in c && c.gte > c.lte))
                ) {
                  var l = { total_rows: o, offset: e.skip, rows: [] };
                  return (
                    e.update_seq && (l.update_seq = r._updateSeq), t(null, l)
                  );
                }
                var f = [],
                  d = i.docStore.readStream(c),
                  p = through2
                    .obj(
                      function(t, n, r) {
                        var o = t.value,
                          c = getWinningRev(o),
                          u = getIsDeleted(o, c);
                        if (u) {
                          if ("ok" !== e.deleted) return void r();
                        } else {
                          if (s-- > 0) return void r();
                          if ("number" == typeof a && a-- <= 0)
                            return d.unpipe(), d.destroy(), void r();
                        }
                        function l(t) {
                          var n = { id: o.id, key: o.id, value: { rev: c } };
                          if (e.include_docs) {
                            if (
                              ((n.doc = t),
                              (n.doc._rev = n.value.rev),
                              e.conflicts)
                            ) {
                              var i = collectConflicts(o);
                              i.length && (n.doc._conflicts = i);
                            }
                            for (var a in n.doc._attachments)
                              n.doc._attachments.hasOwnProperty(a) &&
                                (n.doc._attachments[a].stub = !0);
                          }
                          if (!1 === e.inclusive_end && o.id === e.endkey)
                            return r();
                          if (u) {
                            if ("ok" !== e.deleted) return r();
                            (n.value.deleted = !0), (n.doc = null);
                          }
                          f.push(n), r();
                        }
                        if (e.include_docs) {
                          var p = o.rev_map[c];
                          i.bySeqStore.get(m(p), function(e, t) {
                            l(t);
                          });
                        } else l();
                      },
                      function(n) {
                        Promise.resolve()
                          .then(function() {
                            if (e.include_docs && e.attachments)
                              return fetchAttachments(f, i, e);
                          })
                          .then(function() {
                            var n = { total_rows: o, offset: e.skip, rows: f };
                            e.update_seq && (n.update_seq = r._updateSeq),
                              t(null, n);
                          }, t),
                          n();
                      }
                    )
                    .on("unpipe", function() {
                      p.end();
                    });
                d.on("error", t), d.pipe(p);
              });
          })(e, t);
    }),
    (o._changes = function(e) {
      if ((e = clone(e)).continuous) {
        var t = c + ":" + uuid();
        return (
          levelChanges.addListener(c, t, o, e),
          levelChanges.notify(c),
          {
            cancel: function() {
              levelChanges.removeListener(c, t);
            }
          }
        );
      }
      var n,
        a = e.descending,
        s = [],
        u = e.since || 0,
        l = 0,
        f = { reverse: a };
      "limit" in e && e.limit > 0 && (n = e.limit),
        f.reverse || (f.start = m(e.since || 0));
      var d = e.doc_ids && new ExportedSet(e.doc_ids),
        p = filterChange(e),
        h = new ExportedMap();
      function v() {
        (e.done = !0),
          e.return_docs &&
            e.limit &&
            e.limit < s.length &&
            (s.length = e.limit),
          _.unpipe(g),
          _.destroy(),
          e.continuous ||
            e.cancelled ||
            (e.include_docs && e.attachments && e.return_docs
              ? fetchAttachments(s, i, e).then(function() {
                  e.complete(null, { results: s, last_seq: u });
                })
              : e.complete(null, { results: s, last_seq: u }));
      }
      var _ = i.bySeqStore.readStream(f),
        g = through2
          .obj(
            function(t, o, c) {
              if (n && l >= n) return v(), c();
              if (e.cancelled || e.done) return c();
              var f,
                _,
                g = ((f = t.key), parseInt(f, 10)),
                y = t.value;
              if (g === e.since && !a) return c();
              if (d && !d.has(y._id)) return c();
              function b(t) {
                var n = getWinningRev(t);
                function r(n) {
                  var r = e.processChange(n, t, e);
                  r.seq = t.seq;
                  var o = p(r);
                  if ("object" == typeof o) return e.complete(o);
                  o &&
                    (l++,
                    e.attachments && e.include_docs
                      ? fetchAttachments([r], i, e).then(function() {
                          e.onChange(r);
                        })
                      : e.onChange(r),
                    e.return_docs && s.push(r)),
                    c();
                }
                if (t.seq !== g) return c();
                if (((u = g), n === y._rev)) return r(y);
                var o = t.rev_map[n];
                i.bySeqStore.get(m(o), function(e, t) {
                  r(t);
                });
              }
              if ((_ = h.get(y._id))) return b(_);
              i.docStore.get(y._id, function(t, n) {
                if (e.cancelled || e.done || r.isClosed() || isLocalId(n.id))
                  return c();
                h.set(y._id, n), b(n);
              });
            },
            function(t) {
              if (e.cancelled) return t();
              e.return_docs &&
                e.limit &&
                e.limit < s.length &&
                (s.length = e.limit),
                t();
            }
          )
          .on("unpipe", function() {
            g.end(), v();
          });
      return (
        _.pipe(g),
        {
          cancel: function() {
            (e.cancelled = !0), v();
          }
        }
      );
    }),
    (o._close = function(e) {
      if (r.isClosed()) return e(createError(NOT_OPEN));
      r.close(function(t) {
        t ? e(t) : (s.delete(c), e());
      });
    }),
    (o._getRevisionTree = function(e, t) {
      i.docStore.get(e, function(e, n) {
        e ? t(createError(MISSING_DOC)) : t(null, n.rev_tree);
      });
    }),
    (o._doCompaction = v(function(e, t, n, r) {
      o._doCompactionNoLock(e, t, n, r);
    })),
    (o._doCompactionNoLock = function(e, t, n, o) {
      if (("function" == typeof n && ((o = n), (n = {})), !t.length))
        return o();
      var a = n.ctx || new LevelTransaction();
      a.get(i.docStore, e, function(c, s) {
        if (c) return o(c);
        var u = t.map(function(e) {
          var t = s.rev_map[e];
          return delete s.rev_map[e], t;
        });
        traverseRevTree(s.rev_tree, function(e, n, r, o, i) {
          var a = n + "-" + r;
          -1 !== t.indexOf(a) && (i.status = "missing");
        });
        var l = [];
        l.push({ key: s.id, value: s, type: "put", prefix: i.docStore });
        var f,
          d = {},
          p = 0;
        function h(n) {
          if ((n && (f = n), ++p === t.length)) {
            if (f) return o(f);
            !(function() {
              var n = Object.keys(d);
              if (!n.length) return v();
              var r,
                o = 0;
              function c(e) {
                e && (r = e), ++o === n.length && v(r);
              }
              var s = new ExportedMap();
              t.forEach(function(t) {
                s.set(e + "@" + t, !0);
              }),
                n.forEach(function(e) {
                  a.get(i.attachmentStore, e, function(t, n) {
                    if (t) return "NotFoundError" === t.name ? c() : c(t);
                    var r = Object.keys(n.refs || {}).filter(function(e) {
                        return !s.has(e);
                      }),
                      o = {};
                    r.forEach(function(e) {
                      o[e] = !0;
                    }),
                      r.length
                        ? l.push({
                            key: e,
                            type: "put",
                            value: { refs: o },
                            prefix: i.attachmentStore
                          })
                        : (l = l.concat([
                            { key: e, type: "del", prefix: i.attachmentStore },
                            { key: e, type: "del", prefix: i.binaryStore }
                          ])),
                      c();
                  });
                });
            })();
          }
        }
        function v(e) {
          return e ? o(e) : (a.batch(l), n.ctx ? o() : void a.execute(r, o));
        }
        u.forEach(function(e) {
          l.push({ key: m(e), type: "del", prefix: i.bySeqStore }),
            a.get(i.bySeqStore, m(e), function(e, t) {
              if (e) return "NotFoundError" === e.name ? h() : h(e);
              Object.keys(t._attachments || {}).forEach(function(e) {
                var n = t._attachments[e].digest;
                d[n] = !0;
              }),
                h();
            });
        });
      });
    }),
    (o._getLocal = function(e, t) {
      i.localStore.get(e, function(e, n) {
        e ? t(createError(MISSING_DOC)) : t(null, n);
      });
    }),
    (o._putLocal = function(e, t, n) {
      "function" == typeof t && ((n = t), (t = {})),
        t.ctx ? o._putLocalNoLock(e, t, n) : o._putLocalWithLock(e, t, n);
    }),
    (o._putLocalWithLock = v(function(e, t, n) {
      o._putLocalNoLock(e, t, n);
    })),
    (o._putLocalNoLock = function(e, t, n) {
      delete e._revisions;
      var o = e._rev,
        a = e._id,
        c = t.ctx || new LevelTransaction();
      c.get(i.localStore, a, function(s, u) {
        if (s && o) return n(createError(REV_CONFLICT));
        if (u && u._rev !== o) return n(createError(REV_CONFLICT));
        e._rev = o ? "0-" + (parseInt(o.split("-")[1], 10) + 1) : "0-1";
        var l = [{ type: "put", prefix: i.localStore, key: a, value: e }];
        c.batch(l);
        var f = { ok: !0, id: e._id, rev: e._rev };
        if (t.ctx) return n(null, f);
        c.execute(r, function(e) {
          if (e) return n(e);
          n(null, f);
        });
      });
    }),
    (o._removeLocal = function(e, t, n) {
      "function" == typeof t && ((n = t), (t = {})),
        t.ctx ? o._removeLocalNoLock(e, t, n) : o._removeLocalWithLock(e, t, n);
    }),
    (o._removeLocalWithLock = v(function(e, t, n) {
      o._removeLocalNoLock(e, t, n);
    })),
    (o._removeLocalNoLock = function(e, t, n) {
      var o = t.ctx || new LevelTransaction();
      o.get(i.localStore, e._id, function(a, c) {
        if (a)
          return "NotFoundError" !== a.name
            ? n(a)
            : n(createError(MISSING_DOC));
        if (c._rev !== e._rev) return n(createError(REV_CONFLICT));
        o.batch([{ prefix: i.localStore, type: "del", key: e._id }]);
        var s = { ok: !0, id: e._id, rev: "0-0" };
        if (t.ctx) return n(null, s);
        o.execute(r, function(e) {
          if (e) return n(e);
          n(null, s);
        });
      });
    }),
    (o._destroy = function(e, t) {
      var n,
        r = functionName(u);
      if (!dbStores.has(r)) return g(c, t);
      (n = dbStores.get(r)).has(c)
        ? (levelChanges.removeAllListeners(c),
          n.get(c).close(function() {
            n.delete(c), g(c, t);
          }))
        : g(c, t);
    });
}
var requireLeveldown = function() {
    try {
      return require("leveldown");
    } catch (e) {
      return "MODULE_NOT_FOUND" === (e = e || "leveldown import error").code
        ? new Error(
            [
              "the 'leveldown' package is not available. install it, or,",
              "specify another storage backend using the 'db' option"
            ].join(" ")
          )
        : e.message && e.message.match("Module version mismatch")
        ? new Error(
            [
              e.message,
              "This generally implies that leveldown was built with a different",
              "version of node than that which is running now.  You may try",
              "fully removing and reinstalling PouchDB or leveldown to resolve."
            ].join(" ")
          )
        : new Error(e.toString() + ": unable to import leveldown");
    }
  },
  stores = [
    "document-store",
    "by-sequence",
    "attach-store",
    "attach-binary-store"
  ];
function formatSeq(e) {
  return ("0000000000000000" + e).slice(-16);
}
var UPDATE_SEQ_KEY$1 = "_local_last_update_seq",
  DOC_COUNT_KEY$1 = "_local_doc_count",
  UUID_KEY$1 = "_local_uuid",
  doMigrationOne = function(e, t, n) {
    var r = require("leveldown"),
      o = path.resolve(e);
    fs.unlink(o + ".uuid", function(e) {
      if (e) return n();
      var i = 4,
        a = [];
      stores.forEach(function(e, c) {
        !(function(e, n, r) {
          var i,
            a = path.join(o, e);
          i = 3 === n ? { valueEncoding: "binary" } : { valueEncoding: "json" };
          var c = t.sublevel(e, i),
            s = level(a, i),
            u = s.createReadStream(),
            l = new LevelWriteStream(c)();
          u.on("end", function() {
            s.close(function(e) {
              r(e, a);
            });
          }),
            u.pipe(l);
        })(e, c, function(e, t) {
          if (e) return n(e);
          a.push(t),
            --i ||
              a.forEach(function(e) {
                r.destroy(e, function() {
                  ++i === a.length && fs.rmdir(o, n);
                });
              });
        });
      });
    });
  },
  doMigrationTwo = function(e, t, n) {
    var r = [];
    t.bySeqStore.get(UUID_KEY$1, function(o, i) {
      if (o) return n();
      r.push({
        key: UUID_KEY$1,
        value: i,
        prefix: t.metaStore,
        type: "put",
        valueEncoding: "json"
      }),
        r.push({ key: UUID_KEY$1, prefix: t.bySeqStore, type: "del" }),
        t.bySeqStore.get(DOC_COUNT_KEY$1, function(o, i) {
          i &&
            (r.push({
              key: DOC_COUNT_KEY$1,
              value: i,
              prefix: t.metaStore,
              type: "put",
              valueEncoding: "json"
            }),
            r.push({
              key: DOC_COUNT_KEY$1,
              prefix: t.bySeqStore,
              type: "del"
            })),
            t.bySeqStore.get(UPDATE_SEQ_KEY$1, function(o, i) {
              i &&
                (r.push({
                  key: UPDATE_SEQ_KEY$1,
                  value: i,
                  prefix: t.metaStore,
                  type: "put",
                  valueEncoding: "json"
                }),
                r.push({
                  key: UPDATE_SEQ_KEY$1,
                  prefix: t.bySeqStore,
                  type: "del"
                }));
              var a = {};
              t.docStore
                .createReadStream({ startKey: "_", endKey: "_ÿ" })
                .pipe(
                  through2.obj(function(e, n, o) {
                    if (!isLocalId(e.key)) return o();
                    r.push({ key: e.key, prefix: t.docStore, type: "del" });
                    var i = winningRev(e.value);
                    Object.keys(e.value.rev_map).forEach(function(t) {
                      "winner" !== t &&
                        this.push(formatSeq(e.value.rev_map[t]));
                    }, this);
                    var a = e.value.rev_map[i];
                    t.bySeqStore.get(formatSeq(a), function(n, i) {
                      n ||
                        r.push({
                          key: e.key,
                          value: i,
                          prefix: t.localStore,
                          type: "put",
                          valueEncoding: "json"
                        }),
                        o();
                    });
                  })
                )
                .pipe(
                  through2.obj(
                    function(e, n, o) {
                      if (a[e]) return o();
                      (a[e] = !0),
                        t.bySeqStore.get(e, function(n, i) {
                          if (n || !isLocalId(i._id)) return o();
                          r.push({ key: e, prefix: t.bySeqStore, type: "del" }),
                            o();
                        });
                    },
                    function() {
                      e.batch(r, n);
                    }
                  )
                );
            });
        });
    });
  },
  migrate = { doMigrationOne: doMigrationOne, doMigrationTwo: doMigrationTwo };
function LevelDownPouch(e, t) {
  var n = e.db;
  if (!n && (n = requireLeveldown()) instanceof Error) return t(n);
  var r = $inject_Object_assign({ db: n, migrate: migrate }, e);
  LevelPouch.call(this, r, t);
}
function LevelPouch$1(e) {
  e.adapter("leveldb", LevelDownPouch, !0);
}
function pool(e, t) {
  return new Promise(function(n, r) {
    var o,
      i = 0,
      a = 0,
      c = 0,
      s = e.length;
    function u() {
      ++c === s ? (o ? r(o) : n()) : d();
    }
    function l() {
      i--, u();
    }
    function f(e) {
      i--, (o = o || e), u();
    }
    function d() {
      for (; i < t && a < s; ) i++, e[a++]().then(l, f);
    }
    d();
  });
}
(LevelDownPouch.valid = function() {
  return !0;
}),
  (LevelDownPouch.use_prefix = !1);
var CHANGES_BATCH_SIZE = 25,
  MAX_SIMULTANEOUS_REVS = 50,
  CHANGES_TIMEOUT_BUFFER = 5e3,
  DEFAULT_HEARTBEAT = 1e4,
  supportsBulkGetMap = {};
function readAttachmentsAsBlobOrBuffer(e) {
  var t = e.doc || e.ok,
    n = t && t._attachments;
  n &&
    Object.keys(n).forEach(function(e) {
      var t = n[e];
      t.data = b64ToBluffer(t.data, t.content_type);
    });
}
function encodeDocId(e) {
  return /^_design/.test(e)
    ? "_design/" + encodeURIComponent(e.slice(8))
    : /^_local/.test(e)
    ? "_local/" + encodeURIComponent(e.slice(7))
    : encodeURIComponent(e);
}
function preprocessAttachments$1(e) {
  return e._attachments && Object.keys(e._attachments)
    ? Promise.all(
        Object.keys(e._attachments).map(function(t) {
          var n = e._attachments[t];
          if (n.data && "string" != typeof n.data)
            return new Promise(function(e) {
              blobToBase64(n.data, e);
            }).then(function(e) {
              n.data = e;
            });
        })
      )
    : Promise.resolve();
}
function hasUrlPrefix(e) {
  if (!e.prefix) return !1;
  var t = parseUri(e.prefix).protocol;
  return "http" === t || "https" === t;
}
function getHost(e, t) {
  if (hasUrlPrefix(t)) {
    var n = t.name.substr(t.prefix.length);
    e = t.prefix.replace(/\/?$/, "/") + encodeURIComponent(n);
  }
  var r = parseUri(e);
  (r.user || r.password) &&
    (r.auth = { username: r.user, password: r.password });
  var o = r.path.replace(/(^\/|\/$)/g, "").split("/");
  return (
    (r.db = o.pop()),
    -1 === r.db.indexOf("%") && (r.db = encodeURIComponent(r.db)),
    (r.path = o.join("/")),
    r
  );
}
function genDBUrl(e, t) {
  return genUrl(e, e.db + "/" + t);
}
function genUrl(e, t) {
  var n = e.path ? "/" : "";
  return (
    e.protocol +
    "://" +
    e.host +
    (e.port ? ":" + e.port : "") +
    "/" +
    e.path +
    n +
    t
  );
}
function paramsToStr(e) {
  return (
    "?" +
    Object.keys(e)
      .map(function(t) {
        return t + "=" + encodeURIComponent(e[t]);
      })
      .join("&")
  );
}
function shouldCacheBust(e) {
  var t =
      "undefined" != typeof navigator && navigator.userAgent
        ? navigator.userAgent.toLowerCase()
        : "",
    n = -1 !== t.indexOf("msie"),
    r = -1 !== t.indexOf("trident"),
    o = -1 !== t.indexOf("edge"),
    i = !("method" in e) || "GET" === e.method;
  return (n || r || o) && i;
}
function HttpPouch(e, t) {
  var n = this,
    r = getHost(e.name, e),
    o = genDBUrl(r, "");
  e = clone(e);
  var i,
    a = function(t, n) {
      if (
        (((n = n || {}).headers = n.headers || new nodeFetch.Headers()),
        (n.credentials = "include"),
        e.auth || r.auth)
      ) {
        var o = e.auth || r.auth,
          i = o.username + ":" + o.password,
          a = thisBtoa(unescape(encodeURIComponent(i)));
        n.headers.set("Authorization", "Basic " + a);
      }
      var c = e.headers || {};
      return (
        Object.keys(c).forEach(function(e) {
          n.headers.append(e, c[e]);
        }),
        shouldCacheBust(n) &&
          (t += (-1 === t.indexOf("?") ? "?" : "&") + "_nonce=" + Date.now()),
        (e.fetch || fetch)(t, n)
      );
    };
  function c(e, t) {
    return adapterFun(
      e,
      getArguments(function(e) {
        u()
          .then(function() {
            return t.apply(this, e);
          })
          .catch(function(t) {
            e.pop()(t);
          });
      })
    ).bind(n);
  }
  function s(e, t, n) {
    var r = {};
    return (
      ((t = t || {}).headers = t.headers || new nodeFetch.Headers()),
      t.headers.get("Content-Type") ||
        t.headers.set("Content-Type", "application/json"),
      t.headers.get("Accept") || t.headers.set("Accept", "application/json"),
      a(e, t)
        .then(function(e) {
          return (r.ok = e.ok), (r.status = e.status), e.json();
        })
        .then(function(e) {
          if (((r.data = e), !r.ok)) {
            r.data.status = r.status;
            var t = generateErrorFromResponse(r.data);
            if (n) return n(t);
            throw t;
          }
          if (
            (Array.isArray(r.data) &&
              (r.data = r.data.map(function(e) {
                return e.error || e.missing ? generateErrorFromResponse(e) : e;
              })),
            !n)
          )
            return r;
          n(null, r.data);
        })
    );
  }
  function u() {
    return e.skip_setup
      ? Promise.resolve()
      : i ||
          ((i = s(o)
            .catch(function(e) {
              return e && e.status && 404 === e.status
                ? s(o, { method: "PUT" })
                : Promise.reject(e);
            })
            .catch(function(e) {
              return (
                !(!e || !e.status || 412 !== e.status) || Promise.reject(e)
              );
            })).catch(function() {
            i = null;
          }),
          i);
  }
  function l(e) {
    return e
      .split("/")
      .map(encodeURIComponent)
      .join("/");
  }
  nextTick(function() {
    t(null, n);
  }),
    (n._remote = !0),
    (n.type = function() {
      return "http";
    }),
    (n.id = c("id", function(e) {
      a(genUrl(r, ""))
        .then(function(e) {
          return e.json();
        })
        .catch(function() {
          return {};
        })
        .then(function(t) {
          var n = t && t.uuid ? t.uuid + r.db : genDBUrl(r, "");
          e(null, n);
        });
    })),
    (n.compact = c("compact", function(e, t) {
      "function" == typeof e && ((t = e), (e = {})),
        (e = clone(e)),
        s(genDBUrl(r, "_compact"), { method: "POST" }).then(function() {
          !(function r() {
            n.info(function(n, o) {
              o && !o.compact_running
                ? t(null, { ok: !0 })
                : setTimeout(r, e.interval || 200);
            });
          })();
        });
    })),
    (n.bulkGet = adapterFun("bulkGet", function(e, t) {
      var n = this;
      function o(t) {
        var n = {};
        e.revs && (n.revs = !0),
          e.attachments && (n.attachments = !0),
          e.latest && (n.latest = !0),
          s(genDBUrl(r, "_bulk_get" + paramsToStr(n)), {
            method: "POST",
            body: JSON.stringify({ docs: e.docs })
          })
            .then(function(n) {
              e.attachments &&
                e.binary &&
                n.data.results.forEach(function(e) {
                  e.docs.forEach(readAttachmentsAsBlobOrBuffer);
                }),
                t(null, n.data);
            })
            .catch(t);
      }
      function i() {
        var r = MAX_SIMULTANEOUS_REVS,
          o = Math.ceil(e.docs.length / r),
          i = 0,
          a = new Array(o);
        function c(e) {
          return function(n, r) {
            (a[e] = r.results), ++i === o && t(null, { results: flatten(a) });
          };
        }
        for (var s = 0; s < o; s++) {
          var u = pick(e, ["revs", "attachments", "binary", "latest"]);
          (u.docs = e.docs.slice(s * r, Math.min(e.docs.length, (s + 1) * r))),
            bulkGet(n, u, c(s));
        }
      }
      var a = genUrl(r, ""),
        c = supportsBulkGetMap[a];
      "boolean" != typeof c
        ? o(function(e, n) {
            e
              ? ((supportsBulkGetMap[a] = !1),
                res(
                  e.status,
                  "PouchDB is just detecting if the remote supports the _bulk_get API."
                ),
                i())
              : ((supportsBulkGetMap[a] = !0), t(null, n));
          })
        : c
        ? o(t)
        : i();
    })),
    (n._info = function(e) {
      u()
        .then(function() {
          return a(genDBUrl(r, ""));
        })
        .then(function(e) {
          return e.json();
        })
        .then(function(t) {
          (t.host = genDBUrl(r, "")), e(null, t);
        })
        .catch(e);
    }),
    (n.fetch = function(e, t) {
      return u().then(function() {
        var n =
          "/" === e.substring(0, 1)
            ? genUrl(r, e.substring(1))
            : genDBUrl(r, e);
        return a(n, t);
      });
    }),
    (n.get = c("get", function(e, t, n) {
      "function" == typeof t && ((n = t), (t = {}));
      var o = {};
      function i(e) {
        var n = e._attachments,
          o = n && Object.keys(n);
        if (n && o.length)
          return pool(
            o.map(function(o) {
              return function() {
                return (function(o) {
                  var i = n[o],
                    c = encodeDocId(e._id) + "/" + l(o) + "?rev=" + e._rev;
                  return a(genDBUrl(r, c))
                    .then(function(e) {
                      return "undefined" == typeof process || process.browser
                        ? e.blob()
                        : e.buffer();
                    })
                    .then(function(e) {
                      return t.binary
                        ? ("undefined" == typeof process ||
                            process.browser ||
                            (e.type = i.content_type),
                          e)
                        : new Promise(function(t) {
                            blobToBase64(e, t);
                          });
                    })
                    .then(function(e) {
                      delete i.stub, delete i.length, (i.data = e);
                    });
                })(o);
              };
            }),
            5
          );
      }
      (t = clone(t)).revs && (o.revs = !0),
        t.revs_info && (o.revs_info = !0),
        t.latest && (o.latest = !0),
        t.open_revs &&
          ("all" !== t.open_revs && (t.open_revs = JSON.stringify(t.open_revs)),
          (o.open_revs = t.open_revs)),
        t.rev && (o.rev = t.rev),
        t.conflicts && (o.conflicts = t.conflicts),
        t.update_seq && (o.update_seq = t.update_seq),
        (e = encodeDocId(e)),
        s(genDBUrl(r, e + paramsToStr(o)))
          .then(function(e) {
            return Promise.resolve()
              .then(function() {
                if (t.attachments)
                  return (
                    (n = e.data),
                    Array.isArray(n)
                      ? Promise.all(
                          n.map(function(e) {
                            if (e.ok) return i(e.ok);
                          })
                        )
                      : i(n)
                  );
                var n;
              })
              .then(function() {
                n(null, e.data);
              });
          })
          .catch(function(t) {
            (t.docId = e), n(t);
          });
    })),
    (n.remove = c("remove", function(e, t, n, o) {
      var i;
      "string" == typeof t
        ? ((i = { _id: e, _rev: t }),
          "function" == typeof n && ((o = n), (n = {})))
        : ((i = e),
          "function" == typeof t ? ((o = t), (n = {})) : ((o = n), (n = t)));
      var a = i._rev || n.rev;
      s(
        genDBUrl(r, encodeDocId(i._id)) + "?rev=" + a,
        { method: "DELETE" },
        o
      ).catch(o);
    })),
    (n.getAttachment = c("getAttachment", function(e, t, n, o) {
      "function" == typeof n && ((o = n), (n = {}));
      var i,
        c = n.rev ? "?rev=" + n.rev : "",
        s = genDBUrl(r, encodeDocId(e)) + "/" + l(t) + c;
      a(s, { method: "GET" })
        .then(function(e) {
          if (((i = e.headers.get("content-type")), e.ok))
            return "undefined" == typeof process || process.browser
              ? e.blob()
              : e.buffer();
          throw e;
        })
        .then(function(e) {
          "undefined" == typeof process || process.browser || (e.type = i),
            o(null, e);
        })
        .catch(function(e) {
          o(e);
        });
    })),
    (n.removeAttachment = c("removeAttachment", function(e, t, n, o) {
      s(
        genDBUrl(r, encodeDocId(e) + "/" + l(t)) + "?rev=" + n,
        { method: "DELETE" },
        o
      ).catch(o);
    })),
    (n.putAttachment = c("putAttachment", function(e, t, n, o, i, a) {
      "function" == typeof i && ((a = i), (i = o), (o = n), (n = null));
      var c = encodeDocId(e) + "/" + l(t),
        u = genDBUrl(r, c);
      if ((n && (u += "?rev=" + n), "string" == typeof o)) {
        var f;
        try {
          f = thisAtob(o);
        } catch (e) {
          return a(
            createError(BAD_ARG, "Attachment is not a valid base64 string")
          );
        }
        o = f ? binStringToBluffer(f, i) : "";
      }
      s(
        u,
        {
          headers: new nodeFetch.Headers({ "Content-Type": i }),
          method: "PUT",
          body: o
        },
        a
      ).catch(a);
    })),
    (n._bulkDocs = function(e, t, n) {
      (e.new_edits = t.new_edits),
        u()
          .then(function() {
            return Promise.all(e.docs.map(preprocessAttachments$1));
          })
          .then(function() {
            return s(
              genDBUrl(r, "_bulk_docs"),
              { method: "POST", body: JSON.stringify(e) },
              n
            );
          })
          .catch(n);
    }),
    (n._put = function(e, t, n) {
      u()
        .then(function() {
          return preprocessAttachments$1(e);
        })
        .then(function() {
          return s(genDBUrl(r, encodeDocId(e._id)), {
            method: "PUT",
            body: JSON.stringify(e)
          });
        })
        .then(function(e) {
          n(null, e.data);
        })
        .catch(function(t) {
          (t.docId = e && e._id), n(t);
        });
    }),
    (n.allDocs = c("allDocs", function(e, t) {
      "function" == typeof e && ((t = e), (e = {}));
      var n,
        o = {},
        i = "GET";
      (e = clone(e)).conflicts && (o.conflicts = !0),
        e.update_seq && (o.update_seq = !0),
        e.descending && (o.descending = !0),
        e.include_docs && (o.include_docs = !0),
        e.attachments && (o.attachments = !0),
        e.key && (o.key = JSON.stringify(e.key)),
        e.start_key && (e.startkey = e.start_key),
        e.startkey && (o.startkey = JSON.stringify(e.startkey)),
        e.end_key && (e.endkey = e.end_key),
        e.endkey && (o.endkey = JSON.stringify(e.endkey)),
        void 0 !== e.inclusive_end && (o.inclusive_end = !!e.inclusive_end),
        void 0 !== e.limit && (o.limit = e.limit),
        void 0 !== e.skip && (o.skip = e.skip);
      var a = paramsToStr(o);
      void 0 !== e.keys && ((i = "POST"), (n = { keys: e.keys })),
        s(genDBUrl(r, "_all_docs" + a), { method: i, body: JSON.stringify(n) })
          .then(function(n) {
            e.include_docs &&
              e.attachments &&
              e.binary &&
              n.data.rows.forEach(readAttachmentsAsBlobOrBuffer),
              t(null, n.data);
          })
          .catch(t);
    })),
    (n._changes = function(e) {
      var t = "batch_size" in e ? e.batch_size : CHANGES_BATCH_SIZE;
      !(e = clone(e)).continuous ||
        "heartbeat" in e ||
        (e.heartbeat = DEFAULT_HEARTBEAT);
      var n = "timeout" in e ? e.timeout : 3e4;
      "timeout" in e &&
        e.timeout &&
        n - e.timeout < CHANGES_TIMEOUT_BUFFER &&
        (n = e.timeout + CHANGES_TIMEOUT_BUFFER),
        "heartbeat" in e &&
          e.heartbeat &&
          n - e.heartbeat < CHANGES_TIMEOUT_BUFFER &&
          (n = e.heartbeat + CHANGES_TIMEOUT_BUFFER);
      var o = {};
      "timeout" in e && e.timeout && (o.timeout = e.timeout);
      var i = void 0 !== e.limit && e.limit,
        a = i;
      if (
        (e.style && (o.style = e.style),
        (e.include_docs || (e.filter && "function" == typeof e.filter)) &&
          (o.include_docs = !0),
        e.attachments && (o.attachments = !0),
        e.continuous && (o.feed = "longpoll"),
        e.seq_interval && (o.seq_interval = e.seq_interval),
        e.conflicts && (o.conflicts = !0),
        e.descending && (o.descending = !0),
        e.update_seq && (o.update_seq = !0),
        "heartbeat" in e && e.heartbeat && (o.heartbeat = e.heartbeat),
        e.filter && "string" == typeof e.filter && (o.filter = e.filter),
        e.view &&
          "string" == typeof e.view &&
          ((o.filter = "_view"), (o.view = e.view)),
        e.query_params && "object" == typeof e.query_params)
      )
        for (var c in e.query_params)
          e.query_params.hasOwnProperty(c) && (o[c] = e.query_params[c]);
      var l,
        f = "GET";
      e.doc_ids
        ? ((o.filter = "_doc_ids"), (f = "POST"), (l = { doc_ids: e.doc_ids }))
        : e.selector &&
          ((o.filter = "_selector"),
          (f = "POST"),
          (l = { selector: e.selector }));
      var d,
        p = new AbortController(),
        h = function(n, c) {
          if (!e.aborted) {
            (o.since = n),
              "object" == typeof o.since && (o.since = JSON.stringify(o.since)),
              e.descending
                ? i && (o.limit = a)
                : (o.limit = !i || a > t ? t : a);
            var h = genDBUrl(r, "_changes" + paramsToStr(o)),
              v = { signal: p.signal, method: f, body: JSON.stringify(l) };
            (d = n),
              e.aborted ||
                u()
                  .then(function() {
                    return s(h, v, c);
                  })
                  .catch(c);
          }
        },
        v = { results: [] },
        _ = function(n, r) {
          if (!e.aborted) {
            var o = 0;
            if (r && r.results) {
              (o = r.results.length), (v.last_seq = r.last_seq);
              var c = null,
                s = null;
              "number" == typeof r.pending && (c = r.pending),
                ("string" != typeof v.last_seq &&
                  "number" != typeof v.last_seq) ||
                  (s = v.last_seq);
              e.query_params,
                (r.results = r.results.filter(function(t) {
                  a--;
                  var n = filterChange(e)(t);
                  return (
                    n &&
                      (e.include_docs &&
                        e.attachments &&
                        e.binary &&
                        readAttachmentsAsBlobOrBuffer(t),
                      e.return_docs && v.results.push(t),
                      e.onChange(t, c, s)),
                    n
                  );
                }));
            } else if (n) return (e.aborted = !0), void e.complete(n);
            r && r.last_seq && (d = r.last_seq);
            var u = (i && a <= 0) || (r && o < t) || e.descending;
            (!e.continuous || (i && a <= 0)) && u
              ? e.complete(null, v)
              : nextTick(function() {
                  h(d, _);
                });
          }
        };
      return (
        h(e.since || 0, _),
        {
          cancel: function() {
            (e.aborted = !0), p.abort();
          }
        }
      );
    }),
    (n.revsDiff = c("revsDiff", function(e, t, n) {
      "function" == typeof t && ((n = t), (t = {})),
        s(
          genDBUrl(r, "_revs_diff"),
          { method: "POST", body: JSON.stringify(e) },
          n
        ).catch(n);
    })),
    (n._close = function(e) {
      e();
    }),
    (n._destroy = function(e, t) {
      s(genDBUrl(r, ""), { method: "DELETE" })
        .then(function(e) {
          t(null, e);
        })
        .catch(function(e) {
          404 === e.status ? t(null, { ok: !0 }) : t(e);
        });
    });
}
function HttpPouch$1(e) {
  e.adapter("http", HttpPouch, !1), e.adapter("https", HttpPouch, !1);
}
function QueryParseError(e) {
  (this.status = 400),
    (this.name = "query_parse_error"),
    (this.message = e),
    (this.error = !0);
  try {
    Error.captureStackTrace(this, QueryParseError);
  } catch (e) {}
}
function NotFoundError$1(e) {
  (this.status = 404),
    (this.name = "not_found"),
    (this.message = e),
    (this.error = !0);
  try {
    Error.captureStackTrace(this, NotFoundError$1);
  } catch (e) {}
}
function BuiltInError(e) {
  (this.status = 500),
    (this.name = "invalid_value"),
    (this.message = e),
    (this.error = !0);
  try {
    Error.captureStackTrace(this, BuiltInError);
  } catch (e) {}
}
function promisedCallback(e, t) {
  return (
    t &&
      e.then(
        function(e) {
          nextTick(function() {
            t(null, e);
          });
        },
        function(e) {
          nextTick(function() {
            t(e);
          });
        }
      ),
    e
  );
}
function callbackify(e) {
  return getArguments(function(t) {
    var n = t.pop(),
      r = e.apply(this, t);
    return "function" == typeof n && promisedCallback(r, n), r;
  });
}
function fin(e, t) {
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
}
function sequentialize(e, t) {
  return function() {
    var n = arguments,
      r = this;
    return e.add(function() {
      return t.apply(r, n);
    });
  };
}
function uniq(e) {
  var t = new ExportedSet(e),
    n = new Array(t.size),
    r = -1;
  return (
    t.forEach(function(e) {
      n[++r] = e;
    }),
    n
  );
}
function mapToKeysArray(e) {
  var t = new Array(e.size),
    n = -1;
  return (
    e.forEach(function(e, r) {
      t[++n] = r;
    }),
    t
  );
}
function createBuiltInError(e) {
  return new BuiltInError(
    "builtin " +
      e +
      " function requires map values to be numbers or number arrays"
  );
}
function sum(e) {
  for (var t = 0, n = 0, r = e.length; n < r; n++) {
    var o = e[n];
    if ("number" != typeof o) {
      if (!Array.isArray(o)) throw createBuiltInError("_sum");
      t = "number" == typeof t ? [t] : t;
      for (var i = 0, a = o.length; i < a; i++) {
        var c = o[i];
        if ("number" != typeof c) throw createBuiltInError("_sum");
        void 0 === t[i] ? t.push(c) : (t[i] += c);
      }
    } else "number" == typeof t ? (t += o) : (t[0] += o);
  }
  return t;
}
function createBuiltInErrorInVm(e) {
  return { builtInError: !0, name: e };
}
function convertToTrueError(e) {
  return createBuiltInError(e.name);
}
function isBuiltInError(e) {
  return e && e.builtInError;
}
function evalFunctionInVm(e, t) {
  return function(n, r, o) {
    var i =
        '(function() {"use strict";var createBuiltInError = ' +
        createBuiltInErrorInVm.toString() +
        ";var sum = " +
        sum.toString() +
        ";var log = function () {};var isArray = Array.isArray;var toJSON = JSON.parse;var __emitteds__ = [];var emit = function (key, value) {__emitteds__.push([key, value]);};var __result__ = (" +
        e.replace(/;\s*$/, "") +
        ")(" +
        JSON.stringify(n) +
        "," +
        JSON.stringify(r) +
        "," +
        JSON.stringify(o) +
        ");return {result: __result__, emitteds: __emitteds__};})()",
      a = vm.runInNewContext(i);
    return (
      a.emitteds.forEach(function(e) {
        t(e[0], e[1]);
      }),
      isBuiltInError(a.result) && (a.result = convertToTrueError(a.result)),
      a.result
    );
  };
}
(HttpPouch.valid = function() {
  return !0;
}),
  inherits(QueryParseError, Error),
  inherits(NotFoundError$1, Error),
  inherits(BuiltInError, Error);
var evalFunc,
  log = guardedConsole.bind(null, "log"),
  toJSON = JSON.parse,
  evalFunction = (evalFunc = evalFunctionInVm);
function TaskQueue$1() {
  this.promise = new Promise(function(e) {
    e();
  });
}
function stringify(e) {
  if (!e) return "undefined";
  switch (typeof e) {
    case "function":
    case "string":
      return e.toString();
    default:
      return JSON.stringify(e);
  }
}
function createViewSignature(e, t) {
  return stringify(e) + stringify(t) + "undefined";
}
function createView(e, t, n, r, o, i) {
  var a,
    c = createViewSignature(n, r);
  if (!o && (a = e._cachedViews = e._cachedViews || {})[c]) return a[c];
  var s = e.info().then(function(s) {
    var u = s.db_name + "-mrview-" + (o ? "temp" : stringMd5(c));
    return upsert(e, "_local/" + i, function(e) {
      e.views = e.views || {};
      var n = t;
      -1 === n.indexOf("/") && (n = t + "/" + t);
      var r = (e.views[n] = e.views[n] || {});
      if (!r[u]) return (r[u] = !0), e;
    }).then(function() {
      return e.registerDependentDatabase(u).then(function(t) {
        var o = t.db;
        o.auto_compaction = !0;
        var i = {
          name: u,
          db: o,
          sourceDB: e,
          adapter: e.adapter,
          mapFun: n,
          reduceFun: r
        };
        return i.db
          .get("_local/lastSeq")
          .catch(function(e) {
            if (404 !== e.status) throw e;
          })
          .then(function(e) {
            return (
              (i.seq = e ? e.seq : 0),
              a &&
                i.db.once("destroyed", function() {
                  delete a[c];
                }),
              i
            );
          });
      });
    });
  });
  return a && (a[c] = s), s;
}
(TaskQueue$1.prototype.add = function(e) {
  return (
    (this.promise = this.promise
      .catch(function() {})
      .then(function() {
        return e();
      })),
    this.promise
  );
}),
  (TaskQueue$1.prototype.finish = function() {
    return this.promise;
  });
var persistentQueues = {},
  tempViewQueue = new TaskQueue$1(),
  CHANGES_BATCH_SIZE$1 = 50;
function parseViewName(e) {
  return -1 === e.indexOf("/") ? [e, e] : e.split("/");
}
function isGenOne(e) {
  return 1 === e.length && /^1-/.test(e[0].rev);
}
function emitError(e, t) {
  try {
    e.emit("error", t);
  } catch (e) {
    guardedConsole(
      "error",
      "The user's map/reduce function threw an uncaught error.\nYou can debug this error by doing:\nmyDatabase.on('error', function (err) { debugger; });\nPlease double-check your map/reduce function."
    ),
      guardedConsole("error", t);
  }
}
function createAbstractMapReduce(e, t, n, r) {
  function o(e, t, n) {
    try {
      t(n);
    } catch (t) {
      emitError(e, t);
    }
  }
  function i(e, t, n, r, o) {
    try {
      return { output: t(n, r, o) };
    } catch (t) {
      return emitError(e, t), { error: t };
    }
  }
  function a(e, t) {
    var n = collate(e.key, t.key);
    return 0 !== n ? n : collate(e.value, t.value);
  }
  function c(e, t, n) {
    return (
      (n = n || 0),
      "number" == typeof t ? e.slice(n, t + n) : n > 0 ? e.slice(n) : e
    );
  }
  function s(e) {
    var t = e.value;
    return (t && "object" == typeof t && t._id) || e.id;
  }
  function u(e) {
    return function(t) {
      return (
        e.include_docs &&
          e.attachments &&
          e.binary &&
          (function(e) {
            e.rows.forEach(function(e) {
              var t = e.doc && e.doc._attachments;
              t &&
                Object.keys(t).forEach(function(e) {
                  var n = t[e];
                  t[e].data = b64ToBluffer(n.data, n.content_type);
                });
            });
          })(t),
        t
      );
    };
  }
  function l(e, t, n, r) {
    var o = t[e];
    void 0 !== o &&
      (r && (o = encodeURIComponent(JSON.stringify(o))), n.push(e + "=" + o));
  }
  function f(e) {
    if (void 0 !== e) {
      var t = Number(e);
      return isNaN(t) || t !== parseInt(e, 10) ? e : t;
    }
  }
  function d(e, t) {
    var n = e.descending ? "endkey" : "startkey",
      r = e.descending ? "startkey" : "endkey";
    if (void 0 !== e[n] && void 0 !== e[r] && collate(e[n], e[r]) > 0)
      throw new QueryParseError(
        "No rows can match your key range, reverse your start_key and end_key or set {descending : true}"
      );
    if (t.reduce && !1 !== e.reduce) {
      if (e.include_docs)
        throw new QueryParseError("{include_docs:true} is invalid for reduce");
      if (e.keys && e.keys.length > 1 && !e.group && !e.group_level)
        throw new QueryParseError(
          "Multi-key fetches for reduce views must use {group: true}"
        );
    }
    ["group_level", "limit", "skip"].forEach(function(t) {
      var n = (function(e) {
        if (e) {
          if ("number" != typeof e)
            return new QueryParseError(
              'Invalid value for integer: "' + e + '"'
            );
          if (e < 0)
            return new QueryParseError(
              'Invalid value for positive integer: "' + e + '"'
            );
        }
      })(e[t]);
      if (n) throw n;
    });
  }
  function p(e) {
    return function(t) {
      if (404 === t.status) return e;
      throw t;
    };
  }
  function h(e, t, n) {
    var r = "_local/doc_" + e,
      o = { _id: r, keys: [] },
      i = n.get(e),
      a = i[0];
    return (isGenOne(i[1]) ? Promise.resolve(o) : t.db.get(r).catch(p(o))).then(
      function(e) {
        return (function(e) {
          return e.keys.length
            ? t.db.allDocs({ keys: e.keys, include_docs: !0 })
            : Promise.resolve({ rows: [] });
        })(e).then(function(t) {
          return (function(e, t) {
            for (
              var n = [], r = new ExportedSet(), o = 0, i = t.rows.length;
              o < i;
              o++
            ) {
              var c = t.rows[o].doc;
              if (
                c &&
                (n.push(c),
                r.add(c._id),
                (c._deleted = !a.has(c._id)),
                !c._deleted)
              ) {
                var s = a.get(c._id);
                "value" in s && (c.value = s.value);
              }
            }
            var u = mapToKeysArray(a);
            return (
              u.forEach(function(e) {
                if (!r.has(e)) {
                  var t = { _id: e },
                    o = a.get(e);
                  "value" in o && (t.value = o.value), n.push(t);
                }
              }),
              (e.keys = uniq(u.concat(e.keys))),
              n.push(e),
              n
            );
          })(e, t);
        });
      }
    );
  }
  function v(e) {
    var t = "string" == typeof e ? e : e.name,
      n = persistentQueues[t];
    return n || (n = persistentQueues[t] = new TaskQueue$1()), n;
  }
  function _(e) {
    return sequentialize(v(e), function() {
      return (function(e) {
        var n, r;
        var i = t(e.mapFun, function(e, t) {
            var o = { id: r._id, key: normalizeKey(e) };
            null != t && (o.value = normalizeKey(t));
            n.push(o);
          }),
          c = e.seq || 0;
        function s(t, n) {
          return function() {
            return (function(e, t, n) {
              return e.db
                .get("_local/lastSeq")
                .catch(p({ _id: "_local/lastSeq", seq: 0 }))
                .then(function(r) {
                  var o = mapToKeysArray(t);
                  return Promise.all(
                    o.map(function(n) {
                      return h(n, e, t);
                    })
                  ).then(function(t) {
                    var o = flatten(t);
                    return (r.seq = n), o.push(r), e.db.bulkDocs({ docs: o });
                  });
                });
            })(e, t, n);
          };
        }
        var u = new TaskQueue$1();
        function l() {
          return e.sourceDB
            .changes({
              return_docs: !0,
              conflicts: !0,
              include_docs: !0,
              style: "all_docs",
              since: c,
              limit: CHANGES_BATCH_SIZE$1
            })
            .then(f);
        }
        function f(t) {
          var f = t.results;
          if (f.length) {
            var p = (function(t) {
              for (var s = new ExportedMap(), u = 0, l = t.length; u < l; u++) {
                var f = t[u];
                if ("_" !== f.doc._id[0]) {
                  (n = []),
                    (r = f.doc)._deleted || o(e.sourceDB, i, r),
                    n.sort(a);
                  var p = d(n);
                  s.set(f.doc._id, [p, f.changes]);
                }
                c = f.seq;
              }
              return s;
            })(f);
            if ((u.add(s(p, c)), !(f.length < CHANGES_BATCH_SIZE$1)))
              return l();
          }
        }
        function d(e) {
          for (var t, n = new ExportedMap(), r = 0, o = e.length; r < o; r++) {
            var i = e[r],
              a = [i.key, i.id];
            r > 0 && 0 === collate(i.key, t) && a.push(r),
              n.set(toIndexableString(a), i),
              (t = i.key);
          }
          return n;
        }
        return l()
          .then(function() {
            return u.finish();
          })
          .then(function() {
            e.seq = c;
          });
      })(e);
    })();
  }
  function m(e, t) {
    return sequentialize(v(e), function() {
      return (function(e, t) {
        var r,
          o = e.reduceFun && !1 !== t.reduce,
          a = t.skip || 0;
        void 0 === t.keys || t.keys.length || ((t.limit = 0), delete t.keys);
        function u(t) {
          return (
            (t.include_docs = !0),
            e.db.allDocs(t).then(function(e) {
              return (
                (r = e.total_rows),
                e.rows.map(function(e) {
                  if (
                    "value" in e.doc &&
                    "object" == typeof e.doc.value &&
                    null !== e.doc.value
                  ) {
                    var t = Object.keys(e.doc.value).sort(),
                      n = ["id", "key", "value"];
                    if (!(t < n || t > n)) return e.doc.value;
                  }
                  var r = parseIndexableString(e.doc._id);
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
        function l(u) {
          var l;
          if (
            ((l = o
              ? (function(e, t, r) {
                  0 === r.group_level && delete r.group_level;
                  var o = r.group || r.group_level,
                    a = n(e.reduceFun),
                    s = [],
                    u = isNaN(r.group_level)
                      ? Number.POSITIVE_INFINITY
                      : r.group_level;
                  t.forEach(function(e) {
                    var t = s[s.length - 1],
                      n = o ? e.key : null;
                    if (
                      (o && Array.isArray(n) && (n = n.slice(0, u)),
                      t && 0 === collate(t.groupKey, n))
                    )
                      return (
                        t.keys.push([e.key, e.id]), void t.values.push(e.value)
                      );
                    s.push({
                      keys: [[e.key, e.id]],
                      values: [e.value],
                      groupKey: n
                    });
                  }),
                    (t = []);
                  for (var l = 0, f = s.length; l < f; l++) {
                    var d = s[l],
                      p = i(e.sourceDB, a, d.keys, d.values, !1);
                    if (p.error && p.error instanceof BuiltInError)
                      throw p.error;
                    t.push({
                      value: p.error ? null : p.output,
                      key: d.groupKey
                    });
                  }
                  return { rows: c(t, r.limit, r.skip) };
                })(e, u, t)
              : { total_rows: r, offset: a, rows: u }),
            t.update_seq && (l.update_seq = e.seq),
            t.include_docs)
          ) {
            var f = uniq(u.map(s));
            return e.sourceDB
              .allDocs({
                keys: f,
                include_docs: !0,
                conflicts: t.conflicts,
                attachments: t.attachments,
                binary: t.binary
              })
              .then(function(e) {
                var t = new ExportedMap();
                return (
                  e.rows.forEach(function(e) {
                    t.set(e.id, e.doc);
                  }),
                  u.forEach(function(e) {
                    var n = s(e),
                      r = t.get(n);
                    r && (e.doc = r);
                  }),
                  l
                );
              });
          }
          return l;
        }
        if (void 0 !== t.keys) {
          var f = t.keys,
            d = f.map(function(e) {
              var n = {
                startkey: toIndexableString([e]),
                endkey: toIndexableString([e, {}])
              };
              return t.update_seq && (n.update_seq = !0), u(n);
            });
          return Promise.all(d)
            .then(flatten)
            .then(l);
        }
        var p,
          h,
          v = { descending: t.descending };
        if (
          (t.update_seq && (v.update_seq = !0),
          "start_key" in t && (p = t.start_key),
          "startkey" in t && (p = t.startkey),
          "end_key" in t && (h = t.end_key),
          "endkey" in t && (h = t.endkey),
          void 0 !== p &&
            (v.startkey = t.descending
              ? toIndexableString([p, {}])
              : toIndexableString([p])),
          void 0 !== h)
        ) {
          var _ = !1 !== t.inclusive_end;
          t.descending && (_ = !_),
            (v.endkey = toIndexableString(_ ? [h, {}] : [h]));
        }
        if (void 0 !== t.key) {
          var m = toIndexableString([t.key]),
            g = toIndexableString([t.key, {}]);
          v.descending
            ? ((v.endkey = m), (v.startkey = g))
            : ((v.startkey = m), (v.endkey = g));
        }
        return (
          o ||
            ("number" == typeof t.limit && (v.limit = t.limit), (v.skip = a)),
          u(v).then(l)
        );
      })(e, t);
    })();
  }
  function g(t, n, o) {
    if ("function" == typeof t._query)
      return (function(e, t, n) {
        return new Promise(function(r, o) {
          e._query(t, n, function(e, t) {
            if (e) return o(e);
            r(t);
          });
        });
      })(t, n, o);
    if (isRemote(t))
      return (function(e, t, n) {
        var r,
          o,
          i,
          a = [],
          c = "GET";
        if (
          (l("reduce", n, a),
          l("include_docs", n, a),
          l("attachments", n, a),
          l("limit", n, a),
          l("descending", n, a),
          l("group", n, a),
          l("group_level", n, a),
          l("skip", n, a),
          l("stale", n, a),
          l("conflicts", n, a),
          l("startkey", n, a, !0),
          l("start_key", n, a, !0),
          l("endkey", n, a, !0),
          l("end_key", n, a, !0),
          l("inclusive_end", n, a),
          l("key", n, a, !0),
          l("update_seq", n, a),
          (a = "" === (a = a.join("&")) ? "" : "?" + a),
          void 0 !== n.keys)
        ) {
          var s = "keys=" + encodeURIComponent(JSON.stringify(n.keys));
          s.length + a.length + 1 <= 2e3
            ? (a += ("?" === a[0] ? "&" : "?") + s)
            : ((c = "POST"),
              "string" == typeof t
                ? (r = { keys: n.keys })
                : (t.keys = n.keys));
        }
        if ("string" == typeof t) {
          var f = parseViewName(t);
          return e
            .fetch("_design/" + f[0] + "/_view/" + f[1] + a, {
              headers: new nodeFetch.Headers({
                "Content-Type": "application/json"
              }),
              method: c,
              body: JSON.stringify(r)
            })
            .then(function(e) {
              return (o = e.ok), (i = e.status), e.json();
            })
            .then(function(e) {
              if (!o) throw ((e.status = i), generateErrorFromResponse(e));
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
            .then(u(n));
        }
        return (
          (r = r || {}),
          Object.keys(t).forEach(function(e) {
            Array.isArray(t[e]) ? (r[e] = t[e]) : (r[e] = t[e].toString());
          }),
          e
            .fetch("_temp_view" + a, {
              headers: new nodeFetch.Headers({
                "Content-Type": "application/json"
              }),
              method: "POST",
              body: JSON.stringify(r)
            })
            .then(function(e) {
              return (o = e.ok), (i = e.status), e.json();
            })
            .then(function(e) {
              if (!o) throw ((e.status = i), generateErrorFromResponse(e));
              return e;
            })
            .then(u(n))
        );
      })(t, n, o);
    if ("string" != typeof n)
      return (
        d(o, n),
        tempViewQueue.add(function() {
          return createView(
            t,
            "temp_view/temp_view",
            n.map,
            n.reduce,
            !0,
            e
          ).then(function(e) {
            return fin(
              _(e).then(function() {
                return m(e, o);
              }),
              function() {
                return e.db.destroy();
              }
            );
          });
        }),
        tempViewQueue.finish()
      );
    var i = n,
      a = parseViewName(i),
      c = a[0],
      s = a[1];
    return t.get("_design/" + c).then(function(n) {
      var a = n.views && n.views[s];
      if (!a)
        throw new NotFoundError$1("ddoc " + n._id + " has no view named " + s);
      return (
        r(n, s),
        d(o, a),
        createView(t, i, a.map, a.reduce, !1, e).then(function(e) {
          return "ok" === o.stale || "update_after" === o.stale
            ? ("update_after" === o.stale &&
                nextTick(function() {
                  _(e);
                }),
              m(e, o))
            : _(e).then(function() {
                return m(e, o);
              });
        })
      );
    });
  }
  return {
    query: function(e, t, n) {
      var r = this;
      "function" == typeof t && ((n = t), (t = {})),
        (t = t
          ? (function(e) {
              return (
                (e.group_level = f(e.group_level)),
                (e.limit = f(e.limit)),
                (e.skip = f(e.skip)),
                e
              );
            })(t)
          : {}),
        "function" == typeof e && (e = { map: e });
      var o = Promise.resolve().then(function() {
        return g(r, e, t);
      });
      return promisedCallback(o, n), o;
    },
    viewCleanup: callbackify(function() {
      var t = this;
      return "function" == typeof t._viewCleanup
        ? (function(e) {
            return new Promise(function(t, n) {
              e._viewCleanup(function(e, r) {
                if (e) return n(e);
                t(r);
              });
            });
          })(t)
        : isRemote(t)
        ? (function(e) {
            return e
              .fetch("_view_cleanup", {
                headers: new nodeFetch.Headers({
                  "Content-Type": "application/json"
                }),
                method: "POST"
              })
              .then(function(e) {
                return e.json();
              });
          })(t)
        : (function(t) {
            return t.get("_local/" + e).then(function(e) {
              var n = new ExportedMap();
              Object.keys(e.views).forEach(function(e) {
                var t = parseViewName(e),
                  r = "_design/" + t[0],
                  o = t[1],
                  i = n.get(r);
                i || ((i = new ExportedSet()), n.set(r, i)), i.add(o);
              });
              var r = { keys: mapToKeysArray(n), include_docs: !0 };
              return t.allDocs(r).then(function(r) {
                var o = {};
                r.rows.forEach(function(t) {
                  var r = t.key.substring(8);
                  n.get(t.key).forEach(function(n) {
                    var i = r + "/" + n;
                    e.views[i] || (i = n);
                    var a = Object.keys(e.views[i]),
                      c = t.doc && t.doc.views && t.doc.views[n];
                    a.forEach(function(e) {
                      o[e] = o[e] || c;
                    });
                  });
                });
                var i = Object.keys(o)
                  .filter(function(e) {
                    return !o[e];
                  })
                  .map(function(e) {
                    return sequentialize(v(e), function() {
                      return new t.constructor(e, t.__opts).destroy();
                    })();
                  });
                return Promise.all(i).then(function() {
                  return { ok: !0 };
                });
              });
            }, p({ ok: !0 }));
          })(t);
    })
  };
}
var builtInReduce = {
  _sum: function(e, t) {
    return sum(t);
  },
  _count: function(e, t) {
    return t.length;
  },
  _stats: function(e, t) {
    return {
      sum: sum(t),
      min: Math.min.apply(null, t),
      max: Math.max.apply(null, t),
      count: t.length,
      sumsqr: (function(e) {
        for (var t = 0, n = 0, r = e.length; n < r; n++) {
          var o = e[n];
          t += o * o;
        }
        return t;
      })(t)
    };
  }
};
function getBuiltIn(e) {
  if (/^_sum/.test(e)) return builtInReduce._sum;
  if (/^_count/.test(e)) return builtInReduce._count;
  if (/^_stats/.test(e)) return builtInReduce._stats;
  if (/^_/.test(e)) throw new Error(e + " is not a supported reduce function.");
}
function mapper(e, t) {
  if ("function" == typeof e && 2 === e.length) {
    var n = e;
    return function(e) {
      return n(e, t);
    };
  }
  return evalFunction(e.toString(), t);
}
function reducer(e) {
  var t = e.toString(),
    n = getBuiltIn(t);
  return n || evalFunction(t);
}
function ddocValidator(e, t) {
  var n = e.views && e.views[t];
  if ("string" != typeof n.map)
    throw new NotFoundError$1(
      "ddoc " +
        e._id +
        " has no string view named " +
        t +
        ", instead found object of type: " +
        typeof n.map
    );
}
var localDocName = "mrviews",
  abstract = createAbstractMapReduce(
    localDocName,
    mapper,
    reducer,
    ddocValidator
  );
function query(e, t, n) {
  return abstract.query.call(this, e, t, n);
}
function viewCleanup(e) {
  return abstract.viewCleanup.call(this, e);
}
var mapreduce = { query: query, viewCleanup: viewCleanup };
function isGenOne$1(e) {
  return /^1-/.test(e);
}
function fileHasChanged(e, t, n) {
  return (
    !e._attachments ||
    !e._attachments[n] ||
    e._attachments[n].digest !== t._attachments[n].digest
  );
}
function getDocAttachments(e, t) {
  var n = Object.keys(t._attachments);
  return Promise.all(
    n.map(function(n) {
      return e.getAttachment(t._id, n, { rev: t._rev });
    })
  );
}
function getDocAttachmentsFromTargetOrSource(e, t, n) {
  var r = isRemote(t) && !isRemote(e),
    o = Object.keys(n._attachments);
  return r
    ? e
        .get(n._id)
        .then(function(r) {
          return Promise.all(
            o.map(function(o) {
              return fileHasChanged(r, n, o)
                ? t.getAttachment(n._id, o)
                : e.getAttachment(r._id, o);
            })
          );
        })
        .catch(function(e) {
          if (404 !== e.status) throw e;
          return getDocAttachments(t, n);
        })
    : getDocAttachments(t, n);
}
function createBulkGetOpts(e) {
  var t = [];
  return (
    Object.keys(e).forEach(function(n) {
      e[n].missing.forEach(function(e) {
        t.push({ id: n, rev: e });
      });
    }),
    { docs: t, revs: !0, latest: !0 }
  );
}
function getDocs(e, t, n, r) {
  n = clone(n);
  var o = [],
    i = !0;
  function a(t) {
    return e
      .allDocs({ keys: t, include_docs: !0, conflicts: !0 })
      .then(function(e) {
        if (r.cancelled) throw new Error("cancelled");
        e.rows.forEach(function(e) {
          var t;
          e.deleted ||
            !e.doc ||
            !isGenOne$1(e.value.rev) ||
            ((t = e.doc),
            t._attachments && Object.keys(t._attachments).length > 0) ||
            (function(e) {
              return e._conflicts && e._conflicts.length > 0;
            })(e.doc) ||
            (e.doc._conflicts && delete e.doc._conflicts,
            o.push(e.doc),
            delete n[e.id]);
        });
      });
  }
  return Promise.resolve()
    .then(function() {
      var e = Object.keys(n).filter(function(e) {
        var t = n[e].missing;
        return 1 === t.length && isGenOne$1(t[0]);
      });
      if (e.length > 0) return a(e);
    })
    .then(function() {
      var a = createBulkGetOpts(n);
      if (a.docs.length)
        return e.bulkGet(a).then(function(n) {
          if (r.cancelled) throw new Error("cancelled");
          return Promise.all(
            n.results.map(function(n) {
              return Promise.all(
                n.docs.map(function(n) {
                  var r = n.ok;
                  return (
                    n.error && (i = !1),
                    r && r._attachments
                      ? getDocAttachmentsFromTargetOrSource(t, e, r).then(
                          function(e) {
                            var t = Object.keys(r._attachments);
                            return (
                              e.forEach(function(e, n) {
                                var o = r._attachments[t[n]];
                                delete o.stub, delete o.length, (o.data = e);
                              }),
                              r
                            );
                          }
                        )
                      : r
                  );
                })
              );
            })
          ).then(function(e) {
            o = o.concat(flatten(e).filter(Boolean));
          });
        });
    })
    .then(function() {
      return { ok: i, docs: o };
    });
}
var CHECKPOINT_VERSION = 1,
  REPLICATOR = "pouchdb",
  CHECKPOINT_HISTORY_SIZE = 5,
  LOWEST_SEQ = 0;
function updateCheckpoint(e, t, n, r, o) {
  return e
    .get(t)
    .catch(function(n) {
      if (404 === n.status)
        return (
          "http" === e.adapter || e.adapter,
          {
            session_id: r,
            _id: t,
            history: [],
            replicator: REPLICATOR,
            version: CHECKPOINT_VERSION
          }
        );
      throw n;
    })
    .then(function(i) {
      if (!o.cancelled && i.last_seq !== n)
        return (
          (i.history = (i.history || []).filter(function(e) {
            return e.session_id !== r;
          })),
          i.history.unshift({ last_seq: n, session_id: r }),
          (i.history = i.history.slice(0, CHECKPOINT_HISTORY_SIZE)),
          (i.version = CHECKPOINT_VERSION),
          (i.replicator = REPLICATOR),
          (i.session_id = r),
          (i.last_seq = n),
          e.put(i).catch(function(i) {
            if (409 === i.status) return updateCheckpoint(e, t, n, r, o);
            throw i;
          })
        );
    });
}
function Checkpointer(e, t, n, r, o) {
  (this.src = e),
    (this.target = t),
    (this.id = n),
    (this.returnValue = r),
    (this.opts = o || {});
}
(Checkpointer.prototype.writeCheckpoint = function(e, t) {
  var n = this;
  return this.updateTarget(e, t).then(function() {
    return n.updateSource(e, t);
  });
}),
  (Checkpointer.prototype.updateTarget = function(e, t) {
    return this.opts.writeTargetCheckpoint
      ? updateCheckpoint(this.target, this.id, e, t, this.returnValue)
      : Promise.resolve(!0);
  }),
  (Checkpointer.prototype.updateSource = function(e, t) {
    if (this.opts.writeSourceCheckpoint) {
      var n = this;
      return updateCheckpoint(this.src, this.id, e, t, this.returnValue).catch(
        function(e) {
          if (isForbiddenError(e))
            return (n.opts.writeSourceCheckpoint = !1), !0;
          throw e;
        }
      );
    }
    return Promise.resolve(!0);
  });
var comparisons = {
  undefined: function(e, t) {
    return 0 === collate(e.last_seq, t.last_seq) ? t.last_seq : 0;
  },
  1: function(e, t) {
    return compareReplicationLogs(t, e).last_seq;
  }
};
function compareReplicationLogs(e, t) {
  return e.session_id === t.session_id
    ? { last_seq: e.last_seq, history: e.history }
    : compareReplicationHistory(e.history, t.history);
}
function compareReplicationHistory(e, t) {
  var n = e[0],
    r = e.slice(1),
    o = t[0],
    i = t.slice(1);
  return n && 0 !== t.length
    ? hasSessionId(n.session_id, t)
      ? { last_seq: n.last_seq, history: e }
      : hasSessionId(o.session_id, r)
      ? { last_seq: o.last_seq, history: i }
      : compareReplicationHistory(r, i)
    : { last_seq: LOWEST_SEQ, history: [] };
}
function hasSessionId(e, t) {
  var n = t[0],
    r = t.slice(1);
  return !(!e || 0 === t.length) && (e === n.session_id || hasSessionId(e, r));
}
function isForbiddenError(e) {
  return "number" == typeof e.status && 4 === Math.floor(e.status / 100);
}
Checkpointer.prototype.getCheckpoint = function() {
  var e = this;
  return e.opts && e.opts.writeSourceCheckpoint && !e.opts.writeTargetCheckpoint
    ? e.src
        .get(e.id)
        .then(function(e) {
          return e.last_seq || LOWEST_SEQ;
        })
        .catch(function(e) {
          if (404 !== e.status) throw e;
          return LOWEST_SEQ;
        })
    : e.target
        .get(e.id)
        .then(function(t) {
          return e.opts &&
            e.opts.writeTargetCheckpoint &&
            !e.opts.writeSourceCheckpoint
            ? t.last_seq || LOWEST_SEQ
            : e.src.get(e.id).then(
                function(e) {
                  return t.version !== e.version
                    ? LOWEST_SEQ
                    : (n = t.version ? t.version.toString() : "undefined") in
                      comparisons
                    ? comparisons[n](t, e)
                    : LOWEST_SEQ;
                  var n;
                },
                function(n) {
                  if (404 === n.status && t.last_seq)
                    return e.src.put({ _id: e.id, last_seq: LOWEST_SEQ }).then(
                      function() {
                        return LOWEST_SEQ;
                      },
                      function(n) {
                        return isForbiddenError(n)
                          ? ((e.opts.writeSourceCheckpoint = !1), t.last_seq)
                          : LOWEST_SEQ;
                      }
                    );
                  throw n;
                }
              );
        })
        .catch(function(e) {
          if (404 !== e.status) throw e;
          return LOWEST_SEQ;
        });
};
var STARTING_BACK_OFF = 0;
function backOff(e, t, n, r) {
  if (!1 === e.retry) return t.emit("error", n), void t.removeAllListeners();
  if (
    ("function" != typeof e.back_off_function &&
      (e.back_off_function = defaultBackOff),
    t.emit("requestError", n),
    "active" === t.state || "pending" === t.state)
  ) {
    t.emit("paused", n), (t.state = "stopped");
    var o = function() {
      e.current_back_off = STARTING_BACK_OFF;
    };
    t.once("paused", function() {
      t.removeListener("active", o);
    }),
      t.once("active", o);
  }
  (e.current_back_off = e.current_back_off || STARTING_BACK_OFF),
    (e.current_back_off = e.back_off_function(e.current_back_off)),
    setTimeout(r, e.current_back_off);
}
function sortObjectPropertiesByKey(e) {
  return Object.keys(e)
    .sort(collate)
    .reduce(function(t, n) {
      return (t[n] = e[n]), t;
    }, {});
}
function generateReplicationId(e, t, n) {
  var r = n.doc_ids ? n.doc_ids.sort(collate) : "",
    o = n.filter ? n.filter.toString() : "",
    i = "",
    a = "",
    c = "";
  return (
    n.selector && (c = JSON.stringify(n.selector)),
    n.filter &&
      n.query_params &&
      (i = JSON.stringify(sortObjectPropertiesByKey(n.query_params))),
    n.filter && "_view" === n.filter && (a = n.view.toString()),
    Promise.all([e.id(), t.id()])
      .then(function(e) {
        var t = e[0] + e[1] + o + a + i + r + c;
        return new Promise(function(e) {
          binaryMd5(t, e);
        });
      })
      .then(function(e) {
        return "_local/" + (e = e.replace(/\//g, ".").replace(/\+/g, "_"));
      })
  );
}
function replicate(e, t, n, r, o) {
  var i,
    a,
    c,
    s = [],
    u = { seq: 0, changes: [], docs: [] },
    l = !1,
    f = !1,
    d = !1,
    p = 0,
    h = n.continuous || n.live || !1,
    v = n.batch_size || 100,
    _ = n.batches_limit || 10,
    m = !1,
    g = n.doc_ids,
    y = n.selector,
    b = [],
    E = uuid();
  o = o || {
    ok: !0,
    start_time: new Date().toISOString(),
    docs_read: 0,
    docs_written: 0,
    doc_write_failures: 0,
    errors: []
  };
  var w = {};
  function k() {
    return c
      ? Promise.resolve()
      : generateReplicationId(e, t, n).then(function(o) {
          a = o;
          var i = {};
          (i =
            !1 === n.checkpoint
              ? { writeSourceCheckpoint: !1, writeTargetCheckpoint: !1 }
              : "source" === n.checkpoint
              ? { writeSourceCheckpoint: !0, writeTargetCheckpoint: !1 }
              : "target" === n.checkpoint
              ? { writeSourceCheckpoint: !1, writeTargetCheckpoint: !0 }
              : { writeSourceCheckpoint: !0, writeTargetCheckpoint: !0 }),
            (c = new Checkpointer(e, t, a, r, i));
        });
  }
  function S() {
    if (((b = []), 0 !== i.docs.length)) {
      var e = i.docs,
        a = { timeout: n.timeout };
      return t.bulkDocs({ docs: e, new_edits: !1 }, a).then(
        function(t) {
          if (r.cancelled) throw (T(), new Error("cancelled"));
          var n = Object.create(null);
          t.forEach(function(e) {
            e.error && (n[e.id] = e);
          });
          var i = Object.keys(n).length;
          (o.doc_write_failures += i),
            (o.docs_written += e.length - i),
            e.forEach(function(e) {
              var t = n[e._id];
              if (t) {
                o.errors.push(t);
                var i = (t.name || "").toLowerCase();
                if ("unauthorized" !== i && "forbidden" !== i) throw t;
                r.emit("denied", clone(t));
              } else b.push(e);
            });
        },
        function(t) {
          throw ((o.doc_write_failures += e.length), t);
        }
      );
    }
  }
  function D() {
    if (i.error) throw new Error("There was a problem getting docs.");
    o.last_seq = p = i.seq;
    var e = clone(o);
    return (
      b.length &&
        ((e.docs = b),
        "number" == typeof i.pending &&
          ((e.pending = i.pending), delete i.pending),
        r.emit("change", e)),
      (l = !0),
      c
        .writeCheckpoint(i.seq, E)
        .then(function() {
          if (((l = !1), r.cancelled)) throw (T(), new Error("cancelled"));
          (i = void 0), B();
        })
        .catch(function(e) {
          throw (x(e), e);
        })
    );
  }
  function O() {
    return getDocs(e, t, i.diffs, r).then(function(e) {
      (i.error = !e.ok),
        e.docs.forEach(function(e) {
          delete i.diffs[e._id], o.docs_read++, i.docs.push(e);
        });
    });
  }
  function A() {
    var e;
    r.cancelled ||
      i ||
      (0 !== s.length
        ? ((i = s.shift()),
          ((e = {}),
          i.changes.forEach(function(t) {
            "_user/" !== t.id &&
              (e[t.id] = t.changes.map(function(e) {
                return e.rev;
              }));
          }),
          t.revsDiff(e).then(function(e) {
            if (r.cancelled) throw (T(), new Error("cancelled"));
            i.diffs = e;
          }))
            .then(O)
            .then(S)
            .then(D)
            .then(A)
            .catch(function(e) {
              I("batch processing terminated with error", e);
            }))
        : C(!0));
  }
  function C(e) {
    0 !== u.changes.length
      ? (e || f || u.changes.length >= v) &&
        (s.push(u),
        (u = { seq: 0, changes: [], docs: [] }),
        ("pending" !== r.state && "stopped" !== r.state) ||
          ((r.state = "active"), r.emit("active")),
        A())
      : 0 !== s.length ||
        i ||
        (((h && w.live) || f) && ((r.state = "pending"), r.emit("paused")),
        f && T());
  }
  function I(e, t) {
    d ||
      (t.message || (t.message = e),
      (o.ok = !1),
      (o.status = "aborting"),
      (s = []),
      (u = { seq: 0, changes: [], docs: [] }),
      T(t));
  }
  function T(i) {
    if (!(d || (r.cancelled && ((o.status = "cancelled"), l))))
      if (
        ((o.status = o.status || "complete"),
        (o.end_time = new Date().toISOString()),
        (o.last_seq = p),
        (d = !0),
        i)
      ) {
        (i = createError(i)).result = o;
        var a = (i.name || "").toLowerCase();
        "unauthorized" === a || "forbidden" === a
          ? (r.emit("error", i), r.removeAllListeners())
          : backOff(n, r, i, function() {
              replicate(e, t, n, r);
            });
      } else r.emit("complete", o), r.removeAllListeners();
  }
  function P(e, t, o) {
    if (r.cancelled) return T();
    "number" == typeof t && (u.pending = t),
      filterChange(n)(e) &&
        ((u.seq = e.seq || o),
        u.changes.push(e),
        nextTick(function() {
          C(0 === s.length && w.live);
        }));
  }
  function q(e) {
    if (((m = !1), r.cancelled)) return T();
    if (e.results.length > 0)
      (w.since = e.results[e.results.length - 1].seq), B(), C(!0);
    else {
      var t = function() {
        h ? ((w.live = !0), B()) : (f = !0), C(!0);
      };
      i || 0 !== e.results.length
        ? t()
        : ((l = !0),
          c
            .writeCheckpoint(e.last_seq, E)
            .then(function() {
              (l = !1), (o.last_seq = p = e.last_seq), t();
            })
            .catch(x));
    }
  }
  function N(e) {
    if (((m = !1), r.cancelled)) return T();
    I("changes rejected", e);
  }
  function B() {
    if (!m && !f && s.length < _) {
      (m = !0),
        r._changes &&
          (r.removeListener("cancel", r._abortChanges), r._changes.cancel()),
        r.once("cancel", o);
      var t = e.changes(w).on("change", P);
      t.then(i, i),
        t.then(q).catch(N),
        n.retry && ((r._changes = t), (r._abortChanges = o));
    }
    function o() {
      t.cancel();
    }
    function i() {
      r.removeListener("cancel", o);
    }
  }
  function R() {
    k()
      .then(function() {
        if (!r.cancelled)
          return c.getCheckpoint().then(function(e) {
            (w = {
              since: (p = e),
              limit: v,
              batch_size: v,
              style: "all_docs",
              doc_ids: g,
              selector: y,
              return_docs: !0
            }),
              n.filter &&
                ("string" != typeof n.filter
                  ? (w.include_docs = !0)
                  : (w.filter = n.filter)),
              "heartbeat" in n && (w.heartbeat = n.heartbeat),
              "timeout" in n && (w.timeout = n.timeout),
              n.query_params && (w.query_params = n.query_params),
              n.view && (w.view = n.view),
              B();
          });
        T();
      })
      .catch(function(e) {
        I("getCheckpoint rejected with ", e);
      });
  }
  function x(e) {
    (l = !1), I("writeCheckpoint completed with error", e);
  }
  r.ready(e, t),
    r.cancelled
      ? T()
      : (r._addedListeners ||
          (r.once("cancel", T),
          "function" == typeof n.complete &&
            (r.once("error", n.complete),
            r.once("complete", function(e) {
              n.complete(null, e);
            })),
          (r._addedListeners = !0)),
        void 0 === n.since
          ? R()
          : k()
              .then(function() {
                return (l = !0), c.writeCheckpoint(n.since, E);
              })
              .then(function() {
                (l = !1), r.cancelled ? T() : ((p = n.since), R());
              })
              .catch(x));
}
function Replication() {
  events.EventEmitter.call(this),
    (this.cancelled = !1),
    (this.state = "pending");
  var e = this,
    t = new Promise(function(t, n) {
      e.once("complete", t), e.once("error", n);
    });
  (e.then = function(e, n) {
    return t.then(e, n);
  }),
    (e.catch = function(e) {
      return t.catch(e);
    }),
    e.catch(function() {});
}
function toPouch(e, t) {
  var n = t.PouchConstructor;
  return "string" == typeof e ? new n(e, t) : e;
}
function replicateWrapper(e, t, n, r) {
  if (
    ("function" == typeof n && ((r = n), (n = {})),
    void 0 === n && (n = {}),
    n.doc_ids && !Array.isArray(n.doc_ids))
  )
    throw createError(BAD_REQUEST, "`doc_ids` filter parameter is not a list.");
  (n.complete = r),
    ((n = clone(n)).continuous = n.continuous || n.live),
    (n.retry = "retry" in n && n.retry),
    (n.PouchConstructor = n.PouchConstructor || this);
  var o = new Replication(n);
  return replicate(toPouch(e, n), toPouch(t, n), n, o), o;
}
function sync(e, t, n, r) {
  return (
    "function" == typeof n && ((r = n), (n = {})),
    void 0 === n && (n = {}),
    ((n = clone(n)).PouchConstructor = n.PouchConstructor || this),
    new Sync((e = toPouch(e, n)), (t = toPouch(t, n)), n, r)
  );
}
function Sync(e, t, n, r) {
  var o = this;
  this.canceled = !1;
  var i = n.push ? $inject_Object_assign({}, n, n.push) : n,
    a = n.pull ? $inject_Object_assign({}, n, n.pull) : n;
  function c(e) {
    o.emit("change", { direction: "pull", change: e });
  }
  function s(e) {
    o.emit("change", { direction: "push", change: e });
  }
  function u(e) {
    o.emit("denied", { direction: "push", doc: e });
  }
  function l(e) {
    o.emit("denied", { direction: "pull", doc: e });
  }
  function f() {
    (o.pushPaused = !0), o.pullPaused && o.emit("paused");
  }
  function d() {
    (o.pullPaused = !0), o.pushPaused && o.emit("paused");
  }
  function p() {
    (o.pushPaused = !1),
      o.pullPaused && o.emit("active", { direction: "push" });
  }
  function h() {
    (o.pullPaused = !1),
      o.pushPaused && o.emit("active", { direction: "pull" });
  }
  (this.push = replicateWrapper(e, t, i)),
    (this.pull = replicateWrapper(t, e, a)),
    (this.pushPaused = !0),
    (this.pullPaused = !0);
  var v = {};
  function _(e) {
    return function(t, n) {
      (("change" === t && (n === c || n === s)) ||
        ("denied" === t && (n === l || n === u)) ||
        ("paused" === t && (n === d || n === f)) ||
        ("active" === t && (n === h || n === p))) &&
        (t in v || (v[t] = {}),
        (v[t][e] = !0),
        2 === Object.keys(v[t]).length && o.removeAllListeners(t));
    };
  }
  function m(e, t, n) {
    -1 == e.listeners(t).indexOf(n) && e.on(t, n);
  }
  n.live &&
    (this.push.on("complete", o.pull.cancel.bind(o.pull)),
    this.pull.on("complete", o.push.cancel.bind(o.push))),
    this.on("newListener", function(e) {
      "change" === e
        ? (m(o.pull, "change", c), m(o.push, "change", s))
        : "denied" === e
        ? (m(o.pull, "denied", l), m(o.push, "denied", u))
        : "active" === e
        ? (m(o.pull, "active", h), m(o.push, "active", p))
        : "paused" === e && (m(o.pull, "paused", d), m(o.push, "paused", f));
    }),
    this.on("removeListener", function(e) {
      "change" === e
        ? (o.pull.removeListener("change", c),
          o.push.removeListener("change", s))
        : "denied" === e
        ? (o.pull.removeListener("denied", l),
          o.push.removeListener("denied", u))
        : "active" === e
        ? (o.pull.removeListener("active", h),
          o.push.removeListener("active", p))
        : "paused" === e &&
          (o.pull.removeListener("paused", d),
          o.push.removeListener("paused", f));
    }),
    this.pull.on("removeListener", _("pull")),
    this.push.on("removeListener", _("push"));
  var g = Promise.all([this.push, this.pull]).then(
    function(e) {
      var t = { push: e[0], pull: e[1] };
      return o.emit("complete", t), r && r(null, t), o.removeAllListeners(), t;
    },
    function(e) {
      if (
        (o.cancel(), r ? r(e) : o.emit("error", e), o.removeAllListeners(), r)
      )
        throw e;
    }
  );
  (this.then = function(e, t) {
    return g.then(e, t);
  }),
    (this.catch = function(e) {
      return g.catch(e);
    });
}
function replication(e) {
  (e.replicate = replicateWrapper),
    (e.sync = sync),
    Object.defineProperty(e.prototype, "replicate", {
      get: function() {
        var e = this;
        return (
          void 0 === this.replicateMethods &&
            (this.replicateMethods = {
              from: function(t, n, r) {
                return e.constructor.replicate(t, e, n, r);
              },
              to: function(t, n, r) {
                return e.constructor.replicate(e, t, n, r);
              }
            }),
          this.replicateMethods
        );
      }
    }),
    (e.prototype.sync = function(e, t, n) {
      return this.constructor.sync(this, e, t, n);
    });
}
inherits(Replication, events.EventEmitter),
  (Replication.prototype.cancel = function() {
    (this.cancelled = !0), (this.state = "cancelled"), this.emit("cancel");
  }),
  (Replication.prototype.ready = function(e, t) {
    var n = this;
    function r() {
      n.cancel();
    }
    n._readyCalled ||
      ((n._readyCalled = !0),
      e.once("destroyed", r),
      t.once("destroyed", r),
      n.once("complete", function() {
        e.removeListener("destroyed", r), t.removeListener("destroyed", r);
      }));
  }),
  inherits(Sync, events.EventEmitter),
  (Sync.prototype.cancel = function() {
    this.canceled ||
      ((this.canceled = !0), this.push.cancel(), this.pull.cancel());
  }),
  PouchDB.plugin(LevelPouch$1)
    .plugin(HttpPouch$1)
    .plugin(mapreduce)
    .plugin(replication),
  (module.exports = PouchDB);
//# sourceMappingURL=/sm/571ea95d3f003b725c57a2fd02df32b62ddf22245e8159c710ead74255a27809.map
