const Warehouse = require('warehouse.ai-api-client');

module.exports = function warehousePreboot(app, options, done) {
  app.log.info('Prebooting warehouse');
  const config = app.config.get('wrhs');
  app.warehouse = new Warehouse(config);
  done();
};
