import test from 'tapped';
import Carafe from '../';

let di;

test('inject setup', t => {
  di = new Carafe();
  di.register('test1', () => 'test 1');
  di.register('test2', () => 'test 2');
  t.end();
});

test('throws without an array', t => {
  t.plan(1);
  t.throws(() => di.inject('test1', () => {}), new RegExp('Dependency list must be an array'));
});

test('throws on invalid dependency', t => {
  t.plan(1);
  const invalidName = 'not a real depenency';

  // create the injected function
  const injectedFn = di.inject([invalidName], () => {});

  t.throws(() => injectedFn(), new RegExp(`Dependency not defined: ${invalidName}`));
});

test('injects provided dependencies', t => {
  t.plan(2);

  // create the injected function
  const injectedFn = di.inject(['test1', 'test2'], (t1, t2) => {
    t.equal(t1(), 'test 1');
    t.equal(t2(), 'test 2');
  });

  // call the function so the tests execute
  injectedFn();
});

test('passes additional args', t => {
  t.plan(1);

  const injectedFn = di.inject(['test1'], (t1, prefix) => `${prefix}: ${t1()}`);

  t.equal(injectedFn('output'), 'output: test 1');
});

test('works with replace', t => {
  t.plan(2);
  const di2 = new Carafe(true);

  di2.register('test1', () => 'test 1');
  const injectedFn = di2.inject(['test1'], (t1, prefix) => `${prefix}: ${t1()}`);

  // check the replaced value
  di2.replace('test1', () => 'hello world');
  t.equal(injectedFn('output'), 'output: hello world');

  // check the restored output
  di2.restore();
  t.equal(injectedFn('output'), 'output: test 1');
});
