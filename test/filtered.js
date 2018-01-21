const filtered = require('../fun/filtered');

let js_str = ": users | map:'name' | join ";
js_str = js_str.trim();

console.log(filtered(js_str));