const { gql } = require('apollo-server');

module.exports = gql`
  

  type Post {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    postes: [Post!]!
    post(id: ID!):Post
  }

  type Mutation {
    createPost(title: String!, content: String!): Post!
    updatePost(id: ID!, title: String, content: String): Post!
    deletePost(id: ID!): Boolean!
  }
`;
