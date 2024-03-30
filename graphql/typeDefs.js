const {gql} = require('apollo-server');

module.exports = gql`
  type Game {
    id: ID!
    title: String!
    platform: [String!]!
    
  }
  
  type Query {
    games: [Game]
    game(id: ID!): Game
    
  }
  type Mutation {
    addGame(game: AddGameInput!): Game
    deleteGame(id: ID!): [Game]
    updateGame(id: ID!, edits: EditGameInput): Game
  }
  input AddGameInput {
    title: String!,
    platform: [String!]!
  }
  input EditGameInput {
    title: String,
    platform: [String!]
  }
`