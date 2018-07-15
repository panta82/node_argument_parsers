#!/usr/bin/env node

const lib = require('./lib');

const program = require('commander');

program
  .version(require('../package').version)
  .description(lib.INFO.description)
  .option('-d, --debug', 'Debug mode (add twice for verbose debug)', (_, debug) => debug + 1, 0);

let executed = false;

program
  .command('serve')
  .description('Start the server')
  .option(
    '-p, --port <port>',
    `Port to serve on (default: ${lib.DEFAULTS.port})`,
    p => Number(p) || undefined
  )
  .action(cmd => {
    executed = true;
    lib.serve(cmd.port, program.debug);
  });

program
  .command('* <expression> [values...]')
  .description(`Evaluate the expression supplied through CLI`)
  .action((expression, valuePairs) => {
    executed = true;
    const values = lib.valuesFromPairs(valuePairs);
    lib.evaluateToStdOut(expression, values, program.debug);
  });

program.on('--help', () => {
  console.log();
  console.log('  Syntax:');
  console.log();
  console.log(
    lib.INFO.syntax
      .split('\n')
      .map(line => '    ' + line)
      .join('\n')
  );
  console.log();
});

program.parse(process.argv);

if (!executed) {
  program.outputHelp();
}
