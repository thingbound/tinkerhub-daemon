'use strict';

exports.command = 'stop';
exports.describe = 'Stop daemon in background';
exports.builder = {
};

exports.handler = function(argv) {
	require('../daemon').stop();
};
