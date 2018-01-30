const fs = require('fs');
const path = require('path');
const parse = require('../lib/parse.js');

let _filename = path.join(__dirname, './template/test3.ejs');

let str = fs.readFileSync(_filename, 'utf8');


console.log(str);
let buf = parse(str, {
	filename: _filename
});
console.log(buf);