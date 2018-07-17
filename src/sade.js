#!/usr/bin/env node

const sade = require('sade');

const lib = require('./lib');

const prog = sade('expr');

prog.version(require('../package').version).option('--debug, -d', 'Debug output');

prog
  .command(
    'eval <expression> [values...]',
    'Evaluate the expression supplied through CLI (default)',
    {
      default: true,
    }
  )
  .action((expression, value, opts) => {
    if (value) {
      opts._.unshift(value);
    }
    const values = lib.valuesFromPairs(opts._);

    lib.evaluateToStdOut(expression, values, getDebugLevel(opts));
  });

prog
  .command('serve', 'Start the server')
  .option('--port, -p', 'Port to serve on', lib.DEFAULTS.port)
  .action(opts => {
    lib.serve(opts.port, getDebugLevel(opts));
  });

prog.parse(process.argv);

function getDebugLevel(opts) {
  return opts.debug ? opts.debug.length || (opts.debug && 1) || 0 : 0;
}
