const fs = require('fs');
const path = require('path');
const compile = require('../fun/compile.js');

let _filename = path.join(__dirname, './template/test3.ejs');

let str = fs.readFileSync(_filename, 'utf8');


// console.log(str);
compile(str, {
	filename: _filename,
	debug: true
});
// console.log(buf);