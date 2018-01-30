const fs = require('fs');
const path = require('path');
const compile = require('../lib/compile.js');

let _filename = path.join(__dirname, './template/test3.ejs');

let str = fs.readFileSync(_filename, 'utf8');


// console.log(str);
let fun = compile(str, {
	filename: _filename,
});
console.log(fun + '');