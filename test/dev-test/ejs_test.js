const fs = require('fs');
const path = require('path');

let _filename = path.join(__dirname, '../template/test3.ejs');

let str = fs.readFileSync(_filename, 'utf8');

const ejs = require('../../ejs');

let users = [];
let title = 'hello';
users.push({ name: 'Tobi', age: 2, species: 'ferret' })
users.push({ name: 'Loki', age: 2, species: 'ferret' })
users.push({ name: 'Jane', age: 6, species: 'ferret' })

let user = ['june', 'jace', 'icey'];

let ret = ejs.render(str, {
  data: {user, title, user},
  filename: _filename,
  // debug: true
});

console.log(ret);
// console.log(ejs.cache);
// console.log(require.cache);