import { ApiResponse } from '@elastic/elasticsearch';

export interface Ping {
  response: ApiResponse;
}

export const PingTypeDef = `
  type Query {
    ping: Response!
  }
`;
