import type { AnyObject } from './types.js';

export function flatten(
  obj: AnyObject,
  prefix: string = '',
  result: AnyObject = {},
): AnyObject {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value)
      ) {
        flatten(value, newKey, result);
      } else {
        result[newKey] = value;
      }
    }
  }
  return result;
}
