#!/usr/bin/env node

const sywac = require('sywac');

const lib = require('./lib');

sywac
  .array('-d, --debug', { desc: 'Debug mode' })
  .help('-h, --help')
  .version('-v, --version')
  .outputSettings({ maxWidth: 100 })
  .showHelpByDefault()

  .command('serve', {
    desc: 'Start the server',
    setup: sywac => {
      sywac.number('-p, --port', {
        desc: 'Port',
        defaultValue: lib.DEFAULTS.port,
      });
    },
    run: argv => {
      lib.serve(argv.port, argv.debug.length);
    },
  })

  .command('eval', {
    desc: 'Evaluate the expression supplied through CLI',
    setup: sywac => {
      sywac
        .positional('<expression>', {
          paramsDesc: 'Expression to evaluate',
        })
        .positional('[...values]', { paramsDesc: 'Values to use, in format name=value (eg. x=2)' });
    },
    run: argv => {
      if (argv.values[0] === undefined) {
        argv.values = [];
      }
      const values = lib.valuesFromPairs(argv.values);
      lib.evaluateToStdOut(argv.expression, values, argv.debug.length);
    },
  })

  .parseAndExit();
