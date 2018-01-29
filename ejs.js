const compile = require('./fun/compile.js');

// 文件缓存储存
let cache = {};

// ejs核心模块
// str 模板字符串
// options  模板解析配置文件

module.exports.render = (str, options) {
	let fn;
	// 是否开启文件缓存
	if (options.cache) {

		if (options.filename) {
			// 如果配置给了文件名
			// 检查缓存中是否已经储存，如果没有就执行缓存
			fn = cache[options.filename] || 
				 (cache[options.filename] = compile(str, options));
		} else {
			throw new Error("'cache' option requires 'filename'. ");
		}

	} else {
		fn = compile(str, options);
	}
}