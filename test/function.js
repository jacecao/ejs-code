let str = "const escape = a || 'null'; \n console.log(escape);";

try {
	const fn = new Function('escape, hello', str);
} catch (err) {
	console.log(err);
}

console.log(`${fn}`);

