export default function Carafe(allowReplace = false) {
  if (!(this instanceof Carafe)) return new Carafe();

  const dependencies = new Map();
  const mockPrefix = '%MOCK%';

  // helper functions
  const validateName = name => {
    if (typeof name !== 'string') throw new Error('Dependency name must be a string');
  };
  const mockName = name => `${mockPrefix}${name}`;
  const originalName = name => name.replace(mockPrefix, '');
  const isMock = name => new RegExp(`^${mockPrefix}`).test(name);
  const getType = p => {
    const type = typeof p;
    if (type !== 'object') return type;
    if (Array.isArray(p)) return 'array';
    if (p === null) return 'null';
    return type;
  };
  const restoreDependency = n => {
    if (!dependencies.has(n)) return;
    const payload = dependencies.get(n);
    dependencies.set(originalName(n), payload);
    dependencies.delete(n);
  };

  const baseMethods = {
    register(name, payload) {
      if (dependencies.has(name)) throw new Error(`Dependency already defined: ${name}`);
      validateName(name);
      dependencies.set(name, payload);
    },

    get(name) {
      if (!dependencies.has(name)) throw new Error(`Dependency not defined: ${name}`);
      return dependencies.get(name);
    },

    inject(deps, fn) {
      if (!Array.isArray(deps)) throw new Error('Dependency list must be an array');
      return (...args) => {
        const resolvedDeps = deps.map(dep => this.get(dep));
        return fn(...resolvedDeps, ...args);
      };
    },
  };

  const replaceMethods = {
    replace(name, payload) {
      if (!dependencies.has(name)) throw new Error(`Can not replace undefined dependency: ${name}`);

      // check the replacement payload type against the original payload type
      const originalType = getType(dependencies.get(name));
      if (getType(payload) !== originalType) {
        // eslint-disable-next-line no-console
        console.warn(`WARN: replacement payload type does not match original: ${originalType}`);
      }

      // keep a copy of the original value
      const mName = mockName(name);
      if (!dependencies.has(mName)) dependencies.set(mName, dependencies.get(name));

      dependencies.set(name, payload);
    },

    restore(name) {
      if (name != null) {
        validateName(name);
        restoreDependency(mockName(name));
        return;
      }

      // restore all mocked dependencies
      dependencies.forEach((val, n) => {
        if (isMock(n)) restoreDependency(n);
      });
    },
  };

  if (!allowReplace) return baseMethods;
  return Object.assign({}, baseMethods, replaceMethods);
}
