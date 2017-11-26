'use strict';

const path = require('path');
const userData = require('./user-data');

module.exports = require('daemonize2').setup({
	main: 'index.js',
	name: 'tinkerhubd',
	pidfile: path.join(userData, 'tinkerhubd.pid')
});
