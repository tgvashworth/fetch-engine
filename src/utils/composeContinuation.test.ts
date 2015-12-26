/// <reference path="../.d.test.ts" />
"use strict";
import test = require("ava");
import composeContinuation from "./composeContinuation";

test("composeContinuation is requireable", (t: TestAssertions) => {
  t.ok(composeContinuation);
  t.end();
});

test(
  "it composes no-op functions to produce passed value",
  (t: TestAssertions) => {
    const id = x => x;
    const noop = (_, next) => next();
    const f = composeContinuation([noop, noop]);
    t.is(f(true, id), true);
    t.is(f(false, id), false);
    t.end();
  }
);

test(
  "it exits early if next is not called",
  (t: TestAssertions) => {
    const o = {};
    const id = x => x;
    const noop = (_, next) => next();
    const exit = () => o;
    const f = composeContinuation([noop, exit]);
    t.is(f(true, id), o);
    t.end();
  }
);
