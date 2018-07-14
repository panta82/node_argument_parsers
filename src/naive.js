#!/usr/bin/env node

const lib = require('./lib');

const argv = process.argv.slice(2);

if (argv[0] === 'serve') {
	lib.serve();
}
else {
	lib.evaluateToStdOut(argv[0]);
}