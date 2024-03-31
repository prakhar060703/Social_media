const express = require("express");
const { ApolloServer, gql } = require("apollo-server-express");
const mongoose = require('mongoose');
const MONGODB = "mongodb+srv://prakhar060708:prakhar060708@cluster0.68zgj5d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"


const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')
const server = new ApolloServer({
    typeDefs,
    resolvers
});

mongoose.connect(MONGODB,{useNewUrlParser:true})
    .then(()=>{
        console.log("Mongodb is connected")
        return server.listen({port:5000});
    })
    .then((res)=>{
        console.log(`server running at ${res.url}`)
    })