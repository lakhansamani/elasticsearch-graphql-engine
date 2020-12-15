import { format } from 'graphql-formatter';
import { GraphqlTypeMap } from './graphql_type_map';
import { convertToPascalCase } from './pascal_case';

/**
 * Flattens the mapping
 * @param mappings mapping object
 */
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
  if (!properties) {
    return {};
  }
  return Object.keys(properties).reduce((agg, item: string) => {
    const fieldName = item
      .replace(/[^A-Z0-9]/gi, '_')
      .replace(/__(.*)__/, '$1');
    if (properties[item].properties) {
      return {
        ...agg,

        [fieldName]: flattenMapping(properties[item]),
      };
    }

    // flatten sub fields
    // if (properties[item].fields) {
    //   return {
    //     ...agg,
    //     [item]: properties[item].type,
    //     ...Object.keys(properties[item].fields || {}).reduce(
    //       (fieldAgg, field: string) => ({
    //         ...fieldAgg,
    //         [`${item}__${field}`]: (properties[item].fields || {})[field].type,
    //       }),
    //       {},
    //     ),
    //   };
    // }

    return {
      ...agg,
      [fieldName]: properties[item].type,
    };
  }, {});
};

/**
 * Helps in getting all the graphql type definition objects based on mappings
 * @param prefix index name / sub object name
 * @param flattenMapping flat mappings obtained using above method, i.e. flattenMapping
 * @param isInitialRecursion helps in determining if _id field is to be added or not
 */

export const convertMappingToType = (
  prefix: string,
  flattenMapping: Record<string, unknown>,
  isInitialRecursion = true,
): Record<string, unknown> => {
  const indexType = Object.keys(flattenMapping).reduce(
    (agg: Record<string, unknown>, item: string) => {
      const schemaName = convertToPascalCase(prefix);
      if (typeof flattenMapping[item] === 'object') {
        // return agg + `\n${item}: type_${indexName}_${item}\n`;
        const newPrefix = convertToPascalCase(`${prefix}_${item}`);

        return {
          ...agg,
          [schemaName]: {
            ...(<Record<string, unknown>>agg[schemaName]),
            [item]: newPrefix,
          },
          ...convertMappingToType(
            newPrefix,
            <Record<string, unknown>>flattenMapping[item],
            false,
          ),
        };
      }

      const idObj: { _id?: string } = {};
      if (isInitialRecursion) {
        idObj._id = 'ID';
      }
      return {
        ...agg,
        [schemaName]: {
          ...idObj,
          ...(<Record<string, unknown>>(agg[schemaName] || {})),
          [item]: GraphqlTypeMap[<string>flattenMapping[item]] || 'String',
        },
      };
    },
    {},
  );
  return indexType;
};

/**
 * converts the type definition object obtained using above function to graphql type string
 * @param gqTypeMap mappings -> TypeDefinition object
 */
export const gqTypesToSchema = (gqTypeMap: Record<string, unknown>): string => {
  return Object.keys(gqTypeMap).reduce((agg: string, item: string) => {
    return (
      agg +
      '\n' +
      format(
        `type ${item} {
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
