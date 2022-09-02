import Watcher from './observe/watcher'

export function mountComponent(vm, el) {
	vm.$el = el
	// 1、调用render方法产生虚拟DOM
	function updateComponent() {
		vm._update(vm._render()) // vm.$options.render() 返回虚拟DOM
	}
	new Watcher(vm, updateComponent, true) // 渲染Watcher
	// 2、根据虚拟DOM生成真实DOM

	// 3、将真实DOM挂载到el元素上
}
