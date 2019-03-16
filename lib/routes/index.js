const schema = require('../schema');
const { ApolloClient } = require('apollo-boost');
const { SchemaLink } = require('apollo-link-schema');
const { InMemoryCache, defaultDataIdFromObject } = require('apollo-cache-inmemory');
const query = require('../queries/packages');

const swaggerUI = require('swagger-ui-express');
const swaggerDefs = require('../../dist/swagger.json');

module.exports = function routing(app, options, callback) {
  app.perform('actions', done => {
    app.log.info('Adding routes');

    const context = {
      wrhs: app.warehouse,
      log: app.log,
      packagesCache: app.packagesCache
    };

    // Apollo client for SSR
    const client = new ApolloClient({
      ssrMode: true,
      link: new SchemaLink({ schema, context }),
      cache: new InMemoryCache({
        dataIdFromObject: (object) => {
          switch (object.__typename) {
            case 'Package': return object.name;
            default: return defaultDataIdFromObject(object);
          }
        }
      })
    });

    /**
     * apply any consumer-defined routes beforehand
     */
    options.routing(app.routes);

    /**
     * Performs healthcheck
     *
     * @param {HTTPRequest} req HTTP Request.
     * @param {HTTPResponse} res HTTP Response.
     * @api public
     */
    app.routes.get('/healthcheck(.html)?', (req, res) => {
      res.end('ok');
    });

    /**
     * Base for swagger definitions
     */
    app.routes.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDefs));

    /**
      * @swagger
      * /api/packages/{pkg}:
      *   get:
      *     summary: Gets info about one package
      *     produces:
      *       - "application/json"
      *     parameters:
      *       - in: path
      *         name: pkg
      *         required: false
      *         schema:
      *           type: string
      *         description: name of package
      *     responses:
      *       200:
      *         description: warehouse manifest for the given package
      */
    /**
     * Gets package information from warehouse
     *
     * @param {HTTPRequest} req HTTP Request.
     * @param {HTTPResponse} res HTTP Response.
     * @api public
     */
    app.routes.get('/api/packages/:pkg?', options.auth, function (req, res) {
      app.warehouse.packages.get({ pkg: req.params.pkg }, function (err, packageData) {
        if (err) {
          return res.status(500).json(err);
        }

        res.json(packageData);
      });
    });
    /**
      * @swagger
      * /:
      *   get:
      *     summary: get index page
      *     produces:
      *       - "text/html; charset=utf-8"
      *     responses:
      *       200:
      *         description: warehouse manifest for the given package
      *         content:
      *           "text/html; charset=utf-8":
      *             schema:
      *               type: string
      */
    /**
      * @swagger
      * /build.js:
      *   get:
      *     summary: get javascript
      *     produces:
      *       - "application/javascript; charset=utf-8"
      *     responses:
      *       200:
      *         description: javascript for the page
      *         content:
      *           "application/javascript; charset=utf-8":
      *             schema:
      *               type: string
      */

    /**
     * Gets clientside bundle from warehouse.ai and renders it out
     *
     * @param {HTTPRequest} req HTTP Request.
     * @param {HTTPResponse} res HTTP Response.
     * @api public
     */
    app.routes.get('/*', options.auth, async (req, res) => {
      const jsAssets = ['/build.js'];

      let cache;
      try {
        await client.query({ query, errorPolicy: 'all' });
        cache = client.extract();
      } catch (e) {
        app.log.error(e);
        cache = { error: e };
      }

      cache = JSON.stringify(cache);

      res.render('home', { jsAssets, cache });
    });

    done();
  }, callback);
};
