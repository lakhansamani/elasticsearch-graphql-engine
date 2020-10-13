import { Ping } from '../types/ping';

export const PingResolver = {
  Query: {
    ping: (): Ping => ({ pong: `Hello World` }),
  },
};
