const utils = require('./utils.js');
const rethrow = require('./rethrow.js');

module.exports = function (str, options = {}) {
	
	let escape = options.escape || utils.escape;

	let input = JSON.stringify(str);
	let filename = options.filename ? 
		JSON.stringify(options.filename) : 'undefined';

	str = [
		'var __stack = { lineno: 1, input: ' + input + ', filename: ' + filename + ' };',
		rethrow.toString(),
		'try {',
		//exports.parse(str, options),
		'} catch (err) {',
		'  rethrow(err, __stack.input, __stack.filename, __stack.lineno);',
		'}'
	].join("\n");

	console.log(str);
}