const slay = require('slay');
const util = require('util');

/**
 * @constructor App
 *  @param {string} root - Root directory of app
 *  @param {Object} options - configuration options
 *  @returns {undefined}
 */
const App = module.exports = function App(root, options) {
  slay.App.call(this, root, options);
  this.env = process.env.NODE_ENV || 'development';
};

util.inherits(App, slay.App);
