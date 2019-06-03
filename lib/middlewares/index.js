const path = require('path');
const morgan = require('morgan');
const express = require('express');
const graphql = require('./graphql');

module.exports = function (app, options, callback) {
  app.log.info('Adding middlewares');
  app.use(morgan('combined'));

  /**
   * @swagger
   * /build.js:
   *   get:
   *     summary: The built file
   *     produces:
   *       - "application/javascript; charset=UTF-8"
   *     responses:
   *       200:
   *         description: The file
   */
  app.use(express.static(path.resolve(__dirname, '../../dist')));

  /**
   * @swagger
   * /api/graphql:
   *   post:
   *     summary: A GraphQL endpoint for retrieving data.
   *     responses:
   *       200:
   *         description: |
   *           [An in-browser explorer for the graphql API](/api/graphql)
   *       302:
   *         description: Redirect for any possible auth middleware
   *       401:
   *         description: Unauthorized for any possible auth middleware
   *       403:
   *         description: Forbidden for any possible auth middleware
   */
  app.use('/api/graphql', options.auth, graphql(app));
  callback();
};
