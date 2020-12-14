export interface Response {
  body: Record<string, unknown>;
  statusCode: number;
  headers: Record<string, unknown>;
  meta: Record<string, unknown>;
}

export const ResponseTypeDef = `
    type Response {
        body: JSONObject!
        statusCode: Int!
        headers: JSONObject!
        meta: JSONObject!
    }
`;
