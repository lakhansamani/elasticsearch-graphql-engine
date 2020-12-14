import { format } from 'graphql-formatter';
import { getIndices } from '../elasticsearch/indices';
import { getMappings } from '../elasticsearch/mappings';
import {
  flattenMapping,
  convertMappingToType,
  gqTypesToSchema,
} from './mappings';
import { convertToPascalCase } from './pascal_case';
import { convertToSnakeCase } from './snake_case';
import { DynamicQueryResolver } from '../resolvers/dynamic_query_builder';

/**
 * Helps in generating schema, query, resolvers for given indices
 * @param defaultIndices list of indices for which the schema, query + resolvers are to be generated
 */
export const generateSchema = async (
  defaultIndices: string[] = [],
): Promise<Record<string, unknown>> => {
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
      return {};
    }
    const { body: mappingsRes } = await getMappings(indices);

    const mappings: any = Object.keys(mappingsRes).reduce(
      (agg, indexName: string) => {
        const pascalCaseIndexName = convertToPascalCase(indexName);
        return {
          ...agg,
          [pascalCaseIndexName]: {
            original_index_name: indexName,
            ...mappingsRes[indexName],
          },
        };
      },
      {},
    );

    /**
     * return [schema, queries, resolvers]
     */
    const data = Object.keys(mappings).reduce(
      ({ schemas, queries, resolvers }, indexName: string) => {
        const snakeCaseIndexName = convertToSnakeCase(indexName);
        const flatMap = flattenMapping(mappings[indexName].mappings);
        if (Object.keys(flatMap).length) {
          const schemaTypes = convertMappingToType(indexName, flatMap);

          // add query response type to schema, so that we can add some meta fields to response of query, eg total.
          const newSchemas =
            schemas +
            `${gqTypesToSchema(schemaTypes)}\n` +
            `\n
          type ${indexName}SearchQueryResponse {
            total: Int
            hits: [${indexName}]
          }
        `;
          const newQueries =
            queries +
            `${snakeCaseIndexName}(query: String, fields: [String], weights: [Float]): ${indexName}SearchQueryResponse\n`;
          const newResolvers = {
            ...resolvers,
            ...DynamicQueryResolver(
              snakeCaseIndexName,
              mappings[indexName].original_index_name,
            ),
          };
          return {
            schemas: newSchemas,
            queries: newQueries,
            resolvers: newResolvers,
          };
        }
        return {
          schemas,
          queries,
          resolvers,
        };
      },
      { schemas: '', queries: '', resolvers: {} },
    );
    const queries = `type Query {
      ping: Response!
      ${data.queries}
    }`;
    return {
      typeDef: format(`${data.schemas}${queries}`),
      resolvers: { Query: data.resolvers },
    };
  } catch (err) {
    throw err;
  }
};
