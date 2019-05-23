# `warehouse.ai-ui`

[![Version npm](https://img.shields.io/npm/v/warehouse.ai-ui.svg?style=flat-square)](https://www.npmjs.com/package/warehouse.ai-ui)
[![License](https://img.shields.io/npm/l/warehouse.ai-ui.svg?style=flat-square)](https://github.com/godaddy/warehouse.ai-ui/blob/master/LICENSE)
[![npm Downloads](https://img.shields.io/npm/dm/warehouse.ai-ui.svg?style=flat-square)](https://npmcharts.com/compare/warehouse.ai-ui?minimal=true)
[![Build Status](https://travis-ci.org/godaddy/warehouse.ai-ui.svg?branch=master)](https://travis-ci.org/godaddy/warehouse.ai-ui)
[![Dependencies](https://img.shields.io/david/godaddy/warehouse.ai-ui.svg?style=flat-square)](https://github.com/godaddy/warehouse.ai-ui/blob/master/package.json)

UI for [Warehouse.ai]. Visual representation of your builds and status events.

## Install

```
git clone git@github.com:godaddy/warehouse.ai-ui.git
cd warehouse.ai-ui && npm install
```

## Usage

The module provides a [`bin/server`](./bin/server) script that starts the UI.
Run the UI with `npm`.

```bash
npm start
```

The client-side bundle already comes packaged with this `npm` module, but if
you need to re-build the assets, for whatever reason, you can do so as
follows:

```sh
npm run build
```

## API

### GraphQL API

Warehouse UI is backed by a GraphQL API. This API transforms the data from the
existing warehouse API to a model that is specific to this UI. The GraphQL
models are based on [warehouse-models]. Refer to its schemas for a reference
on data and properties that are available.

### Libraries used

The service mostly uses the [reference JS implementation of GraphQL] with some
Apollo utilities.

* [`express-graphql`] (An express middleware for creating the GraphQL API, and
exposes GraphiQL outside of production).
* [`graphql-tools`] (`graphql-tools` is used for [`makeExecutableSchema`]. This
allows the schema to be defined in the GraphQL schema language and then easily
combined with the resolver map).

For the client we use [`apollo-client`]. This enables SSR and client caching
without needing any schema changes.

### Configuration

At a minimum you, must provide that path where which `warehouse.ai-ui` can find
your configuration. Because this is largely a wrapper around [`slay`], the
configuration directory must take the same exact same form. Example config
files can be found in [`/lib/config`](/lib/config).
Additionally, the configuration files should include configuration information
for the [warehouse.ai-api-client]. This information should be under the `wrhs`
key in the config.

```bash
const WrhsAiUI = require('warehouse.ai-ui');
const configPath = '/path/to/config/files';

WrhsAiUI({ configPath }, (err, app) => {
  if (err) { throw err; }
  app.log.info(`Listening on ${app.config.get('http')}`);
});
```

In addition, you can provide authorization and authentication configuration via
the `auth` and `routing` parameters, which let you define anything else that
you would need to secure your UI.

```js
const WrhsAiUI = require('warehouse.ai-ui');

function isLoggedIn (req, res, next) => {
  if (req.secretIdentity !== 'Bruce Wayne') {
    res.redirect('/', 401);
  } else {
    next();
  }
}

function addAdditionalRoutes(app) {
  app.get('/faq', (res, res) => res.send('idk Google it'));
}

const options = {
  auth: isLoggedIn,
  routing: addAdditionalRoutes,
  configPath: '/path/to/config/files'
};

WrhsAiUI(options, err => {
  if (err) throw err;
  app.log.info(`Listening on ${wrhsUI.config.get('http')}`);
});
```

## Test

```bash
npm test
```

[Warehouse.ai]: https://github.com/godaddy/warehouse.ai
[warehouse.ai-api-client]: https://github.com/warehouseai/warehouse.ai-api-client
[reference JS implementation of GraphQL]: https://github.com/graphql/graphql-js
[`slay`]: https://github.com/godaddy/slay
[`apollo-client`]: https://www.apollographql.com/docs/react/
[`express-graphql`]: https://github.com/graphql/express-graphql
[`graphql-tools`]: https://www.apollographql.com/docs/graphql-tools/
[`makeExecutableSchema`]: https://www.apollographql.com/docs/graphql-tools/generate-schema.html#makeExecutableSchema
[warehouse-models]: https://github.com/warehouseai/warehouse-models#schemas
