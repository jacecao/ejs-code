// 统一错误处理模块
// @pram err Error object
// @pram str string
// @pram filename ejs filename
// @lineno number
module.exports = function rethrow (err, str, filename, lineno) {
	// 将字符按照换行符分割成数组
	let lines = str.split('\n');
	// 这里做一个比较取值的目的是获取当前行（发送错误行号）前后3行
	// 不需要全部显示
	let start = Math.max(lineno - 3, 0);
	let end = Math.min(lines.length, lineno + 3);
	// 这里重新构造数组中的元素
	// 即给没行添加行号
	// 如果当前行号等于错误行号那么添加’>>‘特殊标记
	let context = lines.slice(start, end).map((line, i) => {
		// 这里+1，是因为i从0开始计数
		let curr = i + start + 1;
		return (curr == lineno ? '>>' : '   ')
			+ curr
			+ '| '
			+ line;
	}).join('\n');
	// 为错误对象添加path属性
	err.path = filename;
	// 重新构造错误信息
	err.message = (filename || 'ejs') + ':'
		+ lineno + '\n'
		+ context + '\n\n'
		+ err.message;

	throw err;

}	