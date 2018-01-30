// js ejs代码字符串特殊字符过滤
// js_str  js代码字符串
// 
/*
	debug->   ':users | map: 'name' | join'

	上面的字符串用于说明该代码的运行情况
	step 1 => 代表第一次运行的流程
	step 2 => 代表第二次运行的流程
	第三次直接返回最终构造的字符串
 */

// 这段代码非常的精简
// 但却用了极少的代码来构建了整个过滤执行逻辑
// 这里需要熟悉reduce()方法

module.exports = (js_str) => {
	let _arr = js_str.substr(1).split('|');
	// -> _arr = ['users', "map:'name'", 'join']
	return _arr.reduce((prev_str, next_filter) => {
		// step.1-> prev_str = users
		// step.2-> prev_str = 'filter.map(users, name)'
		let parts = next_filter.split(':');
		// step.1-> next_filter = "map:'name'", parts = ['map', 'name']
		// step.2-> next_filter = 'join', parts = ['join']
		// shift() 删除数组第一个值，并返回删除的值
		let name = parts.shift();
		// step.1-> name = 'map', parts = ['name']
		// step.2-> name = 'join', parts = [];
		let args = parts.join(':') || '';
		// step.1-> args = 'name'
		// step.2-> args = ''
		if (args) {
			args = `, ${args}`;
			// step.1-> args = ', name'
		}

		return `filter.${name}(${prev_str}${args})`;
		// step.1-> pre_str = 'filter.map(users, name)'
		// step.2-> pre_str = 'filter.join(filter.map(users, name))'
	});
}