#!/usr/bin/env node

const lib = require('./lib');

const prog = require('caporal');

prog
  .version(require('../package').version)
  .description(lib.INFO.description)
  .help(lib.INFO.syntax, {
    name: 'SYNTAX',
  })

  .argument('<expression>', 'Expression to evaluate (eg. "x+5")')
  .argument('[values...]', 'Values for the expression in format key=value (eg. x=3)')
  .action((args, options, logger) => {
    const level = getDebugLevel(logger);
    const values = lib.valuesFromPairs(args.values);

    lib.evaluateToStdOut(args.expression, values, level);
  })

  .command('serve', 'Start the server')
  .help('Start the expression evaluator HTTP server on a given port')
  .option('-p, --port', 'Port to serve on', prog.INT, lib.DEFAULTS.port)
  .action((args, options, logger) => {
    const level = getDebugLevel(logger);

    lib.serve(options.port, level);
  });

prog.parse(process.argv);

function getDebugLevel(logger) {
  const wLevel = logger.transports.caporal.level;
  if (wLevel === 'info') {
    return 1;
  }
  if (wLevel === 'debug') {
    return 2;
  }
  return 0;
}
