const assume = require('assume');
const wrhs = require('../../../lib/preboots/warehouse');
const Warehouse = require('warehouse.ai-api-client');

describe('Warehouse', function () {
  const testURI  = 'http://this-is-test.com';
  const mockApp = {
    log: { info: () => {} },
    config: { get: () => { return { uri: testURI };} }
  };

  describe('preboot', function () {
    it('is function', function () {
      assume(wrhs).to.be.a('function');
      assume(wrhs).to.have.length(3);
    });
    it('sets app.warehouse to an instance of wrhs', function () {
      wrhs(mockApp, {}, function () {
        assume(mockApp.warehouse).exists();
        assume(mockApp.warehouse).to.be.instanceof(Warehouse);
      });
    });
  });
});
