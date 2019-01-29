import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

/**
 * A small utility component for encoding each part of a link path.
 * This should only be used in places where the path parts are not already encoded and really really need to be.
 *
 * @param {Object} props react props
 * @param {string[]} props.path An array of path parts. These will be URI component encoded and joined to form the relative path
 * @returns {Link} The built 'react-router-dom' link
 */
const EncodedLink = ({ path, children, ...props }) => (
  <Link to={ `/${path.filter(Boolean).map(encodeURIComponent).join('/')}` } { ...props }>
    { children }
  </Link>
);

const { to, ...linkProps } = Link.propTypes; // eslint-disable-line no-unused-vars
EncodedLink.propTypes = {
  ...linkProps,
  path: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default EncodedLink;
