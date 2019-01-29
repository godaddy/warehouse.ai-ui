import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import { Row, Col, Timeline, Divider, Card } from 'antd';
import EncodedLink from './encoded-link';
import gql from 'graphql-tag';

const query = gql`
query Build($pkg: String!, $env: Environment!, $version: String) {
  build(pkg: $pkg, env: $env, version: $version) {
    name
    version
    env
    buildId
    previousBuildId
    createDate
    updateDate
    files

    status {
      complete
      events {
        error
        message
        locale
        createDate
      }
    }
  }
}
`;

/**
 * Renders the build events
 *
 * @param {Object}  statusInfo Status information about the build
 * @param {Array}   statusInfo.events An array of event objects that makes up a log of the build process
 * @param {boolean} statusInfo.complete Did the build complete?
 * @returns {Timeline} A timeline of the build status events.
 */
const renderBuildEvents = function renderBuildEvents(statusInfo) {
  const { events, complete } = statusInfo;

  const messages = events.map((event, i) => {
    const { message, locale, createDate, error } = event;

    return (message &&
      <Timeline.Item key={ i } color={ error ? 'red' : 'green' }>
        <Row>
          <Col span={ locale ? 6 : 8 }>{ message }</Col>
          { locale && <Col span={ 2 }>{ locale }</Col> }
          { createDate && <Col span={ 16 }>{ new Date(createDate).toString() }</Col> }
        </Row>
      </Timeline.Item>
    );
  }).filter(Boolean);

  return (
    <Timeline pending={ !complete }>
      { messages }
    </Timeline>
  );
};

/**
 * Renders infomation about a warehouse build
 *
 * @param {Object}  props react props
 * @param {boolean} props.loading Is the component loading data?
 * @param {boolean} props.error Did the component encounter an error while loading?
 * @param {Object}  props.build The build information
 * @returns {node} The rendered build
 */
export const Build = ({ loading, error, build }) => {
  if (loading) return <p>Loading...</p>;
  if (error || !build) return <p>Unable to load build information.</p>;

  const { name, version, env, createDate, updateDate, buildId, previousBuildId, files, status } = build;
  const buildTitle = `${name}@${version} ${env}`;

  const rows = [{
    title: 'Created',
    content: new Date(createDate).toString()
  }, {
    title: 'Updated',
    content: updateDate && new Date(updateDate).toString()
  }, {
    title: 'Build Id',
    content: buildId
  }, {
    title: 'Previous Build Id',
    content: (<EncodedLink path={ previousBuildId.split('!').slice(0, -1) }>{ previousBuildId }</EncodedLink>)
  }, {
    title: 'Files',
    content: files.map(item => <div key={ item }>{ item }</div>)
  }];

  const renderedRows = rows.map(row => {
    return row.content && (
      <div className='build-row' key={ row.title }>
        <Row  gutter={ 16 } type='flex' align='middle'>
          <Col span={ 4 }><p className='title'>{ row.title }</p></Col>
          <Col span={ 20 }>{ row.content }</Col>
        </Row>
      </div>
    );
  });

  return (
    <Fragment>
      <Card title={ buildTitle }>
        { renderedRows }
      </Card>
      <Divider>Build Log</Divider>
      { status && renderBuildEvents(status) }
    </Fragment>
  );
};

Build.propTypes = {
  loading: PropTypes.bool,
  error: PropTypes.object,
  build: PropTypes.object
};

/**
 * Apollo query wrapper for Build component
 *
 * @param {object} props build progress props
 * @param {string} props.pkg Package name to query for
 * @param {string} props.env Environment
 * @param {string} props.version Version
 *
 * @returns {node} Query wrapper around Build
 */
const BuildContainer = ({ pkg, env, version }) => (
  <Query query={ query } variables={{ pkg, env, version }} errorPolicy='all'>
    {({ loading, error, data }) => (
      <Build loading={ loading } error={ error } build={ data.build } />
    )}
  </Query>
);

BuildContainer.propTypes = {
  pkg: PropTypes.string,
  env: PropTypes.string,
  version: PropTypes.string
};

export default BuildContainer;
