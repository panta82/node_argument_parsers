#!/usr/bin/env node

const { ArgumentParser, Const } = require('argparse');

const lib = require('./lib');

const parser = new ArgumentParser({
  version: require('../package').version,
  addHelp: true,
  description: lib.INFO.description,
});

parser.formatHelp = ((pFormatHelp) => {
	return function () {
		return pFormatHelp()
			+ '\nSyntax:\n'
			+ lib.INFO.syntax
				.split('\n')
				.map(line => '  ' + line)
				.join('\n')
			+ '\n'
	};
})(
	parser.formatHelp.bind(parser)
);

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

if (args.command === 'serve') {
	lib.serve(args.port, args.debug);
}
else if (args.command === 'eval') {
	const values = lib.valuesFromPairs(args.values);
	lib.evaluateToStdOut(args.expression[0], values);
}