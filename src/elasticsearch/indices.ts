import { ApiResponse } from '@elastic/elasticsearch';
import { ESClient } from './client';

/**
 * function to get indices
 * // TODO add way to filter the aliases and use them instead of index
 */
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
