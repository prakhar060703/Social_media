const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const mongoose = require('mongoose');

const StoryTypeDefs = require('./graphql/Story/typeDefs');
const StoryResolvers = require('./graphql/Story/resolvers');

const PostTypeDefs = require('./graphql/Post/typeDefs');
const PostResolvers = require('./graphql/Post/resolvers');

const MONGODB = "mongodb+srv://prakhar060708:prakhar060708@cluster0.68zgj5d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function startServer() {
  const storyServer = new ApolloServer({
    typeDefs: [StoryTypeDefs],
    resolvers: [StoryResolvers],
    playground: true, // Enable GraphQL Playground
  });

  const postServer = new ApolloServer({
    typeDefs: [PostTypeDefs],
    resolvers: [PostResolvers],
    playground: true, // Enable GraphQL Playground
  });

  await Promise.all([storyServer.start(), postServer.start()]);

  const app = express();

  // Mount the Apollo Server middleware at the /story and /post endpoints
  storyServer.applyMiddleware({ app, path: '/story' });
  postServer.applyMiddleware({ app, path: '/post' });

  mongoose.connect(MONGODB, { useNewUrlParser: true })
    .then(() => {
      console.log("MongoDB is connected");
      app.listen({ port: 5000 }, () => {
        console.log(`Server running at http://localhost:5000`);
      });
    })
    .catch(err => {
      console.error("MongoDB connection error:", err);
    });
}

startServer();
