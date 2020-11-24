import { ApiResponse } from '@elastic/elasticsearch';

import { ESClient } from '../elasticsearch/client';

export const PingResolver = {
  Query: {
    ping: async (): Promise<ApiResponse> => {
      try {
        const response: ApiResponse = await ESClient.getInstance().info();
        return response;
      } catch (err) {
        throw err;
      }
    },
  },
};
