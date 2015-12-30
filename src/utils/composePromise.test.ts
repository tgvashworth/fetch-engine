/// <reference path="../.d.test.ts" />
"use strict";
import test = require("ava");
import composePromise from "./composePromise";

test("composePromise is requireable", (t: TestAssertions) => {
  t.ok(composePromise);
});

test(
  "it composes identity functions to produce passed value",
  (t: TestAssertions) => {
    const promiseId = x => Promise.resolve(x);
    const f = composePromise([promiseId, promiseId]);
    return f(true)
      .then(v => {
        t.same(v, true);
      });
  }
);

test(
  "it composes increment functions to produce passed value",
  (t: TestAssertions) => {
    const promiseInc = x => Promise.resolve(x + 1);
    const f = composePromise([promiseInc, promiseInc]);
    return f(0)
      .then(v => {
        t.same(v, 2);
      });
  }
);

test(
  "it produces correct value when there are no fns",
  (t: TestAssertions) => {
    const f = composePromise([]);
    return f(true)
      .then(v => {
        t.same(v, true);
      });
  }
);
