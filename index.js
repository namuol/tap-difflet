var parser    = require('tap-parser-yaml');
var through   = require('through2');
var duplexer  = require('duplexer');
var hirestime = require('hirestime');
var prettyms  = require('pretty-ms');
var chalk     = require('chalk');
var objdiff   = require('difflet')({
  indent: 2,
  comment: true
}).compare;
var ansidiff  = require('ansidiff');


module.exports = function (options) {
  if (!options) options = {};

  var tap = parser();
  var out = through();
  var dup = duplexer(tap, out);

  if (options.pessimistic) {
    var anAssertFailed = true;
    var originalOut = out;
    var buffer = null;
    tap.on('comment', function (comment) {
      if (buffer && anAssertFailed) {
        for (var bi = 0; bi < buffer.length; ++bi) {
          originalOut.push(buffer[bi]);
        }
      }

      buffer = null;
      anAssertFailed = false;
      out = originalOut;

      if (getCommentType(comment) === CommentType.OTHER) {
        buffer = [];
        out = buffer;
      }
    });

    tap.on('assert', function (res) {
      if (!res.ok) {
        anAssertFailed = true;
      }
    });
  }

  /* Helpers */
  var CommentType = {
    OTHER: 1,
    TESTS: 2,
    PASS: 3,
    FAIL: 4,
    OK: 5
  };

  function getCommentType(comment) {
    if (/^tests\s+[0-9]+$/gi.test(comment)) {
      return CommentType.TESTS;
    }
    else if (/^pass\s+[0-9]+$/gi.test(comment)) {
      return CommentType.PASS;
    }
    else if (/^fail\s+[0-9]+$/gi.test(comment)) {
      return CommentType.FAIL;
    }
    else if (/^ok$/gi.test(comment)) {
      return CommentType.OK;
    }
    else {
      return CommentType.OTHER;
    }
  };

  function output(str) {
    out.push(str);
  }

  /* Parser */

  var timer = hirestime();
  var errors = [];

  tap.on('comment', function (comment) {
    var commentType = getCommentType(comment);
    if (commentType === CommentType.TESTS
      || commentType === CommentType.OK
      || commentType === CommentType.PASS
      || commentType === CommentType.FAIL) {
      return;
    }

    output('\n  ' + chalk.white.bold(comment) + '\n');
  });

  tap.on('assert', function (res) {
    if (res.ok) {
      output('    ' + chalk.green.bold('✓') + ' ' + chalk.gray(res.name) + '\n');
    } else {
      assert = chalk.red.bold('⨯ ' + res.name + '\n');
      errors.push(chalk.white(assert));
      output('    ' + errors[errors.length - 1]);
    }
  });

  tap.on('extra', function (res) {
    if (res !== '') {
      if (res.indexOf('---') === 0) {
        errors.push(chalk.gray(res));
        output(errors[errors.length - 1]);
        output('\n');
      } else {
        output('    ' + chalk.blue(res));
        output('\n');
      }
    }
  });

  tap.on('results', function (res) {
    var count = res.asserts.length;
    var time = prettyms(timer());
    output('\n');

    if (errors.length) {
      output(chalk.red.bold(errors.length + ' failing\n'));
    }
    output(chalk.green.bold(Math.max(0, count - errors.length) + ' passing') + chalk.gray(' (' + time + ')'));

    output('\n\n');
  });

  tap.on('diag', function (diag) {
    var expected, actual, at,
      gotExpected = true,
      gotActual = true,
      gotAt = true,
      str = '';

    if (diag.hasOwnProperty('expected')) {
      expected = diag.expected;
    } else if (diag.hasOwnProperty('wanted')) {
      expected = diag.wanted;
    } else {
      gotExpected = false;
    }

    if (diag.hasOwnProperty('actual')) {
      actual = diag.actual;
    } else if (diag.hasOwnProperty('found')) {
      actual = diag.found;
    } else {
      gotActual = false;
    }

    if (diag.hasOwnProperty('at')) {
      at = diag.at;
    }
    else {
      gotAt = false;
    }

    if (gotActual && gotExpected) {
      if (typeof expected !== typeof actual ||
        typeof expected === 'object' && (!actual || !expected)) {
        str = 'Expected ' + typeof expected + ' but got ' + typeof actual;
      } else if (typeof expected === 'string') {
        if (str.indexOf('\n') >= 0) {
          str = ansidiff.lines(expected, actual);
        } else {
          str = ansidiff.chars(expected, actual);
        }
      } else if (typeof expected === 'object') {
        str = objdiff(expected, actual);
      } else {
        str = chalk.white('Expected ') + chalk.bold('' + expected) + chalk.white(' but got ') + chalk.bold('' + actual);
      }
    }

    if (gotAt) {
      str = str + '\n\n' + chalk.grey('At: ' + at);
    }

    if (str) {
      str = '\n' + str;
      str = str.replace(/\n/g, '\n      ');
      errors[errors.length - 1] += str;
      output(str);
      output('\n');
    }

  });

  dup._errors = errors;

  return dup;
};
