#!/usr/bin/env node

const Optionator = require('optionator');

const lib = require('./lib');

const optionator = Optionator({
  prepend: `
${lib.INFO.title} (v${require('../package').version})
${lib.INFO.description}

USAGE:

  optionator.js [options] [command] [key=value...]

ARGUMENTS:`,
  append: `SYNTAX:

${lib.INFO.syntax
    .split('\n')
    .map(line => '  ' + line)
    .join('\n')}
`,
  options: [
    {
      option: 'help',
      alias: 'h',
      type: 'Boolean',
      description: 'Displays this help screen',
    },
    {
      option: 'debug',
      alias: 'd',
      type: 'Boolean',
      description: 'Debug mode',
    },
    {
      option: 'dd',
      type: 'Boolean',
      description: 'Verboose debug mode',
    },
    {
      option: 'serve',
      type: 'Boolean',
      description: 'Start an eval web server',
    },
    {
      option: 'port',
      alias: 'p',
      type: 'Number',
      default: String(lib.DEFAULTS.port),
      description: 'Server port',
      dependsOn: ['serve'],
    },
  ],
});

const options = optionator.parseArgv(process.argv);
if (options.help) {
  showHelp();
}

const debugLevel = options.dd ? 2 : options.debug ? 1 : 0;

if (options.serve) {
  lib.serve(options.port, debugLevel);
} else {
  const expression = options._[0];
  if (!expression) {
    showHelp();
  }
  const values = lib.valuesFromPairs(options._.slice(1));
  lib.evaluateToStdOut(expression, values, debugLevel);
}

function showHelp() {
  console.log(optionator.generateHelp());
  process.exit(0);
}
