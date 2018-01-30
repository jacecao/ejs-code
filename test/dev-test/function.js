/*
let str = "const escape = a || 'null'; \n console.log(escape);";

try {
	const fn = new Function('escape, hello', str);
} catch (err) {
	console.log(err);
}

console.log(`${fn}`);

*/

/*
let fn = function (a, b) {
	console.log(this == global);
	return a + b;
}

let _fn = function (a) {
	let b = 3;
	return fn.call(this, a, b);
}

let ejs = console.log(_fn(2));
*/
const _buf = [];
const _stack = {};
with ({}) {
	(function () {
		_buf.push('');
		_stack.lineno = 1;
		function test() {
			let a = 0;
			console.log('test');
			return a;
		};
		_buf.push('\n\n', test(), '');
	})();
}

console.log(_buf.join(''));