/// <reference path="./.d.ts"/>

export default function composePromise<T>(
  fns: Array<(t: T) => Promise<T>>
): (T) => Promise<T> {
  return (v: T) =>
    fns.reduce(
      (pPrev: Promise<T>, f: (t: T) => Promise<T>): Promise<T> => pPrev.then(f),
      Promise.resolve(v)
    );
};
