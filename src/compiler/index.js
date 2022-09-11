import { parseHTML } from './parse'

// 处理标签属性
function genProps(attrs) {
	let str = '' // {name: value}
	for (let i = 0; i < attrs.length; i++) {
		let attr = attrs[i]
		if (attr.name === 'style') {
			let obj = {}
			attr.value.split(';').forEach((item) => {
				let [key, value] = item.split(':')
				obj[key] = value
			})
			attr.value = obj
		}
		str += `${attr.name}:${JSON.stringify(attr.value)},`
	}
	return `{${str.slice(0, -1)}}`
}

const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{name}} 匹配表达式的变量
function gen(node) {
	if (node.type === 1) {
		//ELEMENT_TYPE
		return codegen(node)
	} else {
		// 文本
		let text = node.text
		if (!defaultTagRE.test(text)) {
			return `_v(${JSON.stringify(text)})`
		} else {
			let tokens = []
			let match
			defaultTagRE.lastIndex = 0
			let lastIndex = 0
			while ((match = defaultTagRE.exec(text))) {
				let index = match.index
				if (index > lastIndex) {
					tokens.push(JSON.stringify(text.slice(lastIndex, index)))
					// console.log('lastIdx', lastIndex)
				}
				tokens.push(`_s(${match[1].trim()})`)
				lastIndex = index + match[0].length
				// console.log(match)
			}
			if (lastIndex < text.length) {
				tokens.push(JSON.stringify(text.slice(lastIndex).trim()))
			}
			return `_v(${tokens.join('+')})`
		}
	}
}

function genChildren(children) {
	if (children) {
		return children.map((child) => gen(child)).join(',')
	}
}
// 生成代码
function codegen(ast) {
	let children = genChildren(ast.children)
	let code = `_c('${ast.tag}', ${
		ast.attrs.length > 0 ? genProps(ast.attrs) : 'null'
	}${ast.children.length > 0 ? `,${children}` : ''})`
	// console.log(code)
	return code
}

export function compileToFunction(template) {
	let ast = parseHTML(template)
	// 1、将template 转化成 ast语法树
	// 2、生成render方法，render方法返回虚拟DOM
	// console.log(ast)
	let code = codegen(ast)
	// console.log(code)
	// 模板引擎的实现原理就是with + new Function
	code = `with(this){return ${code}}`
	let render = new Function(code) // 根据代码生成render函数
	return render
	// function render(
	// 	) {
	// 	with(this){return _c('div', {id:"app",style:{"color":" green"}},_c('div', {style:{"color":" red"}},_v(_s(name)+"Hello"+_s(height)+"hello")),_c('span', null,_v(_s(age))),_c('br', null))}
	// 	}
	// render.call(vm) -> this === vm
}

// let vm = {a:1}
// with(vm){
// 	console.log(a) // vm.a
// }
