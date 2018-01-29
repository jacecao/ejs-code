/*
	过滤器设置
	
	在解析模板字符串中，获取到的过滤器（数据渗透）执行方式

 */


// 获取数组的第一个值
module.exports.first = (arr) => {
	if (typeof arr == 'object' && arr instanceof Array) {
		return arr[0];
	} else {
		throw new Error (`input the data must be a array, here is ${arr}`);
	}
}

// 获取数组的最后一个值

module.exports.last = (arr) => {
	if (typeof arr == 'object' && arr instanceof Array) {
		return arr[arr.length - 1];
	} else {
		throw new Error (`input the data must be a array, here is ${arr}`);
	}
}

