import React from 'react';
import { Progress } from 'antd';

/**
 * Wraps antd progress component for build progress
 *
 * @param {object} props build progress props
 * @param {object} props.status Build status
 * @param {bool} props.status.complete Is build complete?
 * @param {bool} props.status.error Is there a build error?
 *
 * @returns {node} Progress bar
 */
export default ({ status, ...props }) => { // eslint-disable-line react/prop-types
  let progressStatus = 'normal';
  if (status.complete) progressStatus = 'success';
  if (status.error) progressStatus = 'exception';

  return <Progress percent={ status.progress.percentage } status={ progressStatus } { ...props } />;
};
