import test from 'tape';
import Carafe from '../';

let di;

test('setup', t => {
  di = new Carafe();
  t.end();
});

test('throws getting undefined dependencies', t => {
  t.plan(1);
  t.throws(() => di.get('nada'));
});

test('throws adding non-string dependencies', t => {
  t.plan(4);
  t.throws(() => di.add({}), new RegExp('Dependency name must be a string'));
  t.throws(() => di.add([]), new RegExp('Dependency name must be a string'));
  t.throws(() => di.add(() => {}), new RegExp('Dependency name must be a string'));
  t.doesNotThrow(() => di.add('string'));
});

test('throws adding a dependency twice', t => {
  t.plan(2);
  t.doesNotThrow(() => di.add('string2'));
  t.throws(() => di.add('string2'), new RegExp('Dependency already defined'));
});

test('adds and gets dependencies', t => {
  t.plan(1);

  const name = 'test';
  const expected = 'test output';
  di.add(name, () => expected);
  t.equal(di.get(name)(), expected);
});