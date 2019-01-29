const StatusSchema = `
  type Progress {
    # Percentage of assets built
    percentage: Float
    
    # Number of assets that have been built
    count: Int

    # Total number of assets for this build
    total: Int
  }

  type Event {
    locale: String,
    error: String,
    message: String,
    details: String,
    createDate: String,
    eventId: String
  }

  type Status {
    progress: Progress

    # Did this build encounter an error?
    error: Boolean

    # Is this build complete?
    complete: Boolean

    # Status events
    events: [Event]
  }
`;

const statusResolver = function statusResolver({ name: pkg, env }, context) {
  return new Promise(function (resolve, reject) {
    context.wrhs.status.get({ pkg, env }, function (err, result) {
      if (err) return reject(err);

      resolve(result);
    });
  });
};

const statusResolvers = {
  Progress: {
    percentage: (obj) => obj.progress
  },
  Status: {
    progress: (obj, args, context) => {
      return new Promise(function (resolve, reject) {
        const { pkg, env, version } = obj;

        context.wrhs.status.progress({ pkg, env, version }, function (err, result) {
          if (err) return reject(err);

          resolve(result);
        });
      });
    },
    events: (obj, args, context) => {
      return new Promise(function (resolve, reject) {
        const { pkg, env, version } = obj;

        context.wrhs.status.events({ pkg, env, version }, function (err, result) {
          if (err) return reject(err);

          resolve(result);
        });
      });
    }
  }
};

module.exports = {
  StatusSchema,
  statusResolver,
  statusResolvers
};
