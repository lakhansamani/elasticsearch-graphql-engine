import { makeExecutableSchema } from 'apollo-server-express';

import { JSONTypeDef } from './types/json';
import { ResponseTypeDef } from './types/response';
import { PingTypeDef } from './types/ping';

import { PingResolver } from './resolvers/ping';
import { JSONResolver } from './resolvers/json';

export const getSchema = (esSchema: string): any => {
  return makeExecutableSchema({
    typeDefs: [JSONTypeDef, ResponseTypeDef, PingTypeDef, esSchema],
    resolvers: { ...PingResolver, ...JSONResolver },
  });
};
