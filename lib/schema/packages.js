const { buildResolver } = require('./build');
const { statusResolver } = require('./status');

const PackagesSchema = `
  # Describes a build for an environment
  type Env {
    env: Environment
    version: String
    status: Status
  }

  # A package that exists in warehouse
  type Package {
    name: String!
    description: String
    version: String

    # The current HEAD build in dev
    dev: Env

    # The current HEAD build in test
    test: Env

    # The current HEAD build in prod
    prod: Env
  }
`;

const getBuildForEnv = function getBuildForEnv(env) {
  return (obj, args, context) => {
    if (!obj.distTags[env]) return null;

    return buildResolver({ pkg: obj.name, env }, context);
  };
};

const packagesResolvers = {
  Package: {
    dev: getBuildForEnv('dev'),
    test: getBuildForEnv('test'),
    prod: getBuildForEnv('prod')
  },
  Env: {
    status: (obj, args, context) => statusResolver(obj, context)
  }
};

module.exports = {
  PackagesSchema,
  packagesResolvers
};
