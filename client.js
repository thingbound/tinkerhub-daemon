'use strict';

const th = require('tinkerhub/endpoint');

module.exports = function() {
	return th.machineId()
		.then(id => {
			const c = th.get('daemon:' + id);

			if(c.length === 0) {
				return new Promise((resolve, reject) => {
					let count = 0;
					const check = () => {
						if(c.length > 0) {
							for(const t of c) {
								resolve(t);
							}
						} else if(count === 10) {
							reject(new Error('Daemon not running or not responding'));
						} else {
							count++;
							setTimeout(check, 100);
						}
					};

					check();
				});
			} else {
				return c;
			}
		});
};
