// 过滤器测试
const filters = require('../lib/filters');

let obj = {
	name: 'jacecao',
	hoby: ['code', 'write', 'game']
}

let arr = ['a', 'b'];

console.log(filters.first(obj));