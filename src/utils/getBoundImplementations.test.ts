/// <reference path="../.d.test.ts" />
"use strict";
import test = require("ava");
import getBoundImplementations from "./getBoundImplementations";

test("getBoundImplementations is requireable", (t: TestAssertions) => {
  t.ok(getBoundImplementations);
});

test(
  "it extracts methods from objects and calls with correct context",
  (t: TestAssertions) => {
    t.plan(5);
    const makeTestObj = (): Object => {
      const self = {
        fn(v): void {
          t.ok(this);
          t.is(v, true);
        }
      };
      return self;
    };

    const objs: Array<any> = [
      makeTestObj(),
      makeTestObj(),
      {}
    ];
    const impls = getBoundImplementations("fn", objs);
    t.is(impls.length, 2);
    impls.forEach(impl => {
      impl(true);
    });
  }
);
