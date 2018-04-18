import test from 'tape';
import Carafe from '../';

let di;
const name = 'replacable';
const expected = 'replacable output';

test('replace setup', t => {
  di = new Carafe(true);
  t.end();
});

test('throws when replace is not enabled', t => {
  t.plan(1);

  // replace is off by default
  const di2 = new Carafe();

  di2.register('test', 'test');
  t.throws(() => di2.replace('test', 'something else'), /replace\ is\ not\ a\ function/);
});

test('throws on undefined dependencies', t => {
  t.plan(1);
  t.throws(
    () => di.replace('yoyoy ma', () => expected),
    new RegExp('Can not replace undefined dependency')
  );
});

test('does not throw on unreplaced dependencies', t => {
  t.plan(1);
  t.doesNotThrow(() => di.restore('has not been replaced'));
});

test('warns about type mismatch', t => {
  t.plan(5);

  // spy on console.warn
  let warnings;
  const originalWarn = console.warn;
  console.warn = (...args) => {
    warnings = args;
    // originalWarn(...args);
  };

  // warning message helper
  const checkWarning = (type, msg) => {
    const warning = `WARN: replacement payload type does not match original: ${type}`;
    t.equal(warnings[0], warning, msg);
  };

  // test replacing various types
  di.register('function', () => {});
  di.register('string', 'example');
  di.register('array', [1, 2, 3]);
  di.register('null', null);
  di.register('object', { example: true });

  di.replace('function', 'string');
  checkWarning('function', 'should warn about function type');

  di.replace('string', () => {});
  checkWarning('string', 'should warn about string type');

  di.replace('array', { object: true });
  checkWarning('array', 'should warn about array type');

  di.replace('null', undefined);
  checkWarning('null', 'should warn about null type');

  di.replace('object', ['array']);
  checkWarning('object', 'should warn about object type');

  // restore the console
  console.warn = originalWarn;
});

test('replaces dependency', t => {
  t.plan(2);
  const expectedReplacement = 'replacement output';
  di.register(name, () => expected);
  t.equal(di.get(name)(), expected);

  di.replace(name, () => expectedReplacement);
  t.equal(di.get(name)(), expectedReplacement);
});

test('restores dependency by name', t => {
  t.plan(1);
  di.restore(name);
  t.equal(di.get(name)(), expected);
});

test('restores all dependencies', t => {
  t.plan(6);

  di.register('_one_', () => '_one_');
  di.register('_two_', () => '_two_');
  di.register('_three_', () => '_three_');

  // replace all dependencies
  di.replace('_one_', () => 'replaced _one_');
  di.replace('_two_', () => 'replaced _two_');
  di.replace('_three_', () => 'replaced _three_');

  // check replaced output
  t.equal(di.get('_one_')(), 'replaced _one_');
  t.equal(di.get('_two_')(), 'replaced _two_');
  t.equal(di.get('_three_')(), 'replaced _three_');

  // restore all dependencies
  di.restore();

  // check original values
  t.equal(di.get('_one_')(), '_one_');
  t.equal(di.get('_two_')(), '_two_');
  t.equal(di.get('_three_')(), '_three_');
});

test('works with multiple replace calls', t => {
  t.plan(2);

  di.register('replace me', () => 'replace me');
  di.replace('replace me', () => 'replace me 1');
  di.replace('replace me', () => 'replace me 2');
  di.replace('replace me', () => 'replace me 3');

  // check for the latest replacement value
  t.equal(di.get('replace me')(), 'replace me 3');

  di.restore();
  t.equal(di.get('replace me')(), 'replace me');
});
