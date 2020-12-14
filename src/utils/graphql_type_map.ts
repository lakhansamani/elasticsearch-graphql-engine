/**
 * Map for mapping the ES types to GraphqlTypes
 */
export const GraphqlTypeMap: Record<string, string> = {
  keyword: 'String',
  string: 'String',
  text: 'String',
  long: 'Int',
  integer: 'Int',
  short: 'Int',
  byte: 'Int',
  double: 'Float',
  float: 'Float',
  half_float: 'Float',
  scaled_float: 'Float',
  boolean: 'Boolean',
  date: 'String',
};
