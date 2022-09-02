import { parseHTML } from './parse'

export function compileToFunction(template) {
	let ast = parseHTML(template)
	// 1、将template 转化成 ast语法树
	// 2、生成render方法，render方法返回虚拟DOM
	console.log(ast)

	// render
}
