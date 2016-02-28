/// <reference path="../.d.test.ts" />
"use strict";
import test = require("tape");
import composePromise from "./composePromise";

test("composePromise is requireable", (t: TapeTestAssertions) => {
  t.plan(1);
  t.ok(composePromise);
});

test(
  "it composes identity functions to produce passed value",
  (t: TapeTestAssertions) => {
    t.plan(1);
    const promiseId = x => Promise.resolve(x);
    const f = composePromise([promiseId, promiseId]);
    return f(true)
      .then(v => {
        t.equal(v, true);
      });
  }
);

test(
  "it composes increment functions to produce passed value",
  (t: TapeTestAssertions) => {
    t.plan(1);
    const promiseInc = x => Promise.resolve(x + 1);
    const f = composePromise([promiseInc, promiseInc]);
    return f(0)
      .then(v => {
        t.equal(v, 2);
      });
  }
);

test(
  "it produces correct value when there are no fns",
  (t: TapeTestAssertions) => {
    t.plan(1);
    const f = composePromise([]);
    return f(true)
      .then(v => {
        t.equal(v, true);
      });
  }
);
