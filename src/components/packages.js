import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { pkgPropType } from './prop-types';
import { Link } from 'react-router-dom';
import { Query } from 'react-apollo';
import { Card, List } from 'antd';
import Progress from './build-progress';
import query from '../../lib/queries/packages';

export class Packages extends Component {
  /**
   * Renders a packge
   *
   * @param {object} pkg Package information
   * @param {string} name Package name
   * @param {string} version Package version
   * @param {string} description Package description
   * @param {object} dev Build information for dev
   * @param {object} test Build information for test
   * @param {object} prod Build information for prod
   * @returns {node} Package card
   */
  renderPackage(pkg) {
    const { name, version, description, dev, test, prod } = pkg;
    const envs = [dev, test, prod].filter(Boolean);

    return (
      <Card className='package-card' title={ (<Link to={ `/${encodeURIComponent(name)}` }>{ `${name}@${version}` }</Link>) }>
        <p>{ description }</p>
        <List
          grid={{ column: envs.length, gutter: 4 }}
          dataSource={ envs }
          renderItem={ ({ env, version: tagVersion, status }) => (
            <List.Item>
              <Card className='env-card'
                title={ env }>
                <p>{ tagVersion === null ? 'null' : tagVersion }</p>
                { tagVersion && status && <Progress status={ status } size='small' /> }
              </Card>
            </List.Item>
          ) } />
      </Card>
    );
  }

  render() {
    const { loading, error, cacheTime, packages } = this.props;

    if (loading) return <p>Loading...</p>;
    if (error && !packages) return <p>Unable to load packages.</p>;

    return (
      <List
        footer={ <p className='packages-footer'>Package data refreshed at { new Date(cacheTime).toString() }</p> }
        grid={{ gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 3, xxl: 4 }}
        dataSource={ packages }
        renderItem={ pkg => (<List.Item>{ this.renderPackage(pkg) }</List.Item>) }
      />
    );
  }
}

Packages.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  packages: PropTypes.arrayOf(pkgPropType),
  cacheTime: PropTypes.string
};

/**
 * Apollo query wrapper for Packages component
 *
 * @returns {node} Query wrapper around Packages
 */
const PackagesContainer = () => (
  <Query query={ query } errorPolicy='all' pollInterval={ 60 * 1000 * 5 }>
    {({ loading, error, data }) => (
      <Packages
        loading={ loading }
        error={ error }
        packages={ data && data.packages }
        cacheTime={ data && data.cacheTimes && data.cacheTimes.packagesCache } />
    )}
  </Query>
);

export default PackagesContainer;
