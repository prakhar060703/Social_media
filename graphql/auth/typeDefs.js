const { gql } = require('apollo-server');

const typeDefs = gql`
 input RegisterInput{
  username:String!
  password:String!
  confirmPassword:String!
  email:String!
 }
 type User{
    id:ID!
    email:String!
    token:String!
    username:String!
    createdAt:String!
 }

  type Query {
    users: [User]!
  }

  type Mutation {
    register(registerInput:RegisterInput):User
    login(username:String! , password:String!):User!
  }
`;

module.exports = typeDefs;
