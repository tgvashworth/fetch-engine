import * as tape from "tape";

export default function wrapPromiseTest(
  test: tape.TestCase,
): tape.TestCase  {
  return (t: tape.Test) =>
    Promise.resolve(test(t))
      .catch((why) => t.fail(why));
}
