// 过滤器测试
const filters = require('../fun/filters');

let obj = {
	name: 'jacecao',
	hoby: ['code', 'write', 'game']
}

let arr = ['a', 'b'];

console.log(filters.first(obj));