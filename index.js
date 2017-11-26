'use strict';

const { Thing } = require('abstract-things');

const th = require('tinkerhub');
const os = require('os');
const path = require('path');

const forever = require('forever-monitor');

const Plugins = require('./plugins');
const storage = require('./storage');
const id = require('./id');

class Daemon extends Thing {

	static get type() {
		return 'daemon';
	}

	static availableAPI(builder) {
		builder.action('install')
			.description('Install a module')
			.done();

		builder.action('link')
			.description('Link a JS file to always run')
			.done();

		builder.action('plugins')
			.done();
	}

	constructor(packages) {
		super();

		this.metadata.name = os.hostname();

		this._monitors = new Map();
		this._plugins = new Plugins(storage, packages);

		process.on('SIGTERM', () => {
			this.stopAll()
				.then(() => process.exit());
		});
	}

	init() {
		return super.init()
			.then(() => id())
			.then(id => this.id = 'daemon:' + id)
			.then(() => this._plugins.init())
			.then(() => {
				for(const p of this._plugins.list()) {
					this._start(p);
				}
			})
			.then(() => this);
	}

	install(pkg) {
		return this._plugins.install(pkg)
			.then(pkg => this._start(pkg));
	}

	link(path) {
		return this._plugins.link(path)
			.then(pkg => this._start(pkg));
	}

	plugins() {
		return this._plugins.list();
	}

	_start(pkg) {
		let monitor = this._monitors.get(pkg.id);
		if(monitor) return;

		const runner = path.join(__dirname, 'runner.js');
		monitor = new forever.Monitor(runner, {
			args: [ pkg.path ],
			silent: true,

			killTree: true,

			spinSleepTime: 10000,
			minUptime: 2000
		});

		this._monitors.set(pkg.id, monitor);
		monitor.start();
	}

	stopAll() {
		const promises = [];
		for(const [ key, monitor ] of this._monitors) {
			if(monitor.running && monitor.child) {
				promises.push(new Promise(resolve => {
					monitor.once('exit', () => {
						this._monitors.delete(key);
						resolve();
					});

					monitor.stop();
					monitor.forceStop = true;
				}));
			}
		}
		return Promise.all(promises);
	}
}

const userData = require('./user-data');
new Daemon(userData)
	.init()
	.then(d => th.register(d))
	.catch(err => console.error('Could not start daemon;', err));

process.on('SIGINT', () => process.exit());
