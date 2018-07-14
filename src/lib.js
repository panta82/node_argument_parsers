const http = require('http');
const libPath = require('path');
const Parser = require('expr-eval').Parser;

const DEFAULTS = {
	port: 3000,
};

function evaluateToStdOut(input, values = undefined) {
	const expr = Parser.parse(input);
	const placeholders = expr.variables();
	
	// In a simple case, just evaluate the thing once
	if (values || !placeholders.length) {
		console.log(expr.evaluate(values));
		return;
	}
	
	// Otherwise, read them from stdin and evaluate line by line, until the end
	const readline = require('readline');
	
	const rl = readline.createInterface({
		input: process.stdin,
		output: process.stdout,
		terminal: false
	});
	
	rl.on('line', line => {
		const values = {};
		line.split(',').forEach((val, index) => {
			values[placeholders[index]] = val;
		});
		console.log(expr.evaluate(values));
	});
}

function serve(port) {
	const express = require('express');
	const bodyParser = require('body-parser');
	const cors = require('cors');
	
	port = port || process.env.PORT || DEFAULTS.port;
	
	const app = express();
	app.use(bodyParser.json());
	app.use(cors());
	
	app.get('/', (req, res) => {
		res.setHeader('Content-Type', 'text/plain');
		res.send('Test');
	});
	
	app.get('/evaluate/:expression', (req, res) => {
		const result = Parser.evaluate(req.params.expression, req.query);
		res.send({
			result
		});
	});
	
	app.put('/evaluate', (req, res) => {
		const {expression, values} = req.body;
		const result = Parser.evaluate(expression, values);
		res.send({
			result
		});
	});
	
	const server = http.createServer(app);
	server.listen(port, () => {
		console.log(`Listening on http://localhost:${port}`);
	});
}

module.exports = {
	DEFAULTS,
	evaluateToStdOut,
	serve
};