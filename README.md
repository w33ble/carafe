# carafe

Crazy simple dependency container.

> def.
> a wide-mouthed glass or metal bottle with a lip or spout, for holding and serving dependencies

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/w33ble/carafe/master/LICENSE)
[![Build Status](https://img.shields.io/travis/w33ble/carafe.svg?branch=master)](https://travis-ci.org/w33ble/carafe)
[![Coverage](https://img.shields.io/codecov/c/github/w33ble/carafe.svg)](https://codecov.io/gh/w33ble/carafe)
[![npm](https://img.shields.io/npm/v/carafe.svg)](https://www.npmjs.com/package/carafe)
[![Project Status](https://img.shields.io/badge/status-experimental-orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)

A little inspiration taken from [@travi/ioc](https://github.com/travi/ioc).

## Usage

Create a Carafe instance, add dependencies to it, and get them back out where needed.

```js
// simple dependency providing

// provider.mjs
import Carafe from 'carafe'

const container = new Carafe();
container.register('water', 'fresh and cool');
export default container;


// status.mjs
import container from 'provider.mjs';

// get happens in the function so it always gets the current value
const waterStatus = () => container.get('water');
export default waterStatus;


// status.mjs, alternatively using inject
import container from 'provider.mjs';

// the function returned always gets the updated dependency
const waterStatus = container.inject(['water'], (water) => water);
export default waterStatus;


// consumer.mjs
import status from 'status.mjs';
console.log(status()); // fresh and cool
```

You can also opt in to dependency replacement by passing true as the only argument to Carafe.

```js
// dependency replacement

// provider.mjs
import Carafe from 'carafe'
const allowReplace = process.env.NODE_ENV === 'test'; // optionally enable replacement
const container = new Carafe(allowReplace);
container.register('water', 'fresh and cool');
export default container;


// status.mjs does not change
const waterStatus = container.inject(['water'], (water) => water);
export default waterStatus;


// then in your tests...
import container from 'provider.mjs';
import status from 'status.mjs';

container.replace('water', 'mock water');
console.log(status()); // mock water
container.restore('water'); // or to restore all mocks, use restore()
console.log(status()); // fresh and cool
```

## Methods

Carafe instances should be `new`ed up, and the instance returned will have the following methods. You can call Carafe() as well, and it will return a new instance for you.

### Carafe([enableReplacement])

Creates and returns a new instance of Carafe. If `enableReplacement` is true, dependencies can be replaced.

#### register(name, payload)

Registered a new dependency by name. `name` should be a string, and the method will throw if it's not.

#### get(name)

Returns a registered dependency by name. If there is no matching depdendency, the method will throw.

#### inject(dependencies[], function)

Takes an array of named depdendencies, passing them in order as arguments to `function`. Returns the original `function` with the depdendencies partially applied.

#### replace(name, payload)

*Only available if `enableReplacement` is true*

Used to replace a dependency's value in a recoverable way. `replace` can be called multiple times, and the resulting value when `get` is used will always be whatever the last value provided was. Use `restore` to restore the original dependency's payload.

#### restore([name])

*Only available if `enableReplacement` is true*

Used to restore a given dependency to its original registered value, undoing any `replace` calls. If no name is provided, *all* dependencies are restored.

#### License

MIT © [w33ble](https://github.com/w33ble)