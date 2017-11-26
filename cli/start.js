'use strict';

exports.command = 'start';
exports.describe = 'Start daemon in background';
exports.builder = {
};

exports.handler = function(argv) {
	require('../daemon').start();
};
