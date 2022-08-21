export function observe(data) {
	// 只针对对象劫持
	if (typeof data !== 'object' || data === null) {
		return
	}
	// 如果一个对象以及被劫持过了，就不需要再次劫持，通过添加__ob__判断
	return new Observer(data)
}

export function defineReactive(target, key, value) {
	observe(value)
	Object.defineProperty(target, key, {
		get() {
			return value
		},
		set(newValue) {
			if (newValue === value) return
			value = newValue
		},
	})
}

class Observer {
	constructor(data) {
		// Object.defineProperty只能劫持已存在的属性（因此需要增加api如 Vue.$set，Vue.$delete等）
		this.walk(data) // 遍历属性
	}

	walk(data) {
		// 重写对象属性
		Object.keys(data).forEach((key) => defineReactive(data, key, data[key]))
	}
}