import { makeExecutableSchema } from 'apollo-server-express';

import { JSONTypeDef } from './types/json';
import { ResponseTypeDef } from './types/response';
import { PingTypeDef } from './types/ping';

import { PingResolver } from './resolvers/ping';
import { JSONResolver } from './resolvers/json';

export const schema = makeExecutableSchema({
  typeDefs: [JSONTypeDef, ResponseTypeDef, PingTypeDef],
  resolvers: { ...PingResolver, ...JSONResolver },
});
