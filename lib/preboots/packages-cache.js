class PackagesCache {
  /**
   * PackagesCache
   * @param {Warehouse} wrhs - warehouse.ai-api-client instance
   * @param {Object} log - Logger
   * @param {number} refresh - How often to refresh the cache in ms
   */
  constructor(wrhs, log, refresh = 5 * 60 * 1000) {
    this.packages = {};

    const refreshLoop = () => {
      setTimeout(() => {
        this.fetchPackages(wrhs, log, refreshLoop);
      }, refresh).unref();
    };

    this.fetchPackages(wrhs, log, refreshLoop);
  }

  /**
   * Gets all packages from warehouse
   *
   * @param {Warehouse} wrhs - warehouse.ai-api-client instance
   * @param {Object} log - Logger
   * @param {function} done - callback
   */
  fetchPackages(wrhs, log, done) {
    wrhs.packages.get((err, data) => {
      log.info('Refreshing packages cache');
      if (err) {
        log.error(err);
        return done(err);
      }

      this.refreshedAt = new Date().toISOString();
      this.packages = data;
      done(null, data);
    });
  }
}

function packagesCachePreboot(app, options, done) {
  app.log.info('Prebooting packages cache');
  app.packagesCache = new PackagesCache(app.warehouse, app.log, app.config.get('cache:packages'));

  done();
}

packagesCachePreboot.PackagesCache = PackagesCache;

module.exports = packagesCachePreboot;
