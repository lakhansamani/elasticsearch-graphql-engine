import { format } from 'graphql-formatter';
import { GraphqlTypeMap } from './graphql_type_map';
import { convertToPascalCase } from './pascal_case';

export const flattenMapping = (
  mappings: Record<string, unknown>,
): Record<string, unknown> => {
  const properties = <
    Record<
      string,
      {
        fields?: Record<
          string,
          {
            type: string;
          }
        >;
        type?: string;
        properties?: Record<string, unknown>;
      }
    >
  >mappings.properties;

  return Object.keys(properties).reduce((agg, item: string) => {
    // flatten properties in graph form
    if (properties[item].properties) {
      return {
        ...agg,
        [item]: flattenMapping(properties[item]),
      };
    }

    // flatten sub fields
    if (properties[item].fields) {
      return {
        ...agg,
        [item]: properties[item].type,
        ...Object.keys(properties[item].fields || {}).reduce(
          (fieldAgg, field: string) => ({
            ...fieldAgg,
            [`${item}__${field}`]: (properties[item].fields || {})[field].type,
          }),
          {},
        ),
      };
    }

    return {
      ...agg,
      [item]: properties[item].type,
    };
  }, {});
};

export const convertMappingToType = (
  prefix: string,
  flattenMapping: Record<string, unknown>,
): Record<string, unknown> => {
  const indexType = Object.keys(flattenMapping).reduce(
    (agg: Record<string, unknown>, item: string) => {
      if (typeof flattenMapping[item] === 'object') {
        // return agg + `\n${item}: type_${indexName}_${item}\n`;
        const newPrefix = `${prefix}_${item}`;
        const currentSchema = convertToPascalCase(prefix);

        return {
          ...agg,
          [currentSchema]: {
            ...(<Record<string, unknown>>agg[currentSchema]),
            [item]: convertToPascalCase(newPrefix),
          },
          ...convertMappingToType(
            newPrefix,
            <Record<string, unknown>>flattenMapping[item],
          ),
        };
      }

      const schemaName = convertToPascalCase(prefix);
      return {
        ...agg,
        [schemaName]: {
          ...(<Record<string, unknown>>(agg[schemaName] || {})),
          [item]: GraphqlTypeMap[<string>flattenMapping[item]],
        },
      };
    },
    {},
  );
  return indexType;
};

export const gqTypesToSchema = (gqTypeMap: Record<string, unknown>): string => {
  return Object.keys(gqTypeMap).reduce((agg: string, item: string) => {
    return (
      agg +
      format(
        `\ntype ${item} {
          ${Object.keys(<Record<string, unknown>>gqTypeMap[item]).reduce(
            (mapAgg, field) => {
              return (
                mapAgg +
                `\n ${field}: ${<string>(
                  (<Record<string, unknown>>gqTypeMap[item])[field]
                )}`
              );
            },
            '',
          )}
        \n}`,
      )
    );
  }, '');
};
