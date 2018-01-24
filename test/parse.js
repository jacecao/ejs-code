const fs = require('fs');
const path = require('path');
const parse = require('../fun/parse.js');
let str = fs.readFileSync(path.join(__dirname, '../functions.ejs'), 'utf8');

str = JSON.stringify(str);

console.log(str);
console.log(parse(str));