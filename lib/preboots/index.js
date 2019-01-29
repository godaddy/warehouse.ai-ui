const path = require('path');
const winston = require('winston');
module.exports = function (app, options, done) {
  app.preboot(require('slay-log')({
    transports: [
      new (winston.transports.Console)({
        raw: app.env !== 'development',
        silent: options.silent
      })
    ]
  }));

  app.preboot(require('slay-config')({
    file: { file: path.join(app.rootDir, 'lib', 'config', app.env + '.json') }
  }));

  app.preboot(require('./warehouse'));
  app.preboot(require('./packages-cache'));

  if (app.given.views === undefined) { // eslint-disable-line no-undefined
    // eslint-disable-next-line max-len, no-console
    console.warn('app.given.view is undefined: path to views folder is not supplied by the implementation repo. Defaulting to lib/views of warehouse.ai-ui');
  }
  app.set('views', app.given.views || path.join(app.rootDir, 'lib', 'views'));
  app.set('view engine', 'hbs');
  done();
};
