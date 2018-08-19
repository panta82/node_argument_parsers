#!/usr/bin/env node

const { ArgumentParser } = require('argparse');

const lib = require('./lib');

const parser = new ArgumentParser({
  version: require('../package').version,
  addHelp: true,
  description: lib.INFO.description,
});

parser.addArgument(['-d', '--debug'], {
  help: `Debug mode (add twice for verbose debug`,
  defaultValue: 0,
  action: 'count',
});

const subparsers = parser.addSubparsers({
  title: 'Commands',
  dest: 'command',
	help: 'Command to execute. Call with "-h" for details.',
	required: false
});

const serve = subparsers.addParser('serve', {
  addHelp: true,
});

serve.addArgument(['-p', '--port'], {
  help: 'Port to serve on',
  defaultValue: lib.DEFAULTS.port,
});

const eval = subparsers.addParser('eval', {
	addHelp: true,
});

eval.addArgument('expression', {
	help: 'Expression to evaluate',
	nargs: 1
});

eval.addArgument('values', {
	help: 'Values to use, in format name=value (eg. x=2)',
	nargs: '*'
});

const args = parser.parseArgs();
if (args.help) {
  parser.printHelp();
  console.log('\nSyntax help:');
  console.log(
    lib.INFO.syntax
      .split('\n')
      .map(line => '  ' + line)
      .join('\n')
  );
  process.exit(0);
}

console.log(args);

/*
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
*/
