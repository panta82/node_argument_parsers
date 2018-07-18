#!/usr/bin/env node

const lib = require('./lib');

const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');

const COMMANDS = {
  eval: 'eval',
  serve: 'serve',
};

const defs = {
  common: [
    {
      name: 'debug',
      alias: 'd',
      multiple: true,
      type: Boolean,
      description: 'Debug mode (twice for verbose debug)',
    },
    { name: 'help', alias: 'h', type: Boolean, description: 'Show help' },
  ],
  serve: [
    {
      name: 'port',
      alias: 'p',
      type: Number,
      description: 'Port to serve on',
      defaultValue: lib.DEFAULTS.port,
    },
  ],
};

const opts = commandLineArgs(defs.common.concat({ name: 'command', defaultOption: true }), {
  partial: true,
});

if (opts.help || !opts.command) {
  showHelp();
}

const debugLevel = (opts.debug || []).length;

if (opts.command === COMMANDS.serve) {
  Object.assign(opts, commandLineArgs(defs.serve, { argv: opts._unknown || [] }));
  lib.serve(opts.port, debugLevel);
} else {
  // Parse the rest of command
  const expression = opts.command;
  const values = lib.valuesFromPairs(opts._unknown);
  lib.evaluateToStdOut(expression, values, debugLevel);
}

function showHelp() {
  const sections = [
    {
      header: lib.INFO.title,
      content: lib.INFO.description + '\n\nVersion: ' + require('../package').version,
    },
    {
      header: 'Usage',
      content: [
        {
          name: `$ app <expression> [name=value ...]`,
          summary: 'Evaluate the expression supplied through CLI',
        },
        { name: `$ app serve`, summary: 'Start the server' },
      ],
    },
    {
      header: 'Command: evaluate',
      content: [
        {
          name: `<expression>`,
          summary: 'Expression to evaluate (for example "x+5")',
        },
        {
          name: `[name=value...]`,
          summary: 'Values to use, in format name=value (eg. x=2)',
        },
      ],
    },
    {
      header: 'Command: serve',
      optionList: defs.serve,
    },
    {
      header: 'Global flags',
      optionList: defs.common,
    },
    {
      header: 'Syntax',
      content: lib.INFO.syntax,
    },
  ];

  console.log(commandLineUsage(sections));
  process.exit(0);
}
