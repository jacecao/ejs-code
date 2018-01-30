const compile = require('./lib/compile.js');

// 文件缓存储存
let cache = {};
// 清空缓存
module.exports.clearCache = () => cache = {};
// 获取缓存
module.exports.cache = cache;
// ejs核心模块
// str 模板字符串
// options  模板解析配置文件

module.exports.render = (str, options) => {
	let fn;
	// 默认开启缓存
	let _cache = options.cache !== false;
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

	return fn;
}