/*
** ejs模块的核心就是构建JS代码字符串
** 通过一段一段的字符串结合来构成一个可执行的JS文件
**
** parse.js 分析字符串模块
** 并拼接成可执行的JS代码字符串
 */

const _private = {
	open: '<%', //默认需要通过JS处理的起始标记符
	close: '%>', //默认JS处理结束标记符号
	compileDebug: true, //默认开启代码解析
	_with: true // 是否需要使用with(){}来执行代码
};

const read = require('fs').readFileSync;
const 

const parse = function(str, options = _private) {
	const open = options.open;
	const close = options.close;

	let buf = ""; // 储存JS代码字符串

	buf += 'const _buf = [];';

	// 这里将开启with语句执行代码
	// with语句不常用，主要功能就是设定指定的作用域
	// width(指定作用域对象){执行代码（都将以指定的对象作为本地初始对象）}
	if (options._with !== false) {
		// 这里locals究竟是什么呢？ 请看des.md
		buf += '\nwith (locals || {}) { (function () {';
	}

	buf += "\n _buf.push(\'";
	// 这里需要注意，lineno代码当前代码行
	// 这也是代码解析核心的思想
	// 在构建JScode代码时，并不断的记录代码行数
	let lineno = 1;

	// ??
	let consumeEOL = false;

	// 字符串解析开始啦
	for (let i = 0; i < str.length; i++) {
		let stri = str[i];
		// 检查字符串片段是否包含‘<%’字符串
		if (str.slice(i, open.length + i) == open) {
			// 如果当前字符串片段中包含指定字符串
			// 那将下次截取起始位置跳过‘<%’字符串
			i += open.length;

			let prefix, postfix;
			// 这里如果开启代码解析
			// 那么将创建一个‘栈’对象
			// 该对象记录当前代码行号和代码字符串
			let line = (compileDebug ? '_stack.lineno=' : '') + lineno;

			switch (str[i]) {
				// ‘<% =’ 这样的模式
				// 意思是需要向模板输出转译后的值
				// 所以这里使用了escape这个函数
				// escape主要实现转译
				case '=':
					prefix = "', escape((" + line + ', ';
					postfix = ")), '";
					// 注意操作完毕后，需要跳过‘=’字符
					// 所以这里++i
					++ i;
					break;
				// 输出未转译的值
				case '-':
					prefix = "', (" + line + ', ';
					postfix = "), '";
					++ i;
					break;
				default:
					prefix = "');" + line + ";";
					postfix = "; buf.push('";	
			}

			// 检查模板字符串中是否包含闭合标签‘%>’
			// 注意这里的执行逻辑
			// 这里是处理完开始标签‘<%’后紧接着就需要查找对应的闭合标签
			// 而这里寻找的起始位置就是跳过前面特殊字符后的索引
			// 这里很关键
			let end = str.indexOf(close, i);

			if (end < 0) {
				throw new Error('could not find matching close tag"' + close + '".');
			}
			// 截取<% js code %>
			// 截取字符串中JS代码部分
			let js = str.substring(i, end);
			let start = i;
			// 用户储存当前模板文件中包含的（其他模板文件的解析字符串）
			let include = null;
			// ......
			let n = 0;

			// ........
			if (js[js.length - 1] == '-') {
				js = js.substring(0, js.length - 2);
				consumeEOL = true;
			}

			// trim() 删除字符串两端的空白字符
			// 处理包含模块：
			// <% include('template-file', data) %>
			// <% include template-file %>
			if (js.trim().indexOf('include') == 0) {

			}

		}

	}


}


module.exports = parse;