const { RootSchema, rootResolvers } = require('./root');
const { BuildSchema, buildResolvers } = require('./build');
const { PackagesSchema, packagesResolvers } = require('./packages');
const { StatusSchema, statusResolvers } = require('./status');
const { makeExecutableSchema } = require('graphql-tools');

module.exports = makeExecutableSchema({
  typeDefs: [RootSchema, BuildSchema, PackagesSchema, StatusSchema],
  resolvers: [rootResolvers, buildResolvers, packagesResolvers, statusResolvers]
});
