/// <reference path="../.d.test.ts" />
"use strict";
import test = require("ava");
import composeVoid from "./composeVoid";

test("composeVoid is requireable", (t: TestAssertions) => {
  t.ok(composeVoid);
  t.end();
});

test(
  "it passes value to each function and ignores return values",
  (t: TestAssertions) => {
    t.plan(3);
    const testVal = {};
    const testFn = x => {
      t.same(x, testVal);
      return {};
    };
    const f = composeVoid([testFn, testFn]);
    const result = f(testVal);
    t.same(result, undefined);
    t.end();
  }
);
