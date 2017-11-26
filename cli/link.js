'use strict';

const ora = require('ora');
const path = require('path');

exports.command = 'link <path>';
exports.describe = 'Link a JS-file or module';
exports.builder = {
};

exports.handler = function(argv) {
	const p = path.resolve(path.join(process.cwd(), argv.path));

	const spinner = ora('Linking ' + p).start();
	const client = require('../client');

	client()
		.then(c => {
			return c.link(p);
		})
		.then(() => {
			spinner.succeed('Linking done');
		})
		.catch(err => {
			spinner.fail(err.message);
		})
		.then(() => process.exit());
};
