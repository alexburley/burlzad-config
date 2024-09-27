import type { AnyObject } from './types.js';

export function merge(...objects: AnyObject[]): AnyObject {
  const result: AnyObject = {};

  for (const obj of objects) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (
          typeof value === 'object' &&
          value !== null &&
          !Array.isArray(value) &&
          typeof result[key] === 'object' &&
          result[key] !== null &&
          !Array.isArray(result[key])
        ) {
          // If both the existing value in the result and the new value are objects,
          // recursively merge them
          result[key] = merge(result[key], value);
        } else {
          // Otherwise, just assign the new value
          result[key] = value;
        }
      }
    }
  }

  return result;
}
