// 做一些初始化操作
import { initState } from './state.js'
import { compileToFunction } from './compiler'
import { initLifeCycle, mountComponent } from './lifecycle.js'
export function initMixin(Vue) {
	Vue.prototype._init = function (options) {
		// vm.$options 就是获取用户的配置
		const vm = this
		vm.$options = options // 将用户的options 挂载到实例上

		// initLifeCycle(vm)
		// 初始化状态
		initState(vm)
		// initLifeCycle(vm)
		if (options.el) {
			vm.$mount(options.el)
		}
	}

	Vue.prototype.$mount = function (el) {
		const vm = this
		el = document.querySelector(el)
		let ops = vm.$options
		if (!ops.render) {
			let template
			if (!ops.template && el) {
				// 没有template 但是有 el
				template = el.outerHTML
			} else if (el) {
				template = ops.template
			}

			if (template) {
				const render = compileToFunction(template)
				ops.render = render
			}
			// console.log(template)
		}
		//组件挂载
		// console.log(ops.render)
		// script 标签引用的vue.global.js 编译过程是在浏览器
		// runtime 不包含模板语法，整个编译是打包的时候通过loader转义.vue文件的
		return mountComponent(vm, el)
	}
}
