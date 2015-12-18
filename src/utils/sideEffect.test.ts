/// <reference path="../.d.test.ts" />
"use strict";
import test = require("ava");
import sideEffect from "./sideEffect";

test("sideEffect is requireable", (t: TestAssertions) => {
  t.ok(sideEffect);
  t.end();
});

test(
  "it returns passed in value",
  (t: TestAssertions) => {
    t.plan(2);
    const id = x => x;
    const f = sideEffect(id);
    t.is(f(true), true);
    t.is(f(false), false);
    t.end();
  }
);

test(
  "calls supplied function",
  (t: TestAssertions) => {
    t.plan(1);
    const inner = x => {
      t.same(x, true);
      return false;
    };
    sideEffect(inner)(true);
    t.end();
  }
);

test(
  "passes many arguments to supplied function",
  (t: TestAssertions) => {
    t.plan(2);
    const inner = (x, y) => {
      t.same(x, true);
      t.same(y, false);
    };
    sideEffect(inner)(true, false);
    t.end();
  }
);

test(
  "ignored function's return value",
  (t: TestAssertions) => {
    t.plan(1);
    const result = sideEffect(_ => false)(true);
    t.same(result, true);
    t.end();
  }
);
