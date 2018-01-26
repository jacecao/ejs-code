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

// nodejs 同步读取文件模块，返回文件内容
const read = require('fs').readFileSync;
// nodejs 路径整合模块，实现不同路径表达方式的兼容
const path = require('path');
// 获取包含文件的地址
const resolveInclude = function (name, filename) {
	// 组合文件路径
	// 该方法要求filename，也就是说如果ejs中需要使用include方法
	// 那么必须在配置文件中指定当前明见路径
	let _path = path.join(path.dirname(filename), name);
	// 获取文件后缀
	let ext = path.extname(name);
	// 如果没有后缀名，那么加上后缀名
	if (!ext) {
		_path += '.ejs';
	}
	return _path;
}
// ejs文件解析
// 这里需要实现的功能是将js代码和HTML剥离储存
// 最终返回的是一个可执行的js代码字符串
const parse = function(str, options = _private) {
	const open = options.open || _private.open;
	const close = options.close || _private.close;
	// 是否开启文件解析
	// 这里主要用于记录代码执行的行数
	// 也就是实现当前行号和当前行中的代码
	const compileDebug = options.compileDebug || _private.compileDebug;
	// 当前模板文件名
	const filename = options.filename;


	let buf = ""; // 储存最终返回的JS代码字符串

	buf += 'const _buf = [];'; // 注意这里_buf是代码字符串中的变量

	// 这里将开启with语句执行代码
	// with语句不常用，主要功能就是设定指定的作用域
	// width(指定作用域对象){执行代码（都将以指定的对象作为作用域初始对象）}
	if (options._with !== false) {
		// 这里locals究竟是什么呢？ 请看des.md
		buf += '\nwith (locals || {}) { (function () {';
	}

	buf += "\n _buf.push(\'";
	// 这里需要注意，lineno代码当前代码行
	// 这也是代码解析核心的思想
	// 在构建JScode代码时，并不断的记录代码行数
	let lineno = 1;

	// 是否保持HTML代码结构样式
	// 这里主要是HTML中断行和缩进
	let consumeEOL = false;

	// 字符串解析开始啦
	// 需要注意的是这里解析字符串的方式
	// <% xxx %> 按照这样的开/闭合标签来逐个构建JS代码字符串
	for (let i = 0; i < str.length; i++) {
		let stri = str[i];
		// 检查字符串片段是否包含‘<%’字符串
		if (str.slice(i, open.length + i) == open) {
			// 如果当前字符串片段中包含指定字符串
			// 那将下次截取起始位置跳过‘<%’字符串
			i += open.length;
			// prefix -> 需要添加的字符串上部分
			// postfix -> 需要添加字符串的下部分
			// 这里之所以要这样，是因为这里采用_buf.push(),来储存每一段数据
			// 所以在储存每一段数据同时，还需要保持_buf.push()函数本身语法的正确性
			let prefix, postfix;
			// 这里如果开启代码解析
			// 那么将创建一个‘栈’对象
			// 该对象记录当前代码行号和代码字符串
			let line = (compileDebug ? '_stack.lineno=' : '') + lineno;

			// 这里判断的目的，是为了告诉程序接下来需要保存字符串的方式
			// 也就是该以什么样的结构来储存当前取到的字符串
			// prefix 指定接下来储存字符串时，开始应该写入的内容
			// postfix 指定接下来储存完标记内容后应该写入的内容
			// 当前我们字符串的储存格式就是这样：
			// buf += (prefix + '<%标记内部的字符串%>' + postfix)
			switch (str[i]) {
				// ‘<% =’ 这样的模式
				// 意思是需要向模板输出转译后的值
				// 所以这里使用了escape这个函数
				// escape主要实现转译
				case '=':
					/*
						str > "<h1><%= name %></h1>"
						buf = _buf.push('"<h1>', escape((${line}, name)),'</h1>"');

					 */
					prefix = `', escape(( ${line} , `;
					postfix = ")), '";
					// 注意操作完毕后，需要跳过‘=’字符
					// 所以这里++i
					++ i;
					break;
				// 输出未转译的值
				case '-':
					prefix = `', ( ${line} , `;
					postfix = "), '";
					++ i;
					break;
				default:
					// 如果仅为<%，这样的字符串
					// 那么将前半段字符串写入数组，并开始准备记录下一段字符串
					// 例如 ‘html element <% for (xxxx)’ 如果当前字符串是这样的字符串
					// 那么buf中的字符串应该是这样的
					// "_buf = []; _buf.push('html element'); _stack.lineno=1; _buf('"
					prefix = `'); ${line};`;
					postfix = "; _buf.push('";	
			}

			// 检查模板字符串中是否包含闭合标签‘%>’
			// 注意这里的执行逻辑
			// 这里是处理完开始标签‘<%’后紧接着就需要查找对应的闭合标签
			// 而这里寻找的起始位置就是跳过前面特殊字符后的索引
			// 这里很关键
			let end = str.indexOf(close, i);

			if (end < 0) {
				// 为什么这里仅仅跑出错误而不终止程序呢？
				// 这是因为作者在compile.js这个文件中有错误捕获
				// 也就是给出了一个统一的错误处理方式
				// 而没有这里直接return
				throw new Error(`could not find matching close tag" ${close}".`);
			}
			// 截取<% js code %>
			// 截取字符串中JS代码部分
			// buf += (prefix + '<%标记内部的字符串%>' + postfix)
			// 这是总的字符串串解析思路
			// 那么当前我们需要做的就是解析标记内部的字符串
			let js = str.substring(i, end);
			let start = i;
			// 用户储存当前模板文件中包含的（其他模板文件的解析字符串）
			let include = null;
			// js代码字符串的字符索引记录
			let n = 0;

			// 检测结尾标记符号是否为 -%>
			// "<div><% for() {} -%></div>
			if (js[js.length - 1] == '-') {
				// 源码如下面这样我个人觉得有错误
				// js = js.substring(0, js.length - 2);
				// <%=name-%> 这样就会出错
				js = js.substr(0, js.length - 1);
				consumeEOL = true;
			}

			// trim() 删除字符串两端的空白字符
			// 处理包含模块：
			// <% include('template-file', data) %>
			// <% include template-file %>
			if (js.trim().indexOf('include') == 0) {
				// 获取include后面的文件路径
				let name = js.trim().slice(7).trim();
				// 如果在配置对象中没有给filename值
				// 那么include功能无法实现
				if (!filename) {
					throw new Error("filename option is required for includes");
				}
				// 获取包含文件的路径
				let path = resolveInclude(name, filename);
				// 读取包含文件
				try {
					include = read(path, 'utf8');
					// 处理包含文件（其实这里就是一个回调）
					include = parse(include, {
						filename: path,
						_with: false,
						open: open,
						close: close,
						compileDebug: compileDebug
					});

					buf += `' + (function () { ${include} })() + '`;
					// 清空js变量
					js = '';
				} catch (e) {
					throw new Error(`include the file not exist, error-messgae: ${path}`);
				}
				
			}
			// 这里是一个取反运算符
			// 这是一个非常巧妙的运用
			// indexOf 在匹配字符串后会返回大于等于0的数 否则返回-1
			// 这里通过取反就解决了布尔运算
			// 当然返回-1时，取反运算结果就为0 -> false, 其他情况都返回 true
			// 这里要判断的是<%内部有\n符号的出现%>
			/*
				这里需要注意一个问题，因为

			 */
			while (~ (n = js.indexOf("\n", n)) ) {
				console.log(`js: ${js} ${n}`);
				n ++;
				lineno ++;
			}

			// 过滤特殊字符
			// 前已经筛选了这两种情况 1. <%= %>  2. <%- >
			// 现在我们需要进入第二级别的筛选 <%=: %> <%# %> <%% %>
			// 这里筛选的是‘：’ ‘ #’ ‘ %’ 
			/*
			**【slice】和【substring】
			** 接收的是起始位置和结束位置(不包括结束位置)
			**【substr】
			** 接收的则是起始位置和所要返回的字符串长度
			 */
			switch (js.substr(0, 1)) {
				case ':': // 实现数据渗入
					js = filtered(js);
					break;
				case '%': // 对当前字符串不做解析
					js = ` _buf.push('<% ${js.substring(1).replace(/'/g, "\\'")} %>');`;
          			break;
          		case '#':
          			// 实现代码注释，对标记内的字符串不做解析和保存
          			js = "";
          			break;	
			}

			if (js) {
				// 这里检测标记内代码注释’//‘ 是否在换行符之后
				// 其实这里主要涉及一种情况
				// <%= name //名字%>
				// _buf.push('', escape((line, name //名字)));
				// 如果这里不插入转行符号，那么就会注释掉后面的")));"
				// 这样在执行这段代码就会出错
				if (js.lastIndexOf('//') > js.lastIndexOf('\n')) {
					js += '\n';
				}
				buf += prefix;
				buf += js;
				buf += postfix;
			}
			// 这里是将字符串序列跳过结尾标记标签
			// js = '<%=for(){}%>'
			// 由于前面对开始标记标签进行了过滤，所以根据上面这个字符串得出
			// start = 3; i = 3;
			// end = 10; end为结尾标记标签的起始索引
			// 现在要将i索引移到'>'之后 即 i = 12
			// 10 - 3 + 2 = 9 >> 这里得到的是标记里的字符串长度
			// 那为什么这里需要减一呢？
			// 理清这里也非常关键，因为这里是包裹在for循环里
			// 如果当前i直接跳过‘>’, 那么下一次循环 i = 13,这样就会出现问题
			// 这里-1的目的其实就是综合for循环每次+1
			// 这样下一次循环i的其实值就是12 
			i += end - start + close.length - 1;

		// 如果字符串为'\'转译为“\\”
		} else if (stri == "\\") {
			buf += '\\\\';
		//  如果字符串中有’需要转移为"\'"
		} else if (stri == "'") {
			buf += "\\'";

		}else if (stri == "\r") {

		} else if (stri == "\n") {
			// 这个情况我个人认为没什么作用
			// 可能作者是为了解决因为注释而添加的\n符号
			// 这里的作用应该发生在有include时
			/*
				if (js.lastIndexOf('//') > js.lastIndexOf('\n')) {
					js += '\n';
				}
			 */
			if (consumeEOL) {
				consumeEOL = false;
			} else {
				buf  += "\\n";
				lineno ++;
			}

		} else {
			// 如果不包含指定起始标签的字符串直接写入
			// 这里我们就能容易理解为什么 buf += "\n _buf.push(\'";
			// 我们需要这样储存字符串 _buf.push('str')
			// 所以一开始" _buf.push(' " ,这里就开始等待字符串的写入
			// 而每次写入完毕后又要加上 " '); ",  
			buf += stri;
		}

	}

	if (options._with !== false) {
		buf += "'); })();\n} \nreturn _buf.join('');"
	} else {
		buf += "'); \n return _buf.join('');";
	}

	return buf;
}


module.exports = parse;