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

  function observe(data) {
    // 只针对对象劫持
    if (_typeof(data) !== 'object' || data === null) {
      return;
    } // 如果一个对象以及被劫持过了，就不需要再次劫持，通过添加__ob__判断


    return new Observer(data);
  }
  function defineReactive(target, key, value) {
    observe(value);
    Object.defineProperty(target, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue); // 如果newValue是个对象，需要再次劫持

        value = newValue;
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

  function compileToFunction(template) {
    console.log(template);
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
