const gql = require('graphql-tag');
const env = require('./env');

module.exports = gql`
${env}

{
  cacheTimes {
    packagesCache
  }
  packages {
    name
    description
    version
    dev { ...env }
    test { ...env }
    prod { ...env }
  }
}
`;
