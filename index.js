import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress,graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
// import typeDefs from './schema';
// import  resolvers from './resolvers';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import path from 'path';
import cors from 'cors';
const SECRET = 'aljdflkajelkrjlqkerjlkqerjlkejr3l4k';
const SECRET2 = 'lakdflakjarjlkerjloiq3u48aljdflkajelkrjlqkerjlkqerjlkejr3l4k';
import jwt from 'jsonwebtoken';
import { refreshTokens } from './auth';
import { createServer } from "http";
import { execute, subscribe } from "graphql";
import { PubSub } from "graphql-subscriptions";
import { SubscriptionServer } from 'subscriptions-transport-ws';




import models from './models';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));

const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

 const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const addUser = async (req, res, next) => {
  const token = req.headers['x-token'];
  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (err) {
      const refreshToken = req.headers['x-refresh-token'];
      const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
      if (newTokens.token && newTokens.refreshToken) {
        res.set('Access-Control-Expose-Headers', 'x-token, x-refresh-token');
        res.set('x-token', newTokens.token);
        res.set('x-refresh-token', newTokens.refreshToken);
      }
      req.user = newTokens.user;
    }
  }
  next();
};


 const graphqlEndpoint = '/graphql';

const app = express();
app.use(cors('*'));
app.use(addUser);

// bodyParser is needed just for POST.
app.use(graphqlEndpoint, bodyParser.json(), graphqlExpress(req => ({
schema,
context:{
  models,
  user: req.user
  ,
  SECRET,
  SECRET2
}, })));
//we tell graphiql what graphql is :)
app.use('/graphiql', graphiqlExpress({ endpointURL : graphqlEndpoint }));

const server = createServer(app);

//Migrate the models in the DB 
// force => drop all the database 
//  models.sequelize.sync({ force: true }).then(() => {
 models.sequelize.sync().then(() => {
  console.log("Success!!!!!!");
  server.listen(8081,()=>{
    new SubscriptionServer({
      execute,
      subscribe,
      schema,
    },{
      server,
      path: '/subscriptions'
    })
  });
}).catch((err)=>{
  console.log(err);
});
