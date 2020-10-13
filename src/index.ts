import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { ApolloServer } from 'apollo-server-express';
import { schema } from './schema';
const main = async () => {
  try {
    // create express app
    const app: express.Application = express();

    // add cors middleware
    app.use(cors());

    // add json body parser
    app.use(bodyParser.json());

    const gqPath = '/graphql';
    const apolloServer = new ApolloServer({
      schema,
      introspection: true,
      playground: true,
      context: ({ req, res }) => ({ req, res }),
    });

    apolloServer.applyMiddleware({ app, path: gqPath });

    // bind port and start server
    const port: number = parseInt(process.env.PORT || '3000', 10);
    app.listen(port, () => {
      console.log(`🚀 server started on port: ${port}`);
    });
  } catch (error) {
    console.error(error);
  }
};

main();
