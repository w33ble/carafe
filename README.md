# carafe

Crazy simple dependency container.

> def.
> a wide-mouthed glass or metal bottle with a lip or spout, for holding and serving dependencies

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/w33ble/carafe/master/LICENSE)
[![npm](https://img.shields.io/npm/v/carafe.svg)](https://www.npmjs.com/package/carafe)
[![Build Status](https://img.shields.io/travis/w33ble/carafe.svg?branch=master)](https://travis-ci.org/w33ble/carafe)
[![Coverage](https://img.shields.io/codecov/c/github/w33ble/carafe.svg)](https://codecov.io/gh/w33ble/carafe)
[![Project Status](https://img.shields.io/badge/status-experimental-orange.svg)](https://nodejs.org/api/documentation.html#documentation_stability_index)

A little inspiration taken from [@travi/ioc](https://github.com/travi/ioc).

## Usage

Create a Carafe instance, add dependencies to it, and get them back out where needed.

```js
// provider.mjs
import Carafe from 'carafe'
const container = new Carafe();
container.add('water', () => 'fresh and cool');
export default container;

// elsewhere.mjs
import container from 'provider.mjs';
const water = container.get('water');
return water(); // fresh and cool

// in your tests...
import container from 'provider.mjs';
import elsewhere from 'elsewhere.mjs';
container.replace('water', () => 'mock water');
elsewhere(); // mock water
container.restore('water'); // or to restore all mocks, use restore()
elsewhere(); // fresh and cool
```

## Methods

Carafe instances should be `new`ed up, and the instance returns will have the following methods. You can call Carafe() as well, and it will return a new instance for you.

### add(name, payload)

Registered a new dependency by name. `name` should be a string, and the method will throw if it's not.

### get(name)

Returns a registered dependency by name. If there is no matching depdendency, the method will throw.

### inject(dependencies[], function)

Takes an array of named depdendencies, passing them in order as arguments to `function`. Returns whatever `function` returns. 

**NOTE:** Dependencies are only injected at call time, so using `replace` with this syntax isn't useful as the values won't be re-read and replaced with the alternate payload.

### replace(name, payload)

Used to replace a dependency's value in a recoverable way. `replace` can be called multiple times, and the resulting value when `get` is used will always be whatever the last value provided was. Use `restore` to restore the original dependency's payload.

### restore([name])

Used to restore a given dependency to its original registered value, undoing any `replace` calls. If no name is provided, *all* dependencies are restored.

#### License

MIT © [w33ble](https://github.com/w33ble)