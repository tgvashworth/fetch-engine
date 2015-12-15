/// <reference path="./.d.ts"/>

export default function composeEvery<T>(fns: Array<(T) => boolean>): (T) => boolean {
  type Fn = (T) => boolean;
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
    (r: T): boolean => true
  );
};
