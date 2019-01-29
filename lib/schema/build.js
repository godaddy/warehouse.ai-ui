const { statusResolver } = require('./status');

const buildResolver = function buildResolver({ pkg, env, version }, context) {
  return new Promise(function (resolve, reject) {
    context.wrhs.builds.get({ pkg, env, version }, function (err, result) {
      if (err) {
        context.log.error(`Unable to get build information for ${pkg} in ${env}`, err);
        return err.message.includes('404') ? resolve(null) : reject(err);
      }

      resolve(result);
    });
  });
};

const BuildSchema = `
  # A build that exists in warehouse
  type Build {
    env: Environment
    name: String!
    buildId: String,
    previousBuildId: String,
    createDate: String,
    updateDate: String,
    version: String,
    locale: String,
    cdnUrl: String,
    fingerprints: [String],
    artifacts: [String],
    recommended: [String],
    files: [String]

    status: Status
  }
`;

const buildResolvers = {
  Build: {
    updateDate: obj => obj.udpateDate, // this fixes the typo
    status: (obj, args, context) => statusResolver(obj, context)
  }
};

module.exports = {
  buildResolver,
  buildResolvers,
  BuildSchema
};
