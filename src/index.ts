import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import fs from 'fs';
import { getSchema } from './schema';
import { bootTimeValidation } from './utils/boot_validation';

import { generateSchema } from './utils/schema_generator';

const main = async () => {
  try {
    // throws error if correct envs are not present
    bootTimeValidation();

    // create express app
    const app: express.Application = express();

    // add cors middleware
    app.use(cors());

    // add json body parser
    app.use(bodyParser.json());

    const gqPath = '/graphql';

    const { typeDef, resolvers } = await generateSchema();
    fs.writeFileSync(`${__dirname}/types/es_types.graphql`, <string>typeDef);
    const apolloServer = new ApolloServer({
      schema: getSchema(<string>typeDef, <Record<string, unknown>>resolvers),
      introspection: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, path: gqPath });

    // bind port and start server
    const port: number = parseInt(process.env.PORT || '3000', 10);
    app.listen(port, async () => {
      console.log(`🚀 server started on port: ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

main();
