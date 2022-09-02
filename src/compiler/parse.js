// Regular Expressions for parsing tags and attributes

// 匹配属性
const attribute =
	/^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/

const dynamicArgAttribute =
	/^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+?\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
// const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`) // 匹配标签名 <div
const startTagClose = /^\s*(\/?)>/ // 匹配 <div> <div/>
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`) // 匹配 </div>
const doctype = /^<!DOCTYPE [^>]+>/i
// #7298: escape - to avoid being passed as HTML comment when inlined in page
const comment = /^<!\--/
const conditionalComment = /^<!\[/

// text
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{name}} 匹配表达式的变量
const regexEscapeRE = /[-.*+?^${}()|[\]\/\\]/g

export function parseHTML(html) {
	const ELEMENT_TYPE = 1
	const TEXT_TYPE = 3
	const stack = []
	let currentParent // 指向栈中最后一个
	let root
	function createASTElement(tag, attrs) {
		return {
			tag,
			type: ELEMENT_TYPE,
			children: [],
			attrs,
			parent: null,
		}
	}

	function start(tag, attrs) {
		let node = createASTElement(tag, attrs) // 创建一个ast节点
		if (!root) {
			// 如果当前树为空，则是树的根节点
			root = node
		}
		if (currentParent) {
			node.parent = currentParent
			currentParent.children.push(node)
		}
		stack.push(node)
		currentParent = node
		// console.log(tag, attrs, '开始')
	}
	function chars(text) {
		// 文本直接放到当前指向的节点
		text = text.replace(/\s/g, '')
		text &&
			currentParent.children.push({
				type: TEXT_TYPE,
				text,
			})
		// console.log(text, '文本')
	}
	function end(tag) {
		stack.pop() // 弹出最后一个
		currentParent = stack[stack.length - 1]
		// console.log(tag, '结束')
	}
	// 删除匹配的字符
	function advance(n) {
		html = html.substring(n)
	}
	function parseStartTag() {
		const start = html.match(startTagOpen)
		if (start) {
			const match = {
				tagName: start[1], // 标签名
				attrs: [],
			}
			advance(start[0].length)

			// 如果不是开始标签的结束，就一直匹配下去
			let attr, end
			while (
				!(end = html.match(startTagClose)) &&
				(attr = html.match(attribute))
			) {
				advance(attr[0].length)
				match.attrs.push({
					name: attr[1],
					value: attr[3] || attr[4] || attr[5],
				})
			}
			if (end) {
				advance(end[0].length)
			}
			return match
		}

		return false // 不是开始标签
	}

	while (html) {
		// textEnd为0 说明是一个开始标签或者结束标签
		// textEnd>0 说明就是文本的结束位置
		let textEnd = html.indexOf('<')
		// console.log('textEnd:', textEnd)
		// console.log(html)
		if (textEnd == 0) {
			const startTagMatch = parseStartTag() // 开始标签的匹配
			const endTagMatch = html.match(endTag)
			if (startTagMatch) {
				// 解析到开始标签
				start(startTagMatch.tagName, startTagMatch.attrs)
				continue
			}

			if (endTagMatch) {
				advance(endTagMatch[0].length)
				end(endTagMatch[1])
				continue
			}
		} else if (textEnd > 0) {
			let text = html.substring(0, textEnd) // 文本内容
			if (text) {
				// 解析到文本
				chars(text)
				advance(text.length)
			}
		}
	}
	return root
}
