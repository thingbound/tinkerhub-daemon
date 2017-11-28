'use strict';

const npm = require('global-npm');
const path = require('path');

module.exports = class Plugins {
	constructor(storage, path) {
		this.storage = storage;
		this.path = path;
	}

	init() {
		return this.storage.get('tinkerhub:plugins')
			.then(data => {
				this._plugins = data || {};
			});
	}

	save() {
		return this.storage.set('tinkerhub:plugins', this._plugins);
	}

	mapPlugin(key, data) {
		let p;
		if(data.module) {
			p = path.join(this.path, 'node_modules', key);
		} else {
			p = data.file;
		}

		return {
			id: key,
			path: p
		};
	}

	list() {
		const result = [];
		for(const key of Object.keys(this._plugins)) {
			const data = this._plugins[key];

			result.push(this.mapPlugin(key, data));
		}
		return result;
	}

	install(name) {
		if(name.indexOf('tinkerhub-') !== 0) {
			name = 'tinkerhub-' + name;
		}

		return new Promise((resolve, reject) => {
			npm.load({ loglevel: 'silent' }, err => {
				if(err) {
					reject(err);
					return;
				}

				npm.prefix = this.path;
				npm.commands.install(this.path, [ name ], err => {
					if(err) {
						reject(err);
						return;
					}

					const data = this._plugins[name] = {
						module: true
					};

					this.save()
						.then(() => resolve(this.mapPlugin(name, data)))
						.catch(reject);
				});
			});
		});
	}

	link(path) {
		try {
			require.resolve(path);
		} catch(ex) {
			return Promise.reject(new Error('Path must exist'));
		}

		const data = this._plugins[path] = {
			file: path
		};

		return this.save()
			.then(() => this.mapPlugin(path, data));
	}
}
