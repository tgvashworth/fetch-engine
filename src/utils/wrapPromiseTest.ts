/// <reference path="../.d.test.ts"/>
import es6Promise = require("es6-promise");
const Promise = es6Promise.Promise;

export default function wrapPromiseTest(
  test: TapeTest
): TapeTest {
  return (t: TapeTestAssertions) =>
    Promise.resolve(test(t))
      .catch(why => t.fail(why));
}
