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
        value = newValue;
      }
    });
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // Object.defineProperty只能劫持已存在的属性（因此需要增加api如 Vue.$set，Vue.$delete等）
      this.walk(data); // 遍历属性
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 重写对象属性
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observer;
  }();

  function initState(vm) {
    var opts = vm.$option;

    if (opts.data) {
      initData(vm);
    }
  }

  function initData(vm) {
    var data = vm.$option.data; // data可能是函数或者对象

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

  // 做一些初始化操作
  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // vm.$options 就是获取用户的配置
      var vm = this;
      vm.$option = options; // 将用户的options 挂载到实例上
      // 初始化状态

      initState(vm);
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
