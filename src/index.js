import React from 'react';
import ReactDOM from 'react-dom';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache, defaultDataIdFromObject } from 'apollo-cache-inmemory';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './app';
import './index.less';

const cache = new InMemoryCache({
  dataIdFromObject: (object) => {
    switch (object.__typename) {
      case 'Package': return object.name;
      default: return defaultDataIdFromObject(object);
    }
  },
  cacheRedirects: {
    Query: {
      packages: (_, { name }, { getCacheKey }) => [getCacheKey({ name, __typename: 'Package' })]
    }
  }
});

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: cache.restore(window.__PRELOADED_STATE__)
});

ReactDOM.render(
  <Router>
    <ApolloProvider client={ client }>
      <App />
    </ApolloProvider>
  </Router>,
  document.getElementById('root')
);
