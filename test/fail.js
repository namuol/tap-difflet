/* Modules */

var test = require('tape');

/* Tests */

test('1 === 2', function(assert) {
  assert.plan(1);
  setTimeout(function () {
    assert.equal(1, 2);
  }, 500);
});

test('2 === 1', function(assert) {
  assert.plan(1);
  setTimeout(function () {
    assert.equal(2, 1);
  }, 500);
});

test('{a: 404} === {a: 42}', function(assert) {
  assert.plan(1);
  setTimeout(function () {
    assert.deepEqual({a: 404}, {a: 42});
  }, 500);
});

test('"Hell, world!" === "Hello, world!"', function(assert) {
  assert.plan(1);
  setTimeout(function () {
    assert.equal("Hell, world!", "Hello, world!");
  }, 500);
})
