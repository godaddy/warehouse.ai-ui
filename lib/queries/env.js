const gql = require('graphql-tag');

module.exports = gql`
fragment env on Env {
  env
  version
  status {
    complete
    error
    progress {
      percentage
    }
  }
}
`;
