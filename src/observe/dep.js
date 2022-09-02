let id = 0
class Dep {
	constructor() {
		this.id = id++
		this.subs = [] // 收集当前属性对应的Watcher
	}
	addSub(watcher) {
		this.subs.push(watcher)
	}
	depend() {
		// 去重
		// this.subs.push(Dep.target)
		// Dep.target 就是当前的Watcher实例， 需要将dep添加到当前Watcher上,同时让watcher也记住这个dep
		Dep.target.addDep(this)
	}
	notify() {
		this.subs.forEach((watcher) => watcher.update())
	}
}
Dep.target = null
const targetStack = []
export function pushTarget(target) {
	Dep.target = target
	targetStack.push(target)
}
export function popTarget() {
	targetStack.pop()
	Dep.target = targetStack[targetStack.length - 1]
}
export default Dep
