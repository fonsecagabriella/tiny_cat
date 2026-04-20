// tests/run.js — Node test runner for cat.js test suites
// Loads js/cat.js globals via vm and runs both test files in isolated contexts.
// Exits with code 1 if any test fails.

var fs  = require('fs');
var vm  = require('vm');
var cat = fs.readFileSync('js/cat.js', 'utf8');

var suites = [
  ['game.test.js', fs.readFileSync('tests/game.test.js', 'utf8')],
  ['cat.test.js',  fs.readFileSync('tests/cat.test.js',  'utf8')],
];

var totalFailed = 0;

suites.forEach(function (suite) {
  var name = suite[0];
  var src  = suite[1];
  var ctx  = vm.createContext({ console: console, Math: Math, process: process });
  try {
    vm.runInContext(cat + '\n' + src, ctx);
    totalFailed += ctx.failed || 0;
  } catch (e) {
    console.error('Suite "' + name + '" threw: ' + e.message);
    totalFailed++;
  }
});

process.exit(totalFailed > 0 ? 1 : 0);
