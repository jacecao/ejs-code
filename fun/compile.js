/*
**  compile将解析后的字符串组装为一个可执行的函数
 */

// 特殊字符转译处理
const utils = require('./utils.js');
// 错误处理模块
const rethrow = require('./rethrow.js');
// ejs文件解析模块
const parse = require('./parse.js');
// 数据过滤模块
const filters = require('./filters.js');

module.exports = function (str, options = {}) {
	// 指定文本替换方式默认为utils.js文件总的内容
	let escape = options.escape || utils.escape;
	// 这里这里传入的str是模板内容
	// 也就是ejs文件里的内容
	let input = JSON.stringify(str);
	// 是否开启调试, 默认true
	let compileDebug = options.compileDebug !== false;
	// 储存当前模板文件地址
	let filename = options.filename ? 
		JSON.stringify(options.filename) : undefined;
	// 直接返回解析后的函数, 默认不返回
	let getFun = options.getFun || false;

	if (compileDebug) {
		// 这里构成的是js代码字符串
		// 这是一个非常核心的点
		str = [
			`let _stack = { lineno: 1, input: ' ${input} ', filename: ' ${filename} ' };`,
			// 这里是将rethrow方法本身转换为字符串
			// 其实这里得到的就是rethrow的代码文本信息
			// 因为这里需要被转为字符串，所以rethrow就不要使用箭头函数了
			rethrow.toString(),
			'try {',
				parse(str, options),
			'} catch (err) {',
			'  rethrow(err, _stack.input, _stack.filename, _stack.lineno);',
			'}'
		].join("\n");
	} else {
		// 直接返回解析后的JS代码字符串
		str = parse(str, options);
	}

	if (options.debug) {
		// 显示当前解析后的代码信息
		console.log(str);
	}

	if (getFun) {
		str = `escape = escape || ${escape.toString()}; \n ${str}`;
	}

	// 通过Function构造函数,将JS字符串作为函数输出
	// new function(arg1, arg2, ..., argN, function_body)
	// 每个 arg 都是一个参数，最后一个参数是函数主体（要执行的代码）。
	// 这些参数必须是字符串。
	let fn = null;
	// 这里有一个需要注意的地方
	// 在源码中在下面try块中声明fn
	// 这种方式其实是不可取的，在ES5中就规定不可以在块作用域中声明函数
	// 在ES6中声明可以在块作用域中声明函数，但不可以块外部使用
	try {

		fn = new Function('locals', 'filters', 'escape', 'rethrow', str);
	
	} catch (err) {
		// 如果错误名称为语法错误，给出出错的文件名
		if (err.name == 'SyntaxError') {
			err.message = filename ? `in ${filename}` : 'while compiling ejs';
		}
		throw err;
	}

	if (getFun) {return fn;}

	return function (locals) {
		return fn.call(this, locals, filters, escape, rethrow);
	}
}