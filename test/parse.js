const fs = require('fs');
const path = require('path');
const parse = require('../fun/parse.js');

let _filename = path.join(__dirname, './template/test-2.ejs');

let str = fs.readFileSync(_filename, 'utf8');

str = JSON.stringify(str);

console.log(str);
let buf = parse(str, {
	filename: _filename
});
console.log(buf);