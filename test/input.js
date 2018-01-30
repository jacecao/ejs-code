/*
	测试文件
	如果全部都显示成功输入文件，则表示ejs运行正常
 */

const fs = require('fs');
const path = require('path');

let _filename = (name) => {
	return {ejs: path.join(__dirname, `./template/${name}.ejs`),
	html: path.join(__dirname, `./template/${name}.html`)};
};


const ejs = require('../ejs');

const input = (name, options = {}) => {
	let _path = _filename(name);
	let ejs_str = fs.readFileSync(_path.ejs, 'utf8');

	let html_str = ejs.render(ejs_str, options);

	fs.writeFile(_path.html, html_str, 'utf8', (err) => err ? 
		console.log(`writeFile ${_path.html} failed`) :
		console.log(`writeFile ${_path.html} success`)
	);
};

input('test3', {
	title: 'test',
	user: ['june', 'jace', 'icey']
});

input('main', {
	users: [{name: 'june', age: 0},{name: 'jace', age: 30}]
});

input('test1');

input('test2');