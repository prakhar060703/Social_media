const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User]!
  }

  type Mutation {
    createUser(email: String!, password: String!): AuthPayload!
  }
`;

module.exports = typeDefs;
