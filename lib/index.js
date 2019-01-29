const path = require('path');
const App = require('./app');

/*
 * Create a new application and start it.
 */
module.exports = function start(options, callback) {
  if (!callback && typeof options === 'function') {
    callback = options;
    options = {};
  }

  const opts = Object.assign({}, {
    auth: (req, res, next) => next(),
    routing: () => {},
    configPath: path.join(__dirname, '..')
  }, options, {
    // Ensure we're using the slay-specific directories from
    // this application, not the consumer
    preboots: path.join(__dirname, 'preboots'),
    middlewares: path.join(__dirname, 'middlewares'),
    routes: path.join(__dirname, 'routes'),
    views: path.join(__dirname, 'views')
  });

  const app = new App(opts.configPath, opts);
  app.start(function (err) {
    if (err) { return callback(err); }
    callback(null, app);
  });
};
