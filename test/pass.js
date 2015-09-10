/* Modules */

var test = require('tape');

/* Tests */

test('1 === 1', function(assert) {
  assert.plan(1);
  assert.equal(1, 1);
});

test('2 === 2', function(assert) {
  assert.plan(1);
  assert.equal(2, 2);
});

test('Does not error with comment', function(assert){
  assert.plan(1);
  console.log('a comment');
  assert.pass('can console.log');
})
