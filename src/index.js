import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
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
import { SubscriptionServer } from 'subscriptions-transport-ws';
import formidable from 'formidable';
import DataLoader from "dataloader";
import {channelBatcher,userBatcher} from "./batchFunctions" ;





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

const uploadDir = 'files';

const fileMiddleware = (req, res, next) => {
  if (!req.is('multipart/form-data')) {
    return next();
  }

  const form = formidable.IncomingForm({
    uploadDir,
  });

  form.parse(req, (error, { operations }, files) => {
    if (error) {
      console.log(error);
    }

    const document = JSON.parse(operations);

    if (Object.keys(files).length) {
      const { file: { type, path: filePath } } = files;
      console.log(type);
      console.log(filePath);
      document.variables.file = {
        type,
        path: filePath,
      };
    }

    req.body = document;
    next();
  });
};


const graphqlEndpoint = '/graphql';

const app = express();
app.use(cors('*'));
app.use(addUser);

// bodyParser is needed just for POST.
app.use(
  graphqlEndpoint,
  bodyParser.json(),
  fileMiddleware,
  graphqlExpress(req => ({
    schema,
    context: {
      models,
      user: req.user
      ,
      SECRET,
      SECRET2,
      channelLoader: new DataLoader(ids=> channelBatcher(ids,models,req.user)),
      serverUrl: `${req.protocol}://${req.get('host')}`,
      userLoader: new DataLoader(ids => userBatcher(ids, models)),


    },
  })));
//we tell graphiql what graphql is :)
// app.use('/graphiql', graphiqlExpress({ endpointURL : graphqlEndpoint }));
app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: graphqlEndpoint,
    subscriptionsEndpoint: `ws://localhost:${process.env.TEST_PORT || 8081}/subscriptions`,
  }),
);
//serve static files 
app.use('/files',express.static('files'));
const server = createServer(app);
//force:true
models.sequelize.sync({}).then(() => {
  server.listen(process.env.TEST_PORT || 8081, () => {
    // eslint-disable-next-line no-new
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema,
        onConnect: async ({ token, refreshToken }, webSocket) => {
          if (token && refreshToken) {
            try {
              const { user } = jwt.verify(token, SECRET);
              return { models, user };
            } catch (err) {
              const newTokens = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
              return { models, user: newTokens.user };
            }
          }

          return { models };
        },
      },
      {
        server,
        path: '/subscriptions',
      },
    );
  });
});