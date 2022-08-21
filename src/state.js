import { observe } from './observe/index'

export function initState(vm) {
	const opts = vm.$option
	if (opts.data) {
		initData(vm)
	}
}

function initData(vm) {
	let data = vm.$option.data // data可能是函数或者对象
	data = typeof data === 'function' ? data.call(vm) : data
	vm._data = data // 将data挂载到vm上

	// 观测数据： 采用Object.defineProperty对数据进行劫持
	observe(data)

	// 将vm._data 用vm代理
	for (let key in data) {
		proxy(vm, '_data', key)
	}
}

function proxy(vm, target, key) {
	Object.defineProperty(vm, key, {
		get() {
			return vm[target][key]
		},
		set(newValue) {
			if (vm[target][key] === newValue) return
			vm[target][key] = newValue
		},
	})
}
