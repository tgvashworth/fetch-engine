/// <reference path="../.d.ts"/>

export default function sideEffect<T>(
  fn: (v: T, ...rest: Array<any>) => any
): (v: T, ...rest: Array<any>) => T  {
  return (v: T, ...rest): T => {
    fn(v, ...rest);
    return v;
  };
}
