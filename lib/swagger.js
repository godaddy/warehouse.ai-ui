const { version } = require('../package.json');

module.exports = {
  openapi: '3.0.2',
  info: {
    title: 'Warehouse.ai UI',
    version,
    description: 'UI for Warehouse.ai'
  },
  apis: [
    './lib/routes/index.js' // this is relative to the root
  ]
};