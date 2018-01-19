const fs = require('fs');
const path = __dirname + '/functions.ejs';
const str = fs.readFileSync(path, 'utf8');

const utils = require('./fun/utils.js');

const compile = require('./fun/compile.js');

function filtered(js) {
	
	return js.substr(1).split('|').reduce( (js, filter) => {
		let parts = filter.split(':');
		let name = parts.shift();
		let args = parts.join(':') || '';

		if (args) {
			args = ',' + args;
		}

		return 'filters.' + name + '(' + js + args + ')';
	});

}

// let _text = utils.escape(str);
compile(str, {filename: path});
