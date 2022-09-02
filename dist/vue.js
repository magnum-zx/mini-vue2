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

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = []; // 收集当前属性对应的Watcher
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "depend",
      value: function depend() {
        // 去重
        // this.subs.push(Dep.target)
        // Dep.target 就是当前的Watcher实例， 需要将dep添加到当前Watcher上,同时让watcher也记住这个dep
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
    // 只针对对象劫持
    if (_typeof(data) !== 'object' || data === null) {
      return;
    } // 如果一个对象以及被劫持过了，就不需要再次劫持，通过添加__ob__判断


    return new Observer(data);
  }
  function defineReactive(target, key, value) {
    observe(value);
    var dep = new Dep(); // 每个属性都有一个dep

    Object.defineProperty(target, key, {
      get: function get() {
        // 依赖收集
        if (Dep.target) {
          dep.depend();
        }

        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue); // 如果newValue是个对象，需要再次劫持

        value = newValue;
        dep.notify();
      }
    });
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // Object.defineProperty只能劫持已存在的属性（因此需要增加api如 Vue.$set，Vue.$delete等）
      if (!data.hasOwnProperty('__ob__')) {
        // data.__ob__ = this
        Object.defineProperty(data, '__ob__', {
          value: this,
          enumerable: false
        });
      }

      if (Array.isArray(data)) ; else {
        this.walk(data); // 遍历属性
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 重写对象属性
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
    var data = vm.$options.data; // data可能是函数或者对象

    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data; // 将data挂载到vm上
    // 观测数据： 采用Object.defineProperty对数据进行劫持

    observe(data); // 将vm._data 用vm代理

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
  // 匹配属性
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 匹配标签名 <div

  var startTagClose = /^\s*(\/?)>/; // 匹配 <div> <div/>

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配 </div>
  function parseHTML(html) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = [];
    var currentParent; // 指向栈中最后一个

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
      var node = createASTElement(tag, attrs); // 创建一个ast节点

      if (!root) {
        // 如果当前树为空，则是树的根节点
        root = node;
      }

      if (currentParent) {
        node.parent = currentParent;
        currentParent.children.push(node);
      }

      stack.push(node);
      currentParent = node; // console.log(tag, attrs, '开始')
    }

    function chars(text) {
      // 文本直接放到当前指向的节点
      text = text.replace(/\s/g, '');
      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text
      }); // console.log(text, '文本')
    }

    function end(tag) {
      stack.pop(); // 弹出最后一个

      currentParent = stack[stack.length - 1]; // console.log(tag, '结束')
    } // 删除匹配的字符


    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          // 标签名
          attrs: []
        };
        advance(start[0].length); // 如果不是开始标签的结束，就一直匹配下去

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

      return false; // 不是开始标签
    }

    while (html) {
      // textEnd为0 说明是一个开始标签或者结束标签
      // textEnd>0 说明就是文本的结束位置
      var textEnd = html.indexOf('<'); // console.log('textEnd:', textEnd)
      // console.log(html)

      if (textEnd == 0) {
        var startTagMatch = parseStartTag(); // 开始标签的匹配

        var endTagMatch = html.match(endTag);

        if (startTagMatch) {
          // 解析到开始标签
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
        }
      } else if (textEnd > 0) {
        var text = html.substring(0, textEnd); // 文本内容

        if (text) {
          // 解析到文本
          chars(text);
          advance(text.length);
        }
      }
    }

    return root;
  }

  function compileToFunction(template) {
    var ast = parseHTML(template); // 1、将template 转化成 ast语法树
    // 2、生成render方法，render方法返回虚拟DOM

    console.log(ast); // render
  }

  // 做一些初始化操作
  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // vm.$options 就是获取用户的配置
      var vm = this;
      vm.$options = options; // 将用户的options 挂载到实例上
      // 初始化状态

      initState(vm);

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
          // 没有template 但是有 el
          template = el.outerHTML;
        } else if (el) {
          template = ops.template;
        }

        if (template) {
          var render = compileToFunction(template);
          ops.render = render;
        } // console.log(template)

      } // script 标签引用的vue.global.js 编译过程是在浏览器
      // runtime 不包含模板语法，整个编译是打包的时候通过loader转义.vue文件的

    };
  }

  // 打包入口文件

  function Vue(options) {
    this._init(options);
  }

  initMixin(Vue); // 扩展init方法

  return Vue;

}));
//# sourceMappingURL=vue.js.map
