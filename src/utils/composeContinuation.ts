/// <reference path="../.d.ts"/>

export type BaseFn<T, U> = (v: T) => U;
export type ComposedFn<T, U> = (v: T, base: BaseFn<T, U>) => U;
export type InputFn<T, U> = (v: T, next: () => U) => U;

export default function composeContinuation<T, U>(
  fns: Array<InputFn<T, U>>
): ComposedFn<T, U> {
  return fns.reduceRight(
    // 'next' is always a function that takes a value (some T) and a 'base'
    // function to call if needs be. The calling of that function is taken care
    // of by the reduce becuase it is passed all the way through the chain.
    // Each 'fn' is a input function, in that it does not need to pass its
    // value argument (some T) through to the 'next' function — it can just
    // 'return next()', and rely on the original argument to be passed through.
    // This also prevents users altering the input argument (apart from in-place
    // mutation).
    (next: ComposedFn<T, U>, fn: InputFn<T, U>): ComposedFn<T, U> => {
      // We return another composed function, which will be the 'next' for the
      // next input function.
      return (v: T, base: BaseFn<T, U>): U => {
        // The innermost function here tries each input function in turn, but
        // allows it to pass control onto the next in the chain.
        return fn(v, () => next(v, base));
      };
    },
    // This is the innermost function of the composition. It just passes the
    // value (some T) into the base function that will have been passed through
    // the chain up to this point.
    (v: T, base: BaseFn<T, U>): U => base(v)
  );
};
