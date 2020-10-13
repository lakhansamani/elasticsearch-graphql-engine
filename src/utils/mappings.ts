import { ESClient } from '../elasticsearch/client';

export const getMappings = async (): Promise<any> => {
  try {
    const mappings = await ESClient.getInstance().indices.getMapping();
    return mappings;
  } catch (err) {
    throw err;
  }
};
