export default function sideEffect<T>(
  fn: (v: T, ...rest: any[]) => any,
): (v: T, ...rest: any[]) => T  {
  return (v: T, ...rest): T => {
    fn(v, ...rest);
    return v;
  };
}
