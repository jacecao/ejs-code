const fs = require('fs');
const path = require('path');

let _filename = path.join(__dirname, './template/test3.ejs');

let str = fs.readFileSync(_filename, 'utf8');

const ejs = require('../ejs');
console.log(ejs.render(str, {
	filename: _filename,
	user: ['june', 'icey'],
	cache: true,
	debug: true
}) + '');
// console.log(ejs.cache);
// console.log(require.cache);