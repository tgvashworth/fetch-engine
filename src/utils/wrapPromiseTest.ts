/// <reference path="../.d.test.ts"/>
import { Promise } from "es6-promise";

export default function wrapPromiseTest(
  test: TapeTest
): TapeTest  {
  return (t: TapeTestAssertions) =>
    Promise.resolve(test(t))
      .catch(why => t.fail(why));
}
