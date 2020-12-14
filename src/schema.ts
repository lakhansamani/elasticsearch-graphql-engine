import { makeExecutableSchema } from 'apollo-server-express';

import { JSONTypeDef } from './types/json';
import { ResponseTypeDef } from './types/response';

import { PingResolver } from './resolvers/ping';
import { JSONResolver } from './resolvers/json';

export const getSchema = (
  typeDefs: string,
  resolvers: Record<string, unknown>,
): any => {
  return makeExecutableSchema({
    typeDefs: [JSONTypeDef, ResponseTypeDef, typeDefs],
    resolvers: {
      ...PingResolver,
      ...JSONResolver,
      ...resolvers,
    },
  });
};
