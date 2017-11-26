'use strict';

const path = require('path');
const mkdirp = require('mkdirp');

const AppDirectory = require('appdirectory');

const dirs = new AppDirectory('tinkerhub');
const data = dirs.userData();
mkdirp.sync(data);

module.exports = data;
