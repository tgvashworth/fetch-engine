/**
 * Pull all implementations of `methodName` from the objects in the `objs` list,
 * bound to the object they were attached to.
 */
export default function getBoundImplementations(
  methodName: string,
  objs: object[],
): any[] {
  return objs
    .filter(
      (obj: object) =>
        typeof obj[methodName] === "function",
    )
    .map(
      (obj: object): any =>
        obj[methodName].bind(obj),
    );
}
