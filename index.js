import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress,graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import typeDefs from './schema';
import  resolvers from './resolvers';

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
});
const PORT = 8081;
const graphqlEndpoint = '/graphql';

const app = express();

// bodyParser is needed just for POST.
app.use(graphqlEndpoint, bodyParser.json(), graphqlExpress({ schema }));
//we tell graphiql what graphql is :)
app.use('/graphiql', graphiqlExpress({ endpointURL : graphqlEndpoint }));

app.listen(PORT);