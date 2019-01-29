import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import { Link } from 'react-router-dom';

const Nav = ({ path, children }) => {
  const pathParts = path.split('/').filter(Boolean);
  const items = pathParts.map((pathPart, index) => {
    const url = '/' + pathParts.slice(0, index + 1).join('/');
    return (
      <Breadcrumb.Item key={ url }>
        <Link to={ url }>{ decodeURIComponent(pathPart) }</Link>
      </Breadcrumb.Item>
    );
  });

  const breadcrumbs = [(
    <Breadcrumb.Item key='Home'>
      <Link to={ '/' }>Home</Link>
    </Breadcrumb.Item>
  )].concat(items);

  return (
    <Fragment>
      <Breadcrumb separator='/'>{ breadcrumbs }</Breadcrumb>
      { children }
    </Fragment>
  );
};

Nav.propTypes = {
  path: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ]).isRequired
};

export default Nav;
