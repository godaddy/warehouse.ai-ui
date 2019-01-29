import React from 'react';
import PropTypes from 'prop-types';
import Nav from './components/nav';
import Packages from './components/packages';
import Package from './components/package';
import Build from './components/build';

const packageRouteWrapper = ({ match, location }) => (
  <Nav path={ location.pathname }>
    <Package pkg={ decodeURIComponent(match.params.pkg) } />
  </Nav>
);
packageRouteWrapper.propTypes = {
  // react-router provided data
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object
};

const buildRouteWrapper = ({ match }) => (
  <Nav path={ location.pathname }>
    <Build pkg={ decodeURIComponent(match.params.pkg) } env={ match.params.env } version={ match.params.version } />
  </Nav>
);
buildRouteWrapper.propTypes = {
  // react-router provided data
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.object
};

export default [{
  path: '/',
  name: 'main',
  exact: true,
  component: Packages
}, {
  path: '/:pkg',
  name: 'package',
  exact: true,
  render: packageRouteWrapper
}, {
  path: '/:pkg/:env/:version?',
  name: 'build',
  exact: true,
  render: buildRouteWrapper
}];
