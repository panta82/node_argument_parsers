#!/usr/bin/env node

const lib = require('./lib');

const yargs = require('yargs');

yargs
  .usage(lib.INFO.description)
  .version()
  .alias('h', 'help')
  .epilog(
    'Syntax:\n' +
      lib.INFO.syntax
        .split('\n')
        .map(line => '  ' + line)
        .join('\n')
  )
  .completion('completion')

  .option('debug', {
    alias: 'd',
    describe: 'Debug mode',
    count: true,
  })

  .command(
    'serve',
    'Start the server (-h for details)',
    args => {
      args
        .completion('completion')
        .option('port', {
          describe: `Port to serve on`,
          default: lib.DEFAULTS.port,
          alias: 'p',
          type: 'number',
        })
        .example('$0 serve -p 8080 -d');
    },
    argv => {
      lib.serve(argv.port, argv.debug);
    }
  )

  .command(
    ['eval', '$0'],
    'Evaluate the expression supplied through CLI',
    args => {
      args
        .completion('completion')
        .positional('expression', {
          describe: 'Expression to evaluate (for example "x+5")',
        })
        .positional('values..', {
          describe: 'Values to use, in format name=value (eg. x=2)',
        })
        .example(`$0 '(x+5)/y' x=5 y=2`);
    },
    argv => {
      if (!argv._.length) {
        console.log('No expression given. Try calling with --help for usage instructions');
        return;
      }

      const [expression, ...valuePairs] = argv._;

      const values = lib.valuesFromPairs(valuePairs);
      lib.evaluateToStdOut(expression, values, argv.debug);
    }
  )

  .parse();
