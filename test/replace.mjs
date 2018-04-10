import test from 'tape';
import Carafe from '../';

let di;
const name = 'replacable';
const expected = 'replacable output';

test('setup', t => {
  di = new Carafe();
  t.end();
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

test('replaces dependency', t => {
  t.plan(2);
  const expectedReplacement = 'replacement output';
  di.add(name, () => expected);
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

  di.add('_one_', () => '_one_');
  di.add('_two_', () => '_two_');
  di.add('_three_', () => '_three_');

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

  di.add('replace me', () => 'replace me');
  di.replace('replace me', () => 'replace me 1');
  di.replace('replace me', () => 'replace me 2');
  di.replace('replace me', () => 'replace me 3');

  // check for the latest replacement value
  t.equal(di.get('replace me')(), 'replace me 3');

  di.restore();
  t.equal(di.get('replace me')(), 'replace me');
});
