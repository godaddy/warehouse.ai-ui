const graphqlHTTP = require('express-graphql');
const schema = require('../schema');

/**
 * Creates a graphql middleware
 *
 * @param {slay.App} app Application
 * @returns {graphqlHTTP} GraphQL middleware
 */
module.exports = function graphql(app) {
  return graphqlHTTP({
    schema,
    context: {
      wrhs: app.warehouse,
      log: app.log,
      packagesCache: app.packagesCache
    },
    graphiql: app.env !== 'production'
  });
};
