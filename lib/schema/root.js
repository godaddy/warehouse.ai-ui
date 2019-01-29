const { buildResolver } = require('./build');

const RootSchema = `
  # Warehouse environments
  enum Environment {
    dev
    test
    prod
  }

  # Timing information for cached data
  type CacheTimes {
    # Timestamp of the last time the packages cache was refreshed
    packagesCache: String
  }

  type Query {
    # Packages that exist in warehouse
    packages(name: String): [Package]

    # A specific build
    build(pkg: String!, env: Environment!, version: String): Build

    # Timing information for cached data
    cacheTimes: CacheTimes
  }
`;

const rootResolvers = {
  Query: {
    packages: (_, args, context) => {
      const packages = context.packagesCache.packages;

      if (args.name) {
        const pkg = packages.find((pkg) => pkg.name === args.name);
        if (pkg) return [pkg];
      }

      return packages;
    },
    build: (_, args, context) => buildResolver(args, context),
    cacheTimes: (_, args, context) => ({ packagesCache: context.packagesCache.refreshedAt })
  }
};

module.exports = {
  RootSchema,
  rootResolvers
};
