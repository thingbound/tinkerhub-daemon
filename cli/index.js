#!/usr/bin/env node
'use strict';

require('yargs')
    .usage('$0 <cmd> [args]')
    .commandDir(__dirname)
    .demandCommand(1, 'A command is required to do anything useful')
    .help()
    .argv;
