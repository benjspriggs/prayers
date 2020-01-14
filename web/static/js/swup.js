(function e(t, n) {
  if (typeof exports === "object" && typeof module === "object")
    module.exports = n();
  else if (typeof define === "function" && define.amd) define([], n);
  else if (typeof exports === "object") exports["Swup"] = n();
  else t["Swup"] = n();
})(window, function() {
  return (function(e) {
    var t = {};
    function n(r) {
      if (t[r]) {
        return t[r].exports;
      }
      var o = (t[r] = { i: r, l: false, exports: {} });
      e[r].call(o.exports, o, o.exports, n);
      o.l = true;
      return o.exports;
    }
    n.m = e;
    n.c = t;
    n.d = function(e, t, r) {
      if (!n.o(e, t)) {
        Object.defineProperty(e, t, { enumerable: true, get: r });
      }
    };
    n.r = function(e) {
      if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
        Object.defineProperty(e, Symbol.toStringTag, { value: "Module" });
      }
      Object.defineProperty(e, "__esModule", { value: true });
    };
    n.t = function(e, t) {
      if (t & 1) e = n(e);
      if (t & 8) return e;
      if (t & 4 && typeof e === "object" && e && e.__esModule) return e;
      var r = Object.create(null);
      n.r(r);
      Object.defineProperty(r, "default", { enumerable: true, value: e });
      if (t & 2 && typeof e != "string")
        for (var o in e)
          n.d(
            r,
            o,
            function(t) {
              return e[t];
            }.bind(null, o)
          );
      return r;
    };
    n.n = function(e) {
      var t =
        e && e.__esModule
          ? function t() {
              return e["default"];
            }
          : function t() {
              return e;
            };
      n.d(t, "a", t);
      return t;
    };
    n.o = function(e, t) {
      return Object.prototype.hasOwnProperty.call(e, t);
    };
    n.p = "";
    return n((n.s = 1));
  })([
    function(e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      var r = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || false;
            r.configurable = true;
            if ("value" in r) r.writable = true;
            Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          if (n) e(t.prototype, n);
          if (r) e(t, r);
          return t;
        };
      })();
      function o(e, t) {
        if (!(e instanceof t)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      var i = (function() {
        function e() {
          o(this, e);
          this.link = document.createElement("a");
        }
        r(e, [
          {
            key: "setPath",
            value: function e(t) {
              this.link.href = t;
            }
          },
          {
            key: "getPath",
            value: function e() {
              var t = this.link.pathname;
              if (t[0] != "/") {
                t = "/" + t;
              }
              return t;
            }
          },
          {
            key: "getAddress",
            value: function e() {
              var t = this.link.pathname + this.link.search;
              if (t[0] != "/") {
                t = "/" + t;
              }
              return t;
            }
          },
          {
            key: "getHash",
            value: function e() {
              return this.link.hash;
            }
          }
        ]);
        return e;
      })();
      t.default = i;
    },
    function(e, t, n) {
      "use strict";
      var r = n(2);
      var o = i(r);
      function i(e) {
        return e && e.__esModule ? e : { default: e };
      }
      e.exports = o.default;
    },
    function(e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      var r =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) {
              if (Object.prototype.hasOwnProperty.call(n, r)) {
                e[r] = n[r];
              }
            }
          }
          return e;
        };
      var o = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || false;
            r.configurable = true;
            if ("value" in r) r.writable = true;
            Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          if (n) e(t.prototype, n);
          if (r) e(t, r);
          return t;
        };
      })();
      var i = n(3);
      var s = z(i);
      var a = n(5);
      var l = z(a);
      var u = n(0);
      var c = z(u);
      var d = n(6);
      var f = z(d);
      var h = n(7);
      var p = z(h);
      var g = n(8);
      var m = z(g);
      var v = n(9);
      var w = z(v);
      var y = n(10);
      var E = z(y);
      var b = n(11);
      var P = z(b);
      var S = n(12);
      var T = z(S);
      var k = n(13);
      var L = z(k);
      var x = n(14);
      var A = z(x);
      var C = n(15);
      var H = z(C);
      var M = n(16);
      var O = z(M);
      var j = n(17);
      var R = z(j);
      var _ = n(18);
      var q = z(_);
      var U = n(19);
      var D = z(U);
      var F = n(20);
      var I = z(F);
      var N = n(21);
      var B = z(N);
      var K = n(22);
      var W = z(K);
      function z(e) {
        return e && e.__esModule ? e : { default: e };
      }
      function V(e, t) {
        if (!(e instanceof t)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      var X = (function() {
        function e(t) {
          V(this, e);
          var n = {
            cache: true,
            animationSelector: '[class*="transition-"]',
            elements: ["#swup"],
            pageClassPrefix: "",
            debugMode: false,
            scroll: true,
            doScrollingRightAway: false,
            animateScroll: true,
            scrollFriction: 0.3,
            scrollAcceleration: 0.04,
            preload: true,
            support: true,
            plugins: [],
            skipPopStateHandling: function e(t) {
              if (t.state && t.state.source == "swup") {
                return false;
              }
              return true;
            },
            LINK_SELECTOR:
              'a[href^="' +
              window.location.origin +
              '"]:not([data-no-swup]), a[href^="/"]:not([data-no-swup]), a[href^="#"]:not([data-no-swup])',
            FORM_SELECTOR: "form[data-swup-form]"
          };
          this.transition = {};
          var o = r({}, n, t);
          this.mobile = false;
          this.scrollToElement = null;
          this.preloadPromise = null;
          this.options = o;
          this.plugins = [];
          this.getUrl = A.default;
          this.cache = new l.default();
          this.link = new c.default();
          this.transitionEndEvent = (0, f.default)();
          this.getDataFromHtml = m.default;
          this.getPage = p.default;
          this.scrollTo = H.default;
          this.loadPage = w.default;
          this.renderPage = E.default;
          this.goBack = P.default;
          this.createState = T.default;
          this.triggerEvent = L.default;
          this.classify = O.default;
          this.doScrolling = R.default;
          this.markSwupElements = q.default;
          this.updateTransition = D.default;
          this.preloadPages = I.default;
          this.usePlugin = B.default;
          this.log = W.default;
          this.enable = this.enable;
          this.destroy = this.destroy;
          if (window.innerWidth <= 767) {
            this.mobile = true;
          }
          if (this.options.debugMode) {
            window.swup = this;
          }
          this.getUrl();
          this.enable();
        }
        o(e, [
          {
            key: "enable",
            value: function e() {
              var t = this;
              if (this.options.support) {
                if (!("pushState" in window.history)) {
                  console.warn("pushState is not supported");
                  return;
                }
                if ((0, f.default)()) {
                  this.transitionEndEvent = (0, f.default)();
                } else {
                  console.warn("transitionEnd detection is not supported");
                  return;
                }
                if (
                  typeof Promise === "undefined" ||
                  Promise.toString().indexOf("[native code]") === -1
                ) {
                  console.warn("Promise is not supported");
                  return;
                }
              }
              this.delegatedListeners = {};
              this.delegatedListeners.click = (0, s.default)(
                document,
                this.options.LINK_SELECTOR,
                "click",
                this.linkClickHandler.bind(this)
              );
              this.delegatedListeners.mouseover = (0, s.default)(
                document.body,
                this.options.LINK_SELECTOR,
                "mouseover",
                this.linkMouseoverHandler.bind(this)
              );
              this.delegatedListeners.formSubmit = (0, s.default)(
                document,
                this.options.FORM_SELECTOR,
                "submit",
                this.formSubmitHandler.bind(this)
              );
              window.addEventListener(
                "popstate",
                this.popStateHandler.bind(this)
              );
              var n = this.getDataFromHtml(document.documentElement.outerHTML);
              n.url = this.currentUrl;
              if (this.options.cache) {
                this.cache.cacheUrl(n, this.options.debugMode);
              }
              this.markSwupElements(document.documentElement);
              this.options.plugins.forEach(function(e) {
                return t.usePlugin(e);
              });
              window.history.replaceState(
                Object.assign({}, window.history.state, {
                  url: window.location.href,
                  random: Math.random(),
                  source: "swup"
                }),
                document.title,
                window.location.href
              );
              this.triggerEvent("enabled");
              document.documentElement.classList.add("swup-enabled");
              this.triggerEvent("pageView");
              this.preloadPages();
            }
          },
          {
            key: "destroy",
            value: function e() {
              this.delegatedListeners.click.destroy();
              this.delegatedListeners.mouseover.destroy();
              window.removeEventListener(
                "popstate",
                this.popStateHandler.bind(this)
              );
              this.cache.empty();
              document.querySelectorAll("[data-swup]").forEach(function(e) {
                delete e.dataset.swup;
              });
              this.triggerEvent("disabled");
              document.documentElement.classList.remove("swup-enabled");
            }
          },
          {
            key: "linkClickHandler",
            value: function e(t) {
              if (!t.metaKey) {
                this.triggerEvent("clickLink");
                var n = new c.default();
                t.preventDefault();
                n.setPath(t.delegateTarget.href);
                if (n.getAddress() == this.currentUrl || n.getAddress() == "") {
                  if (n.getHash() != "") {
                    this.triggerEvent("samePageWithHash");
                    var r = document.querySelector(n.getHash());
                    if (r != null) {
                      if (this.options.scroll) {
                        var o =
                          r.getBoundingClientRect().top + window.pageYOffset;
                        this.scrollTo(document.body, o);
                      }
                      history.replaceState(undefined, undefined, n.getHash());
                    } else {
                      console.warn(
                        "Element for offset not found (" + n.getHash() + ")"
                      );
                    }
                  } else {
                    this.triggerEvent("samePage");
                    if (this.options.scroll) {
                      this.scrollTo(document.body, 0, 1);
                    }
                  }
                } else {
                  if (n.getHash() != "") {
                    this.scrollToElement = n.getHash();
                  }
                  var i = t.delegateTarget.dataset.swupClass;
                  if (i != null) {
                    this.updateTransition(
                      window.location.pathname,
                      n.getAddress(),
                      t.delegateTarget.dataset.swupClass
                    );
                    document.documentElement.classList.add("to-" + i);
                  } else {
                    this.updateTransition(
                      window.location.pathname,
                      n.getAddress()
                    );
                  }
                  this.loadPage({ url: n.getAddress() }, false);
                }
              } else {
                this.triggerEvent("openPageInNewTab");
              }
            }
          },
          {
            key: "linkMouseoverHandler",
            value: function e(t) {
              var n = this;
              this.triggerEvent("hoverLink");
              if (this.options.preload) {
                var r = new c.default();
                r.setPath(t.delegateTarget.href);
                if (
                  r.getAddress() != this.currentUrl &&
                  !this.cache.exists(r.getAddress()) &&
                  this.preloadPromise == null
                ) {
                  this.preloadPromise = new Promise(function(e, t) {
                    n.getPage({ url: r.getAddress() }, function(o, i) {
                      if (i.status === 500) {
                        n.triggerEvent("serverError");
                        t(r.getAddress());
                        return;
                      } else {
                        var s = n.getDataFromHtml(o);
                        if (s != null) {
                          s.url = r.getAddress();
                          n.cache.cacheUrl(s, n.options.debugMode);
                          n.triggerEvent("pagePreloaded");
                        } else {
                          t(r.getAddress());
                          return;
                        }
                      }
                      e();
                      n.preloadPromise = null;
                    });
                  });
                  this.preloadPromise.route = r.getAddress();
                }
              }
            }
          },
          {
            key: "formSubmitHandler",
            value: function e(t) {
              if (!t.metaKey) {
                this.triggerEvent("submitForm");
                t.preventDefault();
                var n = t.target;
                var r = new FormData(n);
                var o = new c.default();
                o.setPath(n.action);
                if (o.getHash() != "") {
                  this.scrollToElement = o.getHash();
                }
                if (n.method.toLowerCase() != "get") {
                  this.cache.remove(o.getAddress());
                  this.loadPage({
                    url: o.getAddress(),
                    method: n.method,
                    data: r
                  });
                } else {
                  var i = o.getAddress() || window.location.href;
                  var s = n.querySelectorAll("input");
                  if (i.indexOf("?") == -1) {
                    i += "?";
                  } else {
                    i += "&";
                  }
                  s.forEach(function(e) {
                    if (e.type == "checkbox" || e.type == "radio") {
                      if (e.checked) {
                        i +=
                          encodeURIComponent(e.name) +
                          "=" +
                          encodeURIComponent(e.value) +
                          "&";
                      }
                    } else {
                      i +=
                        encodeURIComponent(e.name) +
                        "=" +
                        encodeURIComponent(e.value) +
                        "&";
                    }
                  });
                  i = i.slice(0, -1);
                  this.cache.remove(i);
                  this.loadPage({ url: i });
                }
              } else {
                this.triggerEvent("openFormSubmitInNewTab");
              }
            }
          },
          {
            key: "popStateHandler",
            value: function e(t) {
              var n = new c.default();
              if (this.options.skipPopStateHandling(t)) return;
              n.setPath(t.state ? t.state.url : window.location.pathname);
              if (n.getHash() != "") {
                this.scrollToElement = n.getHash();
              } else {
                t.preventDefault();
              }
              this.triggerEvent("popState");
              this.loadPage({ url: n.getAddress() }, t);
            }
          }
        ]);
        return e;
      })();
      t.default = X;
    },
    function(e, t, n) {
      var r = n(4);
      function o(e, t, n, r, o) {
        var i = s.apply(this, arguments);
        e.addEventListener(n, i, o);
        return {
          destroy: function() {
            e.removeEventListener(n, i, o);
          }
        };
      }
      function i(e, t, n, r, i) {
        if (typeof e.addEventListener === "function") {
          return o.apply(null, arguments);
        }
        if (typeof n === "function") {
          return o.bind(null, document).apply(null, arguments);
        }
        if (typeof e === "string") {
          e = document.querySelectorAll(e);
        }
        return Array.prototype.map.call(e, function(e) {
          return o(e, t, n, r, i);
        });
      }
      function s(e, t, n, o) {
        return function(n) {
          n.delegateTarget = r(n.target, t);
          if (n.delegateTarget) {
            o.call(e, n);
          }
        };
      }
      e.exports = i;
    },
    function(e, t) {
      var n = 9;
      if (typeof Element !== "undefined" && !Element.prototype.matches) {
        var r = Element.prototype;
        r.matches =
          r.matchesSelector ||
          r.mozMatchesSelector ||
          r.msMatchesSelector ||
          r.oMatchesSelector ||
          r.webkitMatchesSelector;
      }
      function o(e, t) {
        while (e && e.nodeType !== n) {
          if (typeof e.matches === "function" && e.matches(t)) {
            return e;
          }
          e = e.parentNode;
        }
      }
      e.exports = o;
    },
    function(e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: true });
      var r = (function() {
        function e(e, t) {
          for (var n = 0; n < t.length; n++) {
            var r = t[n];
            r.enumerable = r.enumerable || false;
            r.configurable = true;
            if ("value" in r) r.writable = true;
            Object.defineProperty(e, r.key, r);
          }
        }
        return function(t, n, r) {
          if (n) e(t.prototype, n);
          if (r) e(t, r);
          return t;
        };
      })();
      function o(e, t) {
        if (!(e instanceof t)) {
          throw new TypeError("Cannot call a class as a function");
        }
      }
      var i = (function() {
        function e() {
          o(this, e);
          this.pages = {};
          this.count = 0;
          this.last = null;
        }
        r(e, [
          {
            key: "cacheUrl",
            value: function e(t, n) {
              this.count++;
              if (t.url in this.pages === false) {
                this.pages[t.url] = t;
              }
              this.last = this.pages[t.url];
              if (n) {
                this.displayCache();
              }
            }
          },
          {
            key: "getPage",
            value: function e(t) {
              return this.pages[t];
            }
          },
          {
            key: "displayCache",
            value: function e() {
              console.groupCollapsed(
                "Cache (" + Object.keys(this.pages).length + ")"
              );
              for (var t in this.pages) {
                console.log(this.pages[t]);
              }
              console.groupEnd();
            }
          },
          {
            key: "exists",
            value: function e(t) {
              if (t in this.pages) return true;
              return false;
            }
          },
          {
            key: "empty",
            value: function e(t) {
              this.pages = {};
              this.count = 0;
              this.last = null;
              if (t) {
                console.log("Cache cleared");
              }
            }
          },
          {
            key: "remove",
            value: function e(t) {
              delete this.pages[t];
            }
          }
        ]);
        return e;
      })();
      t.default = i;
    },
    function(e, t, n) {
      "use strict";
      e.exports = function e() {
        var t = document.createElement("div");
        var n = {
          WebkitTransition: "webkitTransitionEnd",
          MozTransition: "transitionend",
          OTransition: "oTransitionEnd otransitionend",
          transition: "transitionend"
        };
        for (var r in n) {
          if (t.style[r] !== undefined) {
            return n[r];
          }
        }
        return false;
      };
    },
    function(e, t, n) {
      "use strict";
      var r =
        Object.assign ||
        function(e) {
          for (var t = 1; t < arguments.length; t++) {
            var n = arguments[t];
            for (var r in n) {
              if (Object.prototype.hasOwnProperty.call(n, r)) {
                e[r] = n[r];
              }
            }
          }
          return e;
        };
      e.exports = function(e) {
        var t =
          arguments.length > 1 && arguments[1] !== undefined
            ? arguments[1]
            : false;
        var n = {
          url: window.location.pathname + window.location.search,
          method: "GET",
          data: null
        };
        var o = r({}, n, e);
        var i = new XMLHttpRequest();
        i.onreadystatechange = function() {
          if (i.readyState === 4) {
            if (i.status !== 500) {
              t(i.responseText, i);
            } else {
              t(null, i);
            }
          }
        };
        i.open(o.method, o.url, true);
        i.setRequestHeader("X-Requested-With", "swup");
        i.send(o.data);
        return i;
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function(e) {
        var t = this;
        var n = e
          .replace("<body", '<div id="swupBody"')
          .replace("</body>", "</div>");
        var r = document.createElement("div");
        r.innerHTML = n;
        var o = [];
        for (var i = 0; i < this.options.elements.length; i++) {
          if (r.querySelector(this.options.elements[i]) == null) {
            console.warn(
              "Element " +
                this.options.elements[i] +
                " is not found in cached page."
            );
            return null;
          } else {
            [].forEach.call(
              document.body.querySelectorAll(this.options.elements[i]),
              function(e, n) {
                r.querySelectorAll(t.options.elements[i])[n].dataset.swup =
                  o.length;
                o.push(r.querySelectorAll(t.options.elements[i])[n].outerHTML);
              }
            );
          }
        }
        var s = {
          title: r.querySelector("title").innerText,
          pageClass: r.querySelector("#swupBody").className,
          originalContent: e,
          blocks: o
        };
        return s;
      };
    },
    function(e, t, n) {
      "use strict";
      var r = Array.prototype.forEach;
      e.exports = function(e, t) {
        var n = this;
        var o = null;
        if (this.options.doScrollingRightAway && !this.scrollToElement) {
          this.doScrolling(t);
        }
        var i = [];
        if (!t) {
          document.documentElement.classList.add("is-changing");
          document.documentElement.classList.add("is-leaving");
          document.documentElement.classList.add("is-animating");
          document.documentElement.classList.add("to-" + this.classify(e.url));
          var s = document.querySelectorAll(this.options.animationSelector);
          r.call(s, function(e) {
            var t = new Promise(function(t) {
              e.addEventListener(n.transitionEndEvent, function(n) {
                if (e == n.target) {
                  t();
                }
              });
            });
            i.push(t);
          });
          Promise.all(i).then(function() {
            n.triggerEvent("animationOutDone");
          });
          if (this.scrollToElement != null) {
            var a = e.url + this.scrollToElement;
          } else {
            var a = e.url;
          }
          this.createState(a);
        } else {
          this.triggerEvent("animationSkipped");
        }
        if (this.cache.exists(e.url)) {
          var l = new Promise(function(e) {
            e();
          });
          this.triggerEvent("pageRetrievedFromCache");
        } else {
          if (!this.preloadPromise || this.preloadPromise.route != e.url) {
            var l = new Promise(function(t, r) {
              n.getPage(e, function(o, i) {
                if (i.status === 500) {
                  n.triggerEvent("serverError");
                  r(e.url);
                  return;
                } else {
                  var s = n.getDataFromHtml(o);
                  if (s != null) {
                    s.url = e.url;
                  } else {
                    r(e.url);
                    return;
                  }
                  n.cache.cacheUrl(s, n.options.debugMode);
                  n.triggerEvent("pageLoaded");
                }
                t();
              });
            });
          } else {
            var l = this.preloadPromise;
          }
        }
        Promise.all(i.concat([l]))
          .then(function() {
            o = n.cache.getPage(e.url);
            n.renderPage(o, t);
            n.preloadPromise = null;
          })
          .catch(function(e) {
            n.options.skipPopStateHandling = function() {
              window.location = e;
              return true;
            };
            window.history.go(-1);
          });
      };
    },
    function(e, t, n) {
      "use strict";
      var r = Array.prototype.forEach;
      e.exports = function(e, t) {
        var n = this;
        document.documentElement.classList.remove("is-leaving");
        if (!t) {
          document.documentElement.classList.add("is-rendering");
        }
        this.triggerEvent("willReplaceContent");
        for (var o = 0; o < e.blocks.length; o++) {
          document.body.querySelector('[data-swup="' + o + '"]').outerHTML =
            e.blocks[o];
        }
        document.title = e.title;
        this.triggerEvent("contentReplaced");
        this.triggerEvent("pageView");
        if (!this.options.cache) {
          this.cache.empty(this.options.debugMode);
        }
        setTimeout(function() {
          document.documentElement.classList.remove("is-animating");
        }, 10);
        if (this.options.pageClassPrefix !== false) {
          document.body.className.split(" ").forEach(function(e) {
            if (e != "" && e.includes(n.options.pageClassPrefix)) {
              document.body.classList.remove(e);
            }
          });
        }
        if (e.pageClass != "") {
          e.pageClass.split(" ").forEach(function(e) {
            if (e != "" && e.includes(n.options.pageClassPrefix)) {
              document.body.classList.add(e);
            }
          });
        }
        if (!this.options.doScrollingRightAway || this.scrollToElement) {
          this.doScrolling(t);
        }
        var i = document.querySelectorAll(this.options.animationSelector);
        var s = [];
        r.call(i, function(e) {
          var t = new Promise(function(t) {
            e.addEventListener(n.transitionEndEvent, function(n) {
              if (e == n.target) {
                t();
              }
            });
          });
          s.push(t);
        });
        this.preloadPages();
        Promise.all(s).then(function() {
          n.triggerEvent("animationInDone");
          document.documentElement.className.split(" ").forEach(function(e) {
            if (
              new RegExp("^to-").test(e) ||
              e === "is-changing" ||
              e === "is-rendering"
            ) {
              document.documentElement.classList.remove(e);
            }
          });
        });
        this.getUrl();
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function(e, t) {
        setTimeout(function() {
          document.body.classList.remove("is-changing");
          history.back();
        }, 100);
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function(e) {
        window.history.pushState(
          {
            url: e || window.location.href.split(window.location.hostname)[1],
            random: Math.random(),
            source: "swup"
          },
          document.getElementsByTagName("title")[0].innerText,
          e || window.location.href.split(window.location.hostname)[1]
        );
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function(e) {
        if (this.options.debugMode) {
          console.log("%cswup:" + "%c" + e, "color: #343434", "color: #009ACD");
        }
        var t = new CustomEvent("swup:" + e, { detail: e });
        document.dispatchEvent(t);
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function() {
        this.currentUrl = window.location.pathname + window.location.search;
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function(e, t) {
        var n = this;
        var r =
          arguments.length > 2 && arguments[2] !== undefined
            ? arguments[2]
            : this.options.animateScroll;
        var o = 1 - this.options.scrollFriction;
        var i = this.options.scrollAcceleration;
        var s = 0;
        var a = 0;
        var l = 0;
        var u = 0;
        var c = 0;
        var d = null;
        function f() {
          return document.body.scrollTop || document.documentElement.scrollTop;
        }
        var h = function e() {
          var t = p();
          m();
          if ((c === 1 && l > s) || (c === -1 && l < s)) {
            d = requestAnimationFrame(e);
          } else {
            window.scrollTo(0, l);
            n.triggerEvent("scrollDone");
          }
        };
        function p() {
          var e = u - s;
          var t = e * i;
          g(t);
          a *= o;
          s += a;
          return e;
        }
        var g = function e(t) {
          a += t;
        };
        var m = function e() {
          window.scrollTo(0, s);
        };
        window.addEventListener(
          "mousewheel",
          function(e) {
            if (d) {
              cancelAnimationFrame(d);
              d = null;
            }
          },
          { passive: true }
        );
        var v = function e(t, r) {
          s = f();
          c = s > t ? -1 : 1;
          u = t + c;
          l = t;
          a = 0;
          if (s != l) {
            h();
          } else {
            n.triggerEvent("scrollDone");
          }
        };
        this.triggerEvent("scrollStart");
        if (r == 0) {
          window.scrollTo(0, t);
          this.triggerEvent("scrollDone");
        } else {
          v(t);
        }
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function(e) {
        var t = e
          .toString()
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/\//g, "-")
          .replace(/[^\w\-]+/g, "")
          .replace(/\-\-+/g, "-")
          .replace(/^-+/, "")
          .replace(/-+$/, "");
        if (t[0] == "/") t = t.splice(1);
        if (t == "") t = "homepage";
        return t;
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function(e) {
        if (this.options.scroll && !e) {
          if (this.scrollToElement != null) {
            var t = this;
            var n = document.querySelector(t.scrollToElement);
            if (n != null) {
              var r = n.getBoundingClientRect().top + window.pageYOffset;
              t.scrollTo(document.body, r);
            } else {
              console.warn(
                "Element for offset not found (" + t.scrollToElement + ")"
              );
            }
            t.scrollToElement = null;
          } else {
            this.scrollTo(document.body, 0);
          }
        }
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function(e) {
        var t = this;
        var n = 0;
        for (var r = 0; r < this.options.elements.length; r++) {
          if (e.querySelector(this.options.elements[r]) == null) {
            console.warn(
              "Element " + this.options.elements[r] + " is not in current page."
            );
          } else {
            [].forEach.call(
              document.body.querySelectorAll(this.options.elements[r]),
              function(o, i) {
                e.querySelectorAll(t.options.elements[r])[i].dataset.swup = n;
                n++;
              }
            );
          }
        }
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function(e, t, n) {
        if (e == "/") {
          e = "/homepage";
        }
        if (t == "/") {
          t = "/homepage";
        }
        this.transition = { from: e.replace("/", ""), to: t.replace("/", "") };
        if (n) {
          this.transition.custom = n;
        }
      };
    },
    function(e, t, n) {
      "use strict";
      var r = n(0);
      var o = i(r);
      function i(e) {
        return e && e.__esModule ? e : { default: e };
      }
      e.exports = function(e) {
        var t = this;
        if (this.options.preload) {
          var n = function e(n) {
            var r = new o.default();
            r.setPath(n);
            if (
              r.getAddress() != t.currentUrl &&
              !t.cache.exists(r.getAddress()) &&
              t.preloadPromise == null
            ) {
              t.getPage({ url: r.getAddress() }, function(e) {
                if (e === null) {
                  console.warn("Server error.");
                  t.triggerEvent("serverError");
                } else {
                  var n = t.getDataFromHtml(e);
                  n.url = r.getAddress();
                  t.cache.cacheUrl(n, t.options.debugMode);
                  t.triggerEvent("pagePreloaded");
                }
              });
            }
          };
          document.querySelectorAll("[data-swup-preload]").forEach(function(e) {
            n(e.href);
          });
        }
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function(e, t) {
        var n = this;
        t = Object.assign({}, e.options, t);
        e.options = t;
        var r = function e() {
          var t = n.cache.getPage(
            window.location.pathname + window.location.search
          );
          var r = document.createElement("html");
          r.innerHTML = t.originalContent;
          return r;
        };
        this.plugins.push(e);
        e.exec(t, this, r);
        return this.plugins;
      };
    },
    function(e, t, n) {
      "use strict";
      e.exports = function(e) {
        if (this.options.debugMode) {
          console.log(e + "%c", "color: #009ACD");
        }
      };
    }
  ]);
});
