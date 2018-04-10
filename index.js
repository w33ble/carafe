/* eslint no-global-assign: 0 */
require = require('@std/esm')(module);
const mod = require('./src/index.mjs').default;

module.exports = mod;
