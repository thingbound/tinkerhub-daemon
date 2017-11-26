'use strict';

const ora = require('ora');

exports.command = 'install <id>';
exports.describe = 'Install a plugin';
exports.builder = {
};

exports.handler = function(argv) {
	const spinner = ora('Installing package').start();

	const client = require('../client');

	client()
		.then(c => {
			return c.install(argv.id);
		})
		.then(() => {
			spinner.succeed('Installed ' + argv.id);
		})
		.catch(err => {
			spinner.fail(err.message);
		})
		.then(() => process.exit());
};
