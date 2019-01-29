import PropTypes from 'prop-types';

const envPropType = PropTypes.shape({
  env: PropTypes.string,
  version: PropTypes.string,
  status: PropTypes.shape({
    complete: PropTypes.bool,
    error: PropTypes.object,
    progress: PropTypes.shape({
      percentage: PropTypes.number
    })
  })
});

const pkgPropType = PropTypes.shape({
  name: PropTypes.string,
  dev: envPropType,
  test: envPropType,
  prod: envPropType
});

export {
  envPropType,
  pkgPropType
};
