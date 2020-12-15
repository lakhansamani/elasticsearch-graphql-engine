import { ApiResponse } from '@elastic/elasticsearch';
import gqFields from 'graphql-fields';

import { ESClient } from '../elasticsearch/client';

interface QueryInterface {
  query: string;
  fields: string[];
  weight: number[];
  from: number;
  size: number;
}
/**
 * Helps in generating dynamic query for elasticsearch indices
 */
export const DynamicQueryResolver = (
  snakeCaseIndexName: string,
  indexName: string,
): any => {
  return {
    [`${snakeCaseIndexName}`]: async (
      _: any,
      {
        query = '*',
        fields = [],
        weight = [],
        from = 0,
        size = 10,
      }: QueryInterface,
      _context: any,
      info: any,
    ) => {
      let esQuery: any = {
        match_all: {},
      };

      if (query !== '*') {
        esQuery = {
          multi_match: {
            query,
          },
        };
      }

      // add fields
      if (fields.length && query !== '*') {
        esQuery.multi_match.fields = fields;
      }
      // add weights
      if (weight.length && query !== '*') {
        esQuery.multi_match.weight = weight;
      }

      // add source field filtering based on fields requested in query

      // gqFields helps in getting the fields requested
      const returnData = gqFields(info);
      let sourceFields: string[] = [];
      if (returnData.hits) {
        sourceFields = Object.keys(returnData.hits);
      }

      // track_total_hits helps in getting the total number of hits even if it is > 10,000 records
      const queryBody: any = {
        query: esQuery,
        track_total_hits: true,
        from,
        size,
      };
      if (sourceFields.length) {
        queryBody._source = {
          includes: sourceFields,
        };
      } else {
        queryBody._source = {
          excludes: '*',
        };
      }

      const response: ApiResponse = await ESClient.getInstance().search({
        index: indexName,
        body: queryBody,
      });

      const {
        hits,
        total: { value },
      } = response.body.hits;

      return {
        total: value,
        hits: hits.map((item: any) => ({
          _id: item._id,
          ...item._source,
        })),
      };
    },
  };
};
