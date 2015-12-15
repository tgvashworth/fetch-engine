/// <reference path="./.d.ts"/>

/**
 * Pull all implementations of `methodName` from the objects in the `objs` list,
 * bound to the object they were attached to.
 */
export default function getBoundImplementations(
  methodName: string,
  objs: Array<Object>
): Array<any> {
  return objs
    .filter(
      (obj: Object) =>
        typeof obj[methodName] === "function"
    )
    .map(
      (obj: Object): any =>
        obj[methodName].bind(obj)
    );
}
