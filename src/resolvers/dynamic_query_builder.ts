import { ApiResponse } from '@elastic/elasticsearch';
import gqFields from 'graphql-fields';

import { ESClient } from '../elasticsearch/client';

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
      }: { query: string; fields: string[]; weight: number[] },
      _context: any,
      info: any,
    ) => {
      const returnData = gqFields(info);
      let sourceFields: string[] = [];
      if (returnData.hits) {
        sourceFields = Object.keys(returnData.hits);
      }

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

      const queryBody: any = { query: esQuery, track_total_hits: true };
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
