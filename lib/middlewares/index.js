const path = require('path');
const morgan = require('morgan');
const express = require('express');
const graphql = require('./graphql');

module.exports = function (app, options, callback) {
  app.log.info('Adding middlewares');
  app.use(morgan('combined'));
  app.use(express.static(path.resolve(__dirname, '../../dist')));
  app.use('/api/graphql', options.auth, graphql(app));
  callback();
};
