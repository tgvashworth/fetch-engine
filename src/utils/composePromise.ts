export default function composePromise<T>(
  fns: Array<(t: T) => Promise<T>>,
): (T) => Promise<T> {
  type Fn = (v: T) => Promise<T>;
  return fns.reduceRight(
    (
      next: Fn,
      f: Fn,
    ): Fn => (
      (v: T): Promise<T> => Promise.resolve(v).then(f).then(next)
    ),
    (v: T): Promise<T> => Promise.resolve(v),
  );
}
