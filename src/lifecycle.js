import Watcher from './observe/watcher'
import { createElementVNode, createTextVNode } from './vdom'

function createElm(VNode) {
	let { tag, data, children, text } = vnode
	if (typeof tag === 'string') {
		vnode.el = document.createElement(tag)
		patchProps(vnode.el, data)
		children.forEach((child) => {
			let childNode = createElm(child)
			vnode.el.appendChild(childNode)
		})
	} else {
		vnode.el = document.createTextNode(text)
	}
	return vnode.el
}
function patchProps(el, props) {
	for (let key in props) {
		if (key === 'style') {
			for (let styleName in props.style) {
				el.style[styleName] = props.style[styleName]
			}
		} else {
			el.setAttribute(key, props[key])
		}
	}
}
function patch(oldVNode, newVNode) {
	// 初渲染
	const isRealElement = oldVNode.nodeType
	if (isRealElement) {
		const elm = oldVNode // 获取真实元素
		const parent = elm.parentNode // 拿到父元素
		let newElm = createElm(vnode)
		parentNode.insertBefore(newElm, elm.nextSibling)
		parentNode.removeChild(elm)
	} else {
		// diff算法
	}
	return newElm
}

export function initLifeCycle(Vue) {
	Vue.prototype._update = function (vnode) {
		console.log(this)
		const vm = this
		const el = vm.$el
		vm.$el = patch(el, vnode)
	}
	// _c('div', {}, children)
	Vue.prototype._c = function () {
		return createElementVNode(this, ...arguments)
	}
	Vue.prototype._v = function () {
		return createTextVNode(this, ...arguments)
	}
	Vue.prototype._s = function (value) {
		if (typeof value !== 'object') return value
		return JSON.stringify(value)
	}
	Vue.prototype._render = function () {
		return this.$options.render.call(this)
	}
}

export function mountComponent(vm, el) {
	vm.$el = el
	// 1、调用render方法产生虚拟DOM , 用update将虚拟DOM转成真实DOM
	function updateComponent() {
		console.log(vm._render())
		// vm._update(vm._render()) // vm.$options.render() 返回虚拟DOM
	}
	// debugger
	new Watcher(vm, updateComponent, true) // 渲染Watcher
	// 2、根据虚拟DOM生成真实DOM

	// 3、将真实DOM挂载到el元素上
	return vm
}
