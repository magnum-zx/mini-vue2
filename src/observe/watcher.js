import Dep from './dep'

// 当我们创建渲染watcher的时候会把当前的渲染Watcher放到dep.target上
// 调用_render函数会取值 -> 调用this.get()
let id = 0
class Watcher {
	// 不同组件有不同的Watcher, 第一个Watcher是渲染Watcher，用于渲染根实例
	constructor(vm, fn, options) {
		this.id = id++
		this.deps = [] // 实现计算属性、清理工作
		this.depsId = new Set()
		this.renderWatcher = options
		this.getter = fn // 调用这个函数会发生取值操作
		this.get()
	}
	addDep(dep) {
		let id = dep.id
		if (!this.depsId.has(id)) {
			this.deps.push(dep)
			this.depsId.add(id)
			dep.addSub(this) // dep也记住当前Watcher；
		}
	}
	get() {
		Dep.target = this
		this.getter() // 从vm上取值
		Dep.target = null
	}
	update() {
		console.log('update')
		this.get()
	}
}

// 一个组件（Watcher）有多少属性 就有多少dep,
// 一个属性（dep） 对应多个组件（Watcher）
export default Watcher
