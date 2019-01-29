const url = require('url');
const assume = require('assume');
const request = require('request');
const wrhsAiUi = require('../../lib');
const wrhsNock = require('../fixtures/warehouse-nock');

function address(app, properties) {
  const socket = app.servers.http.address();
  return url.format(Object.assign({
    hostname: '127.0.0.1',
    port: socket.port,
    protocol: 'http'
  }, properties || {}));
}

// custom app configuration
describe('Server', function () {
  let app;
  let authedCalls = 0;
  this.timeout(6E4);

  function doRequest(pathname) {
    return new Promise(function (resolve, reject) {
      request(address(app, { pathname }), function (error, res, body) {
        if (error) return reject(error);

        resolve({ res, body });
      });
    });
  }

  before(function (done) {
    const options = {
      auth: (req, res, next) => { authedCalls += 1; next(); },
      routing: (app) => {
        app.get('/reverse-nose-job',
          (req, res, next) => { req.secret = 12342; next(); },
          (req, res, next) => { req.secret += 1;    next(); },
          (req, res, next) => { req.secret += 2;    next(); },
          (req, res) => { res.send('The airlock code is ' + req.secret); }
        );
      },
      config: {
        overrides: {
          wrhs: { uri: 'https://wrhs.ai' },
          http: {
            host: '0.0.0.0',
            port: 0
          }
        }
      }
    };

    wrhsAiUi(options, function (error, startedApp) {
      if (error) {
        return done(error);
      }
      app = startedApp;
      done();
    });
  });

  after(function (done) {
    app.close(done);
  });

  beforeEach(function () {
    wrhsNock();
  });

  it('passes health check', async function () {
    const { res, body } = await doRequest('healthcheck.html');

    assume(res.statusCode).to.equal(200);
    assume(body).to.include('ok');
  });

  // Assumes that webpack build is run before the tests
  it('serves static files in dist folder', async function () {
    const { res, body } = await doRequest('build.js');

    assume(res.statusCode).equals(200);
    assume(body).exists();
  });

  // Assumes wrhs is configured with valid uri
  describe('routes', function () {
    // this test does not work because this package is not published
    // anywhere, so there is no package to pull up yet
    it('responds to / with 200 status code', async function () {
      const { res, body } = await doRequest('/');

      assume(res.statusCode).equals(200);
      assume(body).include('<div id="root">');
    });

    it('matches / for every other route', async function () {
      const { res, body } = await doRequest('/a/non/existing/route');

      assume(res.statusCode).equals(200);
      assume(body).include('<div id="root">');
    });

    it('uses the consumer-defined routes', async function () {
      const { res, body } = await doRequest('/reverse-nose-job');

      assume(res.statusCode).equals(200);
      assume(body).equals('The airlock code is 12345');
    });

    it('serves packages information', async function () {
      const { res, body } = await doRequest('/api/packages/pkg');

      assume(res.statusCode).equals(200);
      assume(JSON.parse(body).name).equals('pkg');
    });
  });

  describe('auth', function () {
    beforeEach(function () {
      authedCalls = 0;
    });

    it('uses the provided auth middleware', async function () {
      const { res } = await doRequest('/');

      assume(res.statusCode).equals(200);
      assume(authedCalls).equals(1);
    });

    it('uses the provided auth middleware for `/api/packages/pkg`', async function () {
      const { res } = await doRequest('/api/packages/pkg');

      assume(res.statusCode).equals(200);
      assume(authedCalls).equals(1);
    });

    it('uses the provided auth middleware for `/api/graphql?query`', async function () {
      const { res } = await doRequest('/api/graphql?query');

      assume(res.statusCode).equals(200);
      assume(authedCalls).equals(1);
    });
  });
});
