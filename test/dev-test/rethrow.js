const fs = require('fs');
const path = require('path');

let _filename = path.join(__dirname, '../template/test3.ejs');

let str = fs.readFileSync(_filename, 'utf8');

const rethrow = require('../../lib/rethrow.js');
console.log(rethrow({}, str, 'test.ejs', 1).message);
// console.log(ejs.cache);
// console.log(require.cache);