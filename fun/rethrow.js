// 统一错误处理模块

module.exports = function (err, str, filename, lineno) {
	
	let lines = str.split('\n');
	let start = Math.max(lineno - 3, 0);
	let end = Math.min(lines.length, lineno + 3);

	let context = lines.slice(start, end).map((line, i) => {
		let curr = i + start + 1;
		return (curr == lineno ? '>>' : '   ')
			+ curr
			+ '| '
			+ line;
	}).join('\n');

	err.path = filename;

	err.message = (filename || 'ejs') + ':'
		+ lineno + '\n'
		+ context + '\n\n'
		+ err.message;

	throw err;

}	