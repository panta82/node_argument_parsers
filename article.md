# Node.js argument parsers in 2018 - ...

Deprecated contenders:
- https://github.com/harthur/nomnom
- https://github.com/substack/node-optimist

Contenders:
- http://yargs.js.org/
- https://github.com/tj/commander.js
- https://github.com/substack/minimist
- https://github.com/leo/args
- https://github.com/nodeca/argparse

## Goals

I want an app I can use like this:

Command|What happens
-------|------------
`app -h`|Help screen is shown. It should also work with `--help`.
`app '(x*5)/y'`|Start the app in STDIN mode. Given expression will be executed for each input line (treated as CSV of values in the order they appear inside the expression)
`app '(x*5)/y' x=5 y=7`|In this mode, the command is immediately executed using any number of `var=value` arguments that come at the end.
`app -dd`|Start the app in verbose debug mode (`-d` for normal debug mode). This switch should apply globally, for either web server or CLI use case.
`app serve -p 12345`|Start expression evaluator web server. Note that -p argument only makes sense here. It shouldn't be applicable to the CLI use case.


## commander.js

`commander` | [![github](static/github.png)](https://github.com/tj/commander.js) &nbsp; [![github](static/npm.png)](https://www.npmjs.com/package/commander)
|-----|----|
Stars | 11,869
Forks | 907
Downloads / week | 11,262,368
Dependencies | [0](http://npm.broofa.com/?q=commander)
Licenses | MIT

The strongest github presence. One of "the big two". Inspired by Ruby's [commander](https://github.com/commander-rb/commander).

I get a strong stench of a legacy project, where more and more features have been added over the years, distorting the original API surface of the project.

If you do
```
program.command('cmd', 'My command')
```
`"My command"` will "tell" commander you want a git-style command. This is a terrible and non-intuitive API. It's a minefield.

`isDefault` is supposed to make a certain subcommand the default. However, it seems to only be working with git-style commands (where name of the command is directly mapped to an executable on HDD). It doesn't work with `action` style callbacks.

Another way to have "default" command is to name the command `"*"`. That leaves ugly help screen, though.

Common options will be attached on the `program` object, command specific switches will go to the `cmd` argument. It was a bit confusing at first, but it makes sense now that I think about it.

Upsides:

- Has commands and default commands
- Has auto-help generation with description and version number
- You can collect multiple arguments using reduce-like syntax (very neat)
- Very good typings


Downsides:

- Clumsy way to specify long and short parameter names (you can't have a short option without a corresponding long version)
- No concept of default value. You have to insert it into the help text manually (eg. `.option('-p, --port', 'Port to serve on (default: 3000)')`)
- Git-style subcommands were a design mistake.
- Ugly help screen for "*" commands.

Conclusion:

A decent choice, but surely we can do better?

![](static/commander.png)

## Rejected contenders

### Minimist

`minimist` | [![github](static/github.png)](https://github.com/substack/minimist) &nbsp; [![github](static/npm.png)](https://www.npmjs.com/package/minimist)
|-----|----|
Stars | 3,055
Forks | 172
Downloads / week | 13,222,137
Dependencies | [0](http://npm.broofa.com/?q=minimist)
Licenses | MIT

A venerable and extremely popular library. It has two problems, though:

1. Last updated in 2015
2. No option definitions at all

To clarify the second point, you use minimist like this:

```javascript
var argv = require('minimist')(process.argv.slice(2));
console.dir(argv);
```

```bash
$ node example/parse.js -a beep -b boop
{ _: [], a: 'beep', b: 'boop' }
```

Instead of giving it option definitions, you just call it against arguments and it then tries to guess what they mean and packages them into an object. So, no varargs, no help screens, no validation. I'd have to build all of that manually on top of it.

I've decided that's too barebones for what I want out of an argument parser library. Therefore minimist is out. Buckle up, it won't be the last one to go due to this reason.