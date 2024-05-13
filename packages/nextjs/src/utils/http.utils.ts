/**
 * Constructs a URL with query parameters.
 *
 * @param {string} path - The base path of the URL.
 * @param {Record<string, string | string[] | number | number[] | boolean | undefined>} query - An object representing the query parameters. Each key-value pair in the object will be converted to a query parameter where the key is the parameter name and the value is the parameter value. If the value is an array, it will be converted to a comma-separated string.
 * @returns {string} The constructed URL with query parameters. If the query object is empty, the base path is returned.
 *
 * @example
 * // returns "/path?param1=value1&param2=value2"
 * buildUrl("/path", { param1: "value1", param2: "value2" });
 */
export const buildUrl = (
  path: string,
  query = {} as Record<
    string,
    string | string[] | number | number[] | boolean | undefined
  >,
) => {
  if (Object.keys(query).length === 0) {
    return path;
  }

  const params = Object.entries(query).reduce((acc, [key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      acc[key] = value.toString?.() ?? value;
    }
    return acc;
  }, {} as Record<string, string>);

  const queryString = `?${new URLSearchParams(params).toString()}`;
  return `${path}${queryString}`;
};
