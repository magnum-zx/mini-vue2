(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];

    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;

    var _s, _e;

    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  var id$1 = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id$1++;
      this.subs = []; // ???????????????????????????Watcher
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "depend",
      value: function depend() {
        // ??????
        // this.subs.push(Dep.target)
        // Dep.target ???????????????Watcher????????? ?????????dep???????????????Watcher???,?????????watcher???????????????dep
        Dep.target.addDep(this);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();

  Dep.target = null;

  function observe(data) {
    // ?????????????????????
    if (_typeof(data) !== 'object' || data === null) {
      return;
    } // ?????????????????????????????????????????????????????????????????????????????????__ob__??????


    return new Observer(data);
  }
  function defineReactive(target, key, value) {
    observe(value);
    var dep = new Dep(); // ????????????????????????dep

    Object.defineProperty(target, key, {
      get: function get() {
        // ????????????
        if (Dep.target) {
          dep.depend();
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue); // ??????newValue?????????????????????????????????

        value = newValue;
        dep.notify();
      }
    });
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // Object.defineProperty???????????????????????????????????????????????????api??? Vue.$set???Vue.$delete??????
      if (!data.hasOwnProperty('__ob__')) {
        // data.__ob__ = this
        Object.defineProperty(data, '__ob__', {
          value: this,
          enumerable: false
        });
      }

      if (Array.isArray(data)) ; else {
        this.walk(data); // ????????????
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // ??????????????????
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }, {
      key: "observeArray",
      value: function observeArray(data) {
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }]);

    return Observer;
  }();

  function initState(vm) {
    var opts = vm.$options;

    if (opts.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data; // data???????????????????????????

    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data; // ???data?????????vm???
    // ??????????????? ??????Object.defineProperty?????????????????????

    observe(data); // ???vm._data ???vm??????

    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        if (vm[target][key] === newValue) return;
        vm[target][key] = newValue;
      }
    });
  }

  // Regular Expressions for parsing tags and attributes
  // ????????????
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // ??????????????? <div

  var startTagClose = /^\s*(\/?)>/; // ?????? <div> <div/>

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // ?????? </div>
  function parseHTML(html) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = [];
    var currentParent; // ????????????????????????

    var root;

    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    function start(tag, attrs) {
      var node = createASTElement(tag, attrs); // ????????????ast??????

      if (!root) {
        // ?????????????????????????????????????????????
        root = node;
      }

      if (currentParent) {
        node.parent = currentParent;
        currentParent.children.push(node);
      }

      stack.push(node);
      currentParent = node; // console.log(tag, attrs, '??????')
    }

    function chars(text) {
      // ???????????????????????????????????????
      text = text.replace(/\s/g, '');
      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text
      }); // console.log(text, '??????')
    }

    function end(tag) {
      stack.pop(); // ??????????????????

      currentParent = stack[stack.length - 1]; // console.log(tag, '??????')
    } // ?????????????????????


    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          // ?????????
          attrs: []
        };
        advance(start[0].length); // ?????????????????????????????????????????????????????????

        var attr, _end;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
        }

        return match;
      }

      return false; // ??????????????????
    }

    while (html) {
      // textEnd???0 ?????????????????????????????????????????????
      // textEnd>0 ?????????????????????????????????
      var textEnd = html.indexOf('<'); // console.log('textEnd:', textEnd)
      // console.log(html)

      if (textEnd == 0) {
        var startTagMatch = parseStartTag(); // ?????????????????????

        var endTagMatch = html.match(endTag);

        if (startTagMatch) {
          // ?????????????????????
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      } else if (textEnd > 0) {
        var text = html.substring(0, textEnd); // ????????????

        if (text) {
          // ???????????????
          chars(text);
          advance(text.length);
        }
      }
    }

    return root;
  }

  function genProps(attrs) {
    var str = ''; // {name: value}

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{name}} ????????????????????????

  function gen(node) {
    if (node.type === 1) {
      //ELEMENT_TYPE
      return codegen(node);
    } else {
      // ??????
      var text = node.text;

      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        var tokens = [];
        var match;
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0;

        while (match = defaultTagRE.exec(text)) {
          var index = match.index;

          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index))); // console.log('lastIdx', lastIndex)
          }

          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length; // console.log(match)
        }

        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex).trim()));
        }

        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  function genChildren(children) {
    if (children) {
      return children.map(function (child) {
        return gen(child);
      }).join(',');
    }
  } // ????????????


  function codegen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "', ").concat(ast.attrs.length > 0 ? genProps(ast.attrs) : 'null').concat(ast.children.length > 0 ? ",".concat(children) : '', ")"); // console.log(code)

    return code;
  }

  function compileToFunction(template) {
    var ast = parseHTML(template); // 1??????template ????????? ast?????????
    // 2?????????render?????????render??????????????????DOM
    // console.log(ast)

    var code = codegen(ast); // console.log(code)
    // ?????????????????????????????????with + new Function

    code = "with(this){return ".concat(code, "}");
    var render = new Function(code); // ??????????????????render??????

    return render; // function render(
    // 	) {
    // 	with(this){return _c('div', {id:"app",style:{"color":" green"}},_c('div', {style:{"color":" red"}},_v(_s(name)+"Hello"+_s(height)+"hello")),_c('span', null,_v(_s(age))),_c('br', null))}
    // 	}
    // render.call(vm) -> this === vm
  } // let vm = {a:1}
  // with(vm){
  // 	console.log(a) // vm.a
  // }

  // ??????_render??????????????? -> ??????this.get()
  // ??????????????????????????????????????????????????????????????????????????? watcher??????????????????????????????????????????????????????????????????

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    // ????????????????????????Watcher, ?????????Watcher?????????Watcher????????????????????????
    function Watcher(vm, fn, options) {
      _classCallCheck(this, Watcher);

      this.id = id++;
      this.deps = []; // ?????????????????????????????????

      this.depsId = new Set();
      this.renderWatcher = options;
      this.getter = fn; // ???????????????????????????????????????

      this.get();
    }

    _createClass(Watcher, [{
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.deps.push(dep);
          this.depsId.add(id);
          dep.addSub(this); // dep???????????????Watcher???
        }
      }
    }, {
      key: "get",
      value: function get() {
        Dep.target = this;
        this.getter(); // ???vm?????????

        Dep.target = null;
      }
    }, {
      key: "update",
      value: function update() {
        queueWatcher(this); // ?????????watcher??????
        // this.get()
      }
    }, {
      key: "run",
      value: function run() {
        console.log('update');
        this.get();
      }
    }]);

    return Watcher;
  }();

  var queue = [];
  var has = {};
  var pending = false;

  function queueWatcher(watcher) {
    var id = watcher.id;

    if (!has[id]) {
      queue.push(watcher);
      has[id] = true;

      if (!pending) {
        setTimeout(function () {
          flushSchedulerQueue();
        }, 0);
        pending = true;
      }
    }
  }

  function flushSchedulerQueue() {
    var flushQueue = queue.slice(0);
    queue = [];
    has = {};
    pending = false;
    flushQueue.forEach(function (q) {
      return q.run();
    });
  }

  var callbacks = [];
  var waiting = false;

  function flushCallbacks() {
    var cbs = callbacks.slice(0);
    waiting = true;
    callbacks = [];
    cbs.forEach(function (cb) {
      return cb();
    });
  }

  var timerFn;

  if (Promise) {
    timerFn = function timerFn() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1);
    observer.observe(textNode, {
      characterData: true
    });

    timerFn = function timerFn() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFn = function timerFn() {
      setImmediate(flushCallbacks);
    };
  } else {
    timerFn = function timerFn() {
      setTimeout(flushCallbacks, 0);
    };
  }

  function nextTick(cb) {
    callbacks.push(cb);

    if (!waiting) {
      timerFn();
      waiting = true;
    }
  } // ???????????????Watcher?????????????????? ????????????dep,

  // h() _c()
  function createElementVNode(vm, tag, data) {
    if (data == null) {
      data = {};
    }

    var key = data.key;
    if (key) delete data.key;

    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }

    return vnode$1(vm, tag, key, data, children);
  } // _v()

  function createTextVNode(vm, text) {
    return vnode$1(vm, undefined, undefined, undefined, undefined, text);
  }

  function vnode$1(vm, tag, key, data, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      data: data,
      children: children,
      text: text
    };
  }

  function createElm(VNode) {
    var _vnode = vnode,
        tag = _vnode.tag,
        data = _vnode.data,
        children = _vnode.children,
        text = _vnode.text;

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      patchProps(vnode.el, data);
      children.forEach(function (child) {
        var childNode = createElm();
        vnode.el.appendChild(childNode);
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function patchProps(el, props) {
    for (var key in props) {
      if (key === 'style') {
        for (var styleName in props.style) {
          el.style[styleName] = props.style[styleName];
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }

  function patch(oldVNode, newVNode) {
    // ?????????
    var isRealElement = oldVNode.nodeType;

    if (isRealElement) {
      var elm = oldVNode; // ??????????????????

      elm.parentNode; // ???????????????

      var _newElm = createElm(vnode);

      parentNode.insertBefore(_newElm, elm.nextSibling);
      parentNode.removeChild(elm);
    }

    return newElm;
  }

  function initLifeCycle(Vue) {
    Vue.prototype._update = function (vnode) {
      console.log(this);
      var vm = this;
      var el = vm.$el;
      vm.$el = patch(el);
    }; // _c('div', {}, children)


    Vue.prototype._c = function () {
      return createElementVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._v = function () {
      return createTextVNode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };

    Vue.prototype._s = function (value) {
      if (_typeof(value) !== 'object') return value;
      return JSON.stringify(value);
    };

    Vue.prototype._render = function () {
      return this.$options.render.call(this);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el; // 1?????????render??????????????????DOM , ???update?????????DOM????????????DOM

    function updateComponent() {
      console.log(vm._render()); // vm._update(vm._render()) // vm.$options.render() ????????????DOM
    } // debugger


    new Watcher(vm, updateComponent, true); // ??????Watcher
    // 2???????????????DOM????????????DOM
    // 3????????????DOM?????????el?????????

    return vm;
  }

  // ????????????????????????
  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // vm.$options ???????????????????????????
      var vm = this;
      vm.$options = options; // ????????????options ??????????????????
      // initLifeCycle(vm)
      // ???????????????

      initState(vm); // initLifeCycle(vm)

      if (options.el) {
        vm.$mount(options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      el = document.querySelector(el);
      var ops = vm.$options;

      if (!ops.render) {
        var template;

        if (!ops.template && el) {
          // ??????template ????????? el
          template = el.outerHTML;
        } else if (el) {
          template = ops.template;
        }

        if (template) {
          var render = compileToFunction(template);
          ops.render = render;
        } // console.log(template)

      } //????????????
      // console.log(ops.render)
      // script ???????????????vue.global.js ???????????????????????????
      // runtime ????????????????????????????????????????????????????????????loader??????.vue?????????


      return mountComponent(vm, el);
    };
  }

  // ??????????????????

  function Vue(options) {
    this._init(options);
  }

  Vue.prototype.$nextTick = nextTick;
  initMixin(Vue); // ??????init??????

  initLifeCycle(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
