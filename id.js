'use strict';

const storage = require('./storage');
const generateId = require('tinkerhub/lib/utils/id');

module.exports = function() {
	return storage.get('id')
		.then(id => {
			if(id) return id;

			id = generateId();
			return storage.set('id', id);
		});
}
