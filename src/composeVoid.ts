/// <reference path="./.d.ts"/>

export default function composeVoid<T>(
  fns: Array<(v: T) => any>
): (v: T) => void {
  type Fn = (v: T) => any;
  return fns.reduceRight(
    (
      next: Fn,
      f: Fn
    ): Fn => (
      (v: T): any => {
        f(v);
        next(v);
      }
    ),
    (_: T): any => {}
  );
};
