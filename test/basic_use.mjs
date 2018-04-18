import test from 'tape';
import Carafe from '../';

let di;

test('basic use setup', t => {
  di = new Carafe();
  t.end();
});

test('throws getting undefined dependencies', t => {
  t.plan(1);
  t.throws(() => di.get('nada'));
});

test('throws adding non-string dependencies', t => {
  t.plan(4);
  t.throws(() => di.register({}), new RegExp('Dependency name must be a string'));
  t.throws(() => di.register([]), new RegExp('Dependency name must be a string'));
  t.throws(() => di.register(() => {}), new RegExp('Dependency name must be a string'));
  t.doesNotThrow(() => di.register('string'));
});

test('throws adding a dependency twice', t => {
  t.plan(2);
  t.doesNotThrow(() => di.register('string2'));
  t.throws(() => di.register('string2'), new RegExp('Dependency already defined'));
});

test('creates instance when called as a function', t => {
  t.plan(2);
  const deps = Carafe();
  const deps2 = Carafe();
  t.notEqual(deps, deps2);
  t.ok(typeof deps === 'object', 'should be an object');
});

test('adds and gets dependencies', t => {
  t.plan(1);

  const name = 'test';
  const expected = 'test output';
  di.register(name, () => expected);
  t.equal(di.get(name)(), expected);
});
