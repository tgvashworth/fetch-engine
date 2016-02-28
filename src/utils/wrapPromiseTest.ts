/// <reference path="../.d.test.ts"/>

export default function wrapPromiseTest(
  test: TapeTest
): TapeTest  {
  return (t: TapeTestAssertions) =>
    Promise.resolve(test(t))
      .catch(why => t.fail(why));
}
