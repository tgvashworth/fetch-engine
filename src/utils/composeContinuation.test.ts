/// <reference path="../.d.test.ts" />
"use strict";
import test = require("tape");
import composeContinuation from "./composeContinuation";

test("composeContinuation is requireable", (t: TapeTestAssertions) => {
  t.plan(1);
  t.ok(composeContinuation);
});

test(
  "it composes no-op functions to produce passed value",
  (t: TapeTestAssertions) => {
    t.plan(2);
    const id = x => x;
    const noop = (_, next) => next();
    const f = composeContinuation([noop, noop]);
    t.equal(f(true, id), true);
    t.equal(f(false, id), false);
  }
);

test(
  "it exits early if next is not called",
  (t: TapeTestAssertions) => {
    t.plan(1);
    const o = {};
    const id = x => x;
    const noop = (_, next) => next();
    const exit = () => o;
    const f = composeContinuation([noop, exit]);
    t.equal(f(true, id), o);
  }
);
