/**
 * Receives an array of Objects and return the result of
 * reduce them, ignoring nullish or empty indexes.
 * @param arr [...]
 * @returns A valid object
 *
 * Example:
 * ```ts
 * const arr = [{foo: 'bar'}, null, {bar: 'foo'}, {bar: null}]
 * // will be returned as:
 * { foo: 'bar', bar: 'foo' }
 * ```
 */
export function reduceIgnoringNullish<R = any>(
  query: (R | false | null | undefined)[],
): R {
  return query
    .filter(Boolean)
    .map((obj: any) => {
      return Object.entries(obj)
        .filter(([_, value]) => value !== null)
        .reduce((acc: any, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {} as Record<string, any>);
    })
    .reduce((acc: any, curr: any) => {
      acc = { ...acc, ...curr };
      return acc;
      /* eslint-disable-next-line */
    }, {} as Record<string, any>);
}

/**
 * Receive an array of object and convert them into a
 * Map, using the received property as key for the resultant
 * object.
 *
 * Example:
 * ```ts
 * const arr = [{foo:1, bar:'A'},{foo:2, bar:'B'}];
 * // Will be returned as
 * {
 *  1: {foo:1, bar:'A'},
 *  2: {foo:2, bar:'B'}
 * }
 * ```
 */
export function arrayToMapByKey<T>(
  arr: T[],
  keyProp: keyof Partial<T>,
  keyTransform?: (elem: any) => string,
): Map<string, T> {
  const map = new Map();
  arr.forEach(elem => {
    let key: string = `${elem[keyProp]}`;
    if (keyTransform) key = keyTransform(key);
    map.set(key.toString(), elem);
  });
  return map;
}

/**
 * Receive an array of object and convert them into a
 * Map, using the received property as key to group
 * the objects into an array.
 *
 * Example:
 * ```ts
 * const arr = [{foo:1, bar:'A'},{foo:1, bar:'B'}];
 * // Will be returned as
 * {
 *  1: [{foo:1, bar:'A'},{foo:2, bar:'B'}],
 * }
 * ```
 */
export function arrayToMapArrByKey<T extends object>(
  arr: T[],
  keyProp: keyof Partial<T>,
  keyTransform?: (elem: any) => string,
): Map<string, T[]> {
  const map = new Map();
  arr.forEach(elem => {
    let key: string = `${elem[keyProp]}`;
    if (keyTransform) key = keyTransform(key);
    if (map.has(key.toString())) {
      const curr = map.get(key.toString());
      map.set(key.toString(), [...curr, elem]);
      return;
    } else {
      map.set(key.toString(), [elem]);
    }
  });
  return map;
}

/**
 * Receives an array of keys and a object and returns whether
 * the object has any of the keys.
 * @param arr [...]
 * @param obj {}
 * @returns A boolean
 *
 * Example:
 * ```ts
 * const arr = ['round', 'time', 'remainingPlayersMin', 'remainingPlayersMax']
 * const obj = { round: '7', foo: 'bar', bar: 'foo }
 * hasObjectKeyFromArray(arr, obj) // will return true
 * ```
 */
export function hasObjectKeyFromArray(arr: any[], obj: Record<string, any>) {
  return arr.some(key => obj.hasOwnProperty(key) && obj[key] != null);
}
