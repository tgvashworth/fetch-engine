import test = require("tape");
import composeVoid from "./composeVoid";

test("composeVoid is requireable", (t) => {
  t.plan(1);
  t.ok(composeVoid);
});

test(
  "it passes value to each function and ignores return values",
  (t) => {
    t.plan(3);
    const testVal = {};
    const testFn = (x) => {
      t.equal(x, testVal);
      return {};
    };
    const f = composeVoid([testFn, testFn]);
    const result = f(testVal);
    t.equal(result, undefined);
  },
);
