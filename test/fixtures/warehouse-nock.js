const nock = require('nock');
const assetsFixture = require('./assets-fixture.json');
const packagesFixture = require('./packages-fixture.json');
const packageFixture = require('./package-fixture.json');

module.exports = function wrhsNock() {
  nock('https://wrhs.ai')
    .get('/assets/files/*')
    .reply(200, assetsFixture);

  nock('https://wrhs.ai')
    .get('/packages')
    .reply(200, packagesFixture);

  nock('https://wrhs.ai')
    .get('/packages/pkg')
    .reply(200, packageFixture);
};
