const gql = require('graphql-tag');

const typeDefs = gql`
  type Query {
    getTasks: [Task!]!
  }

  type Task {
    userId: ID!
    id: String!
    index: Int!
    title: String!
    completed: Boolean!
  }
`;

module.exports = typeDefs;