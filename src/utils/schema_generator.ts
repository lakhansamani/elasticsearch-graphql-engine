import { getIndices } from '../elasticsearch/indices';
import { getMappings } from '../elasticsearch/mappings';
import {
  flattenMapping,
  convertMappingToType,
  gqTypesToSchema,
} from './mappings';

export const generateSchema = async (
  defaultIndices: string[] = [],
): Promise<string> => {
  let indices = [...defaultIndices];
  try {
    if (!indices.length) {
      const { body: catIndicesRes } = await getIndices();
      indices = catIndicesRes.map((i: { index: string }) => i.index);
      // by default filter system indices
      indices = indices.filter((i) => i.charAt(0) !== '.');
    }

    if (!indices.length) {
      // do nothing | return null
      return '';
    }
    const { body: mappingsRes } = await getMappings(indices);
    return Object.keys(mappingsRes).reduce((agg: string, indexName: string) => {
      const flatMap = flattenMapping(mappingsRes[indexName].mappings);
      const schemaTypes = convertMappingToType(indexName, flatMap);
      return agg + `\n${gqTypesToSchema(schemaTypes)}`;
    }, '');
  } catch (err) {
    throw err;
  }
};
