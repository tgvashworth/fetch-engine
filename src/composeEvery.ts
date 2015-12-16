/// <reference path="./.d.ts"/>

export default function composeEvery<T>(
  fns: Array<(v: T) => boolean>
): (v: T) => boolean {
  type Fn = (v: T) => boolean;
  return fns.reduceRight(
    (
      next: Fn,
      f: Fn
    ): Fn => (
      (v: T): boolean => (
        f(v)
          ? next(v)
          : false
      )
    ),
    (_: T): boolean => true
  );
};
