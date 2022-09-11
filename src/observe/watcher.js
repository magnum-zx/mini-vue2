import Dep from './dep'

// 当我们创建渲染watcher的时候会把当前的渲染Watcher放到dep.target上
// 调用_render函数会取值 -> 调用this.get()

// 每个属性（被观察者）会收集观察他的对象（观察者）， watcher就是观察者（属性变化之后，通知观察者来更新）
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
		queueWatcher(this) // 把当前watcher暂存
		// this.get()
	}
	run() {
		console.log('update')
		this.get()
	}
}
let queue = []
let has = {}
let pending = false

function queueWatcher(watcher) {
	const id = watcher.id
	if (!has[id]) {
		queue.push(watcher)
		has[id] = true

		if (!pending) {
			setTimeout(() => {
				flushSchedulerQueue()
			}, 0)
			pending = true
		}
	}
}

function flushSchedulerQueue() {
	let flushQueue = queue.slice(0)
	queue = []
	has = {}
	pending = false
	flushQueue.forEach((q) => q.run())
}

let callbacks = []
let waiting = false
function flushCallbacks() {
	let cbs = callbacks.slice(0)
	waiting = true
	callbacks = []
	cbs.forEach((cb) => cb())
}

let timerFn
if (Promise) {
	timerFn = () => {
		Promise.resolve().then(flushCallbacks)
	}
} else if (MutationObserver) {
	let observer = new MutationObserver(flushCallbacks)
	let textNode = document.createTextNode(1)
	observer.observe(textNode, {
		characterData: true,
	})
	timerFn = () => {
		textNode.textContent = 2
	}
} else if (setImmediate) {
	timerFn = () => {
		setImmediate(flushCallbacks)
	}
} else {
	timerFn = () => {
		setTimeout(flushCallbacks, 0)
	}
}

export function nextTick(cb) {
	callbacks.push(cb)
	if (!waiting) {
		timerFn()
		waiting = true
	}
}
// 一个组件（Watcher）有多少属性 就有多少dep,
// 一个属性（dep） 对应多个组件（Watcher）
export default Watcher
