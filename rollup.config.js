import babel from 'rollup-plugin-babel'
// rollup 配置
export default {
	input: './src/index.js', // 入口
	output: {
		file: './dist/vue.js', // 输出文件
		name: 'Vue',
		format: 'umd', // 打包格式 esm es6模块 commonJS模块 iife自执行函数 umd（commonJS amd）
		sourcemap: true, // 方便调试
	},
	plugins: [
		babel({
			exclude: 'node_modules/**', // 排除node_modules
		}),
	],
}
