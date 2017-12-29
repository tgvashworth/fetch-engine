type Fn<T> = (v: T, ...rest: any[]) => Promise<T>;

export default function composePromise<T>(
  fns: Array<Fn<T>>,
): Fn<T> {
  return fns.reduceRight(
    (
      next: Fn<T>,
      f: Fn<T>,
    ): Fn<T> => (
      (v: T, ...rest: any[]): Promise<T> =>
        Promise.resolve(v)
          .then((w) => f(w, ...rest))
          .then((x) => next(x, ...rest))
    ),
    (v: T) => Promise.resolve(v),
  );
}
