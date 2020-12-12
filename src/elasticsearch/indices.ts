import { ApiResponse } from '@elastic/elasticsearch';
import { ESClient } from './client';

export const getIndices = async (): Promise<ApiResponse> => {
  try {
    return await ESClient.getInstance().cat.indices({
      expand_wildcards: 'open',
      format: 'json',
    });
  } catch (err) {
    throw err;
  }
};
