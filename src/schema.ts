import { makeExecutableSchema } from 'apollo-server-express';

import { PingTypeDef } from './types/ping';

import { PingResolver } from './resolvers/ping';

export const schema = makeExecutableSchema({
  typeDefs: [PingTypeDef],
  resolvers: { ...PingResolver },
});
