/// <reference path="../.d.test.ts" />
"use strict";
import test = require("tape");
import getBoundImplementations from "./getBoundImplementations";

test("getBoundImplementations is requireable", (t: TapeTestAssertions) => {
  t.plan(1);
  t.ok(getBoundImplementations);
});

test(
  "it extracts methods from objects and calls with correct context",
  (t: TapeTestAssertions) => {
    t.plan(5);
    const makeTestObj = (): Object => {
      const self = {
        fn(v): void {
          t.ok(this);
          t.equal(v, true);
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
    t.equal(impls.length, 2);
    impls.forEach(impl => {
      impl(true);
    });
  }
);
