const http = require('http');
const libPath = require('path');
const Parser = require('expr-eval').Parser;

const INFO = {
  title: 'Expression evaluator',
  description: 'Evaluator for math expressions with variable support, in terminal or through HTTP',
  syntax: `
The parser accepts a pretty basic grammar. It's similar to normal JavaScript expressions, but is more math-oriented.
For example, the ^ operator is exponentiation, not xor.

Operators (in order of precendence):
(...)                        Grouping
f(), x.y                     Function call, property access
!                            Factorial
^                            Exponentiation
+, -, not, sqrt, round...    Unary prefix operators
*, /, %                      Multiplication, division, remainder
+, -, ||                     Addition, subtraction, concatenation
==, !=, >=, <=, >, <, in     Equals, not equals, etc. "in" means "is the left operand included in the right array operand?" (disabled by default)
and                          Logical AND
or                           Logical OR
x ? y : z                    Ternary conditional (if x then y else z)
`.trim(),
};

const DEFAULTS = {
  port: 3000,
  debug: 0,
};

function evaluateToStdOut(input, values = undefined, debugLevel = DEFAULTS.debug) {
  const expr = Parser.parse(input);
  const placeholders = expr.variables();

  // In a simple case, just evaluate the thing once
  if (values || !placeholders.length) {
    evaluate(values);
    return;
  }

  // Otherwise, read them from stdin and evaluate line by line, until the end
  const readline = require('readline');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  rl.on('line', line => {
    const values = {};
    line.split(',').forEach((val, index) => {
      values[placeholders[index]] = val;
    });
    evaluate(values);
  });

  function evaluate(values) {
    if (debugLevel > 0) {
      let debugOut = '[DEBUG] ';
      if (debugLevel > 1) {
        debugOut += expr.toString() + ' ==> ';
      }
      debugOut += JSON.stringify(values);
      console.log(debugOut);
    }
    console.log(expr.evaluate(values));
  }
}

function serve(port, debugLevel = DEFAULTS.debug) {
  console.log(`Debug level: ${debugLevel}`);

  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');

  port = port || process.env.PORT || DEFAULTS.port;

  const app = express();
  app.use(bodyParser.json());
  app.use(cors());

  if (debugLevel > 0) {
    app.use((req, res, next) => {
      console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
      next();
    });
  }

  app.get('/', (req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.send(
      `
<html>
<head>${INFO.title}</head>
<body>
<h1>${INFO.title}</h1>

<h4>${INFO.description}</h4>

<p>Call GET /evaluate/:expression to evaluate your expression. Variables can go to query params.</p>

<p>In case of complex equations, you can use PUT /evaluate endpoint and put your data in JSON payload,
under keys "expression" and "values".</p>

<h4>Syntax:</h4>

<div><pre>${INFO.syntax}</pre></div>
</body>
</html>
`
    );
  });

  app.get('/evaluate/:expression', (req, res) => {
    const expr = Parser.parse(req.params.expression);
    const result = expr.evaluate(req.query);
    if (debugLevel > 1) {
      console.log('[DEBUG]', expr.toString(), ' ==> ', JSON.stringify(req.query), ' ==> ', result);
    }
    res.send({
      result,
    });
  });

  app.put('/evaluate', (req, res) => {
    const { expression, values } = req.body;
    const result = Parser.evaluate(expression, values);
    res.send({
      result,
    });
  });

  const server = http.createServer(app);
  server.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`);
  });
}

module.exports = {
  INFO,
  DEFAULTS,

  evaluateToStdOut,
  serve,
};
