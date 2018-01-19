const utils = require('./utils.js');
const rethrow = require('./rethrow.js');

module.exports = function (str, options = {}) {
	// 指定文本替换方式默认为utils.js文件总的内容
	let escape = options.escape || utils.escape;
	// 这里这里传入的str是模板内容
	// 也就是functions.ejs文件里的内容
	let input = JSON.stringify(str);
	let filename = options.filename ? 
		JSON.stringify(options.filename) : 'undefined';

	str = [
		'var __stack = { lineno: 1, input: ' + input + ', filename: ' + filename + ' };',
		// 这里是将rethrow方法本身转换为字符串
		// 其实这里得到的就是rethrow的代码文本信息
		rethrow.toString(),
		'try {',
		//exports.parse(str, options),
		'} catch (err) {',
		'  rethrow(err, __stack.input, __stack.filename, __stack.lineno);',
		'}'
	].join("\n");

	console.log(str);
}