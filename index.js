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



import models from './models';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));

const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

 const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
 const graphqlEndpoint = '/graphql';

const app = express();
app.use(cors('*'));

// bodyParser is needed just for POST.
app.use(graphqlEndpoint, bodyParser.json(), graphqlExpress({ schema,
context:{
  models,
  user:{
    id:1,
  },
  SECRET,
  SECRET2
}, }));
//we tell graphiql what graphql is :)
app.use('/graphiql', graphiqlExpress({ endpointURL : graphqlEndpoint }));

//Migrate the models in the DB 
// force => drop all the database 
//  models.sequelize.sync({ force: true }).then(() => {
 models.sequelize.sync().then(() => {
  console.log("Success!!!!!!");
  app.listen(8081);
}).catch((err)=>{
  console.log(err);
});
