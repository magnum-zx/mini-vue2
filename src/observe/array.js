// 重新数组中的方法

let arrayProto = Array.prototype
let arrayProxyMethods = Object.create(arrayProto)
let methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']

methods.forEach((method) => {
	arrayProxyMethods[method] = function (...args) {
		const result = arrayProto.call(this, ...args)
		const ob = this.__ob__
		// 对新增数据进行劫持
		let inserted
		switch (method) {
			case 'push':
			case 'unshift':
				inserted = args
				break
			case 'splice': // arr.splcie(0, 1, {a:1})
				inserted = args.slice[2]
				break
			default:
				break
		}
		if (inserted) {
			ob.observeArray(inserted)
		}
		return result
	}
})
