import { ESClient } from '../elasticsearch/client';

export const getMappings = async (): Promise<Record<string, any>> => {
  try {
    const mappingsRes = await ESClient.getInstance().indices.getMapping();

    if (mappingsRes.statusCode !== 200) {
      console.error(mappingsRes);
      throw new Error(`Error getting mappings : ${mappingsRes.statusCode}`);
    }

    // return only properties from mappings
    return Object.keys(mappingsRes.body).reduce((mappings, item) => {
      return {
        ...mappings,
        [item]: mappingsRes.body[item].mappings?.properties || {},
      };
    }, {});
  } catch (err) {
    throw err;
  }
};
