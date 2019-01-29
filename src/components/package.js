import React from 'react';
import PropTypes from 'prop-types';
import { pkgPropType } from './prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { List } from 'antd';
import EncodedLink from './encoded-link';
import Progress from './build-progress';
import env from '../../lib/queries/env';

const query = gql`
${env}

query Package($pkg: String!) {
  packages(name: $pkg) {
    name
    dev { ...env }
    test { ...env }
    prod { ...env }
  }
}
`;

export const Package = ({ loading, error, pkg }) => {
  if (loading) return <p>Loading...</p>;
  if (error && !pkg) return <p>Unable to load package information.</p>;

  const { name, dev, test, prod } = pkg;
  const envs = [dev, test, prod].filter(Boolean);
  const statusUnavailable = (<p>Build status information unavailable.</p>);

  return (
    <List
      header={ <h3>{ name }</h3> }
      size='large'
      bordered
      dataSource={ envs }
      renderItem={ ({ env, version, status }) => (
        <List.Item>
          <List.Item.Meta
            title={ (
              <EncodedLink path={ [name, env, version] }>
                { `${env}@${version === null ? 'null' : version}` }
              </EncodedLink>
            ) }
            description={ status ? <Progress status={ status } /> : statusUnavailable }
          />
        </List.Item>
      ) } />
  );
};

Package.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  pkg: pkgPropType
};

/**
 * Apollo query wrapper for Package component
 *
 * @param {object} props build progress props
 * @param {object} props.pkg Package name to query for
 *
 * @returns {node} Query wrapper around Package
 */
const PackageContainer = ({ pkg }) => (
  <Query query={ query } variables={{ pkg }} errorPolicy='all' pollInterval={ 30 * 1000 }>
    {({ loading, error, data }) => (
      <Package loading={ loading } error={ error } pkg={ data && data.packages && data.packages[0] } />
    )}
  </Query>
);

PackageContainer.propTypes = {
  pkg: PropTypes.string
};

export default PackageContainer;
