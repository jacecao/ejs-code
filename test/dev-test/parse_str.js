const fs = require('fs');
const path = require('path');
// console.log(path.join(__dirname, './template/main.ejs'));
let str = fs.readFileSync(path.join(__dirname, '../template/test2.ejs'), 'utf8');

// str = JSON.stringify(str);
// console.log(str + '\n');
/*
let _str = '';
for (let i = 0, len = str.length; i < len; i++) {
	
	if (str.slice(i, '<%'.length + i) == '<%') {
		i += '<%'.length;
	}
	if (str.slice(i, '%>'.length + i) == '%>') {
		i += '%>'.length;
	} else {
		_str += str[i];
	}
}
*/
// console.log(_str);

let n = 0;
let lineno = 1;
console.log(str);

while ( ~ ( n = str.indexOf('\n', n) ) ) {
	console.log(JSON.stringify(str[n]));
	n++;
	lineno++;
}

console.log(n);
console.log(lineno);