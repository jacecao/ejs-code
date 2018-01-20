const utils = require('./utils.js');
const rethrow = require('./rethrow.js');

module.exports = function (str, options = {}) {
	// 指定文本替换方式默认为utils.js文件总的内容
	let escape = options.escape || utils.escape;
	// 这里这里传入的str是模板内容
	// 也就是functions.ejs文件里的内容
	let input = JSON.stringify(str);
	// 是否开启调试, 默认开启
	let compileDebug = options.compileDebug !== false;
	// 储存当前模板文件地址
	let filename = options.filename ? 
		JSON.stringify(options.filename) : 'undefined';

	if (compileDebug) {
		// 这里构成的是js代码字符串
		// 这是一个非常核心的点
		str = [
			'let _stack = { lineno: 1, input: ' + input + ', filename: ' + filename + ' };',
			// 这里是将rethrow方法本身转换为字符串
			// 其实这里得到的就是rethrow的代码文本信息
			rethrow.toString(),
			'try {',
			//exports.parse(str, options),
			'} catch (err) {',
			'  rethrow(err, _stack.input, _stack.filename, _stack.lineno);',
			'}'
		].join("\n");
	} else {
		// 如果没有开启调试
		// parse具体做了什么呢？
		// 参见parse.js
		str = parse(str, options);
	}
	

	console.log(str);
}