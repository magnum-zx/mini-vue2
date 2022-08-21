// 做一些初始化操作
import { initState } from './state.js'
export function initMixin(Vue) {
	Vue.prototype._init = function (options) {
		// vm.$options 就是获取用户的配置
		const vm = this
		vm.$option = options // 将用户的options 挂载到实例上

		// 初始化状态
		initState(vm)
	}
}
