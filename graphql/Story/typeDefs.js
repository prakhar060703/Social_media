const { gql } = require('apollo-server');

module.exports = gql`
  

  type Story {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    updatedAt: String!
    username: String!
  }

  type Query {
    stories: [Story!]!
    story(id: ID!):Story
    getStoriesByUser(username: String!):[Story]
  }

  type Mutation {
    createStory(title: String!, content: String!): Story!
    updateStory(id: ID!, title: String, content: String): Story!
    deleteStory(id: ID!): Boolean!
  }
`;
