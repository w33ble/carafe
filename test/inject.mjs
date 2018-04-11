import test from 'tape';
import Carafe from '../';

let di;

test('setup', t => {
  di = new Carafe();
  di.add('test1', () => 'test 1');
  di.add('test2', () => 'test 2');
  t.end();
});

test('throws without an array', t => {
  t.plan(1);
  t.throws(() => di.inject('test1', () => {}), new RegExp('Dependency list must be an array'));
});

test('throws on invalid dependency', t => {
  t.plan(1);
  const invalidName = 'not a real depenency';
  t.throws(
    () => di.inject([invalidName], () => {}),
    new RegExp(`Dependency not defined: ${invalidName}`)
  );
});

test('injects provided dependencies', t => {
  t.plan(2);
  di.inject(['test1', 'test2'], (t1, t2) => {
    t.equal(t1(), 'test 1');
    t.equal(t2(), 'test 2');
  });
});
