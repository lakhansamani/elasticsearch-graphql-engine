export interface Ping {
  pong: string;
}

export const PingTypeDef = `
  type Ping {
    pong: String!
  }

  type Query {
    ping: Ping!
  }
`;
