/// <reference path="../.d.test.ts" />
"use strict";
import test = require("ava");
import composeEvery from "./composeEvery";

test("composeEvery is requireable", (t: TestAssertions) => {
  t.ok(composeEvery);
});

test(
  "it composes identity functions to produce passed value",
  (t: TestAssertions) => {
    const id = x => x;
    const f = composeEvery([id, id]);
    t.is(f(true), true);
    t.is(f(false), false);
  }
);

test(
  "it composes value generating functions",
  (t: TestAssertions) => {
    const yes = () => true;
    const no = () => false;
    t.is(composeEvery([yes, yes])(true),  true);
    t.is(composeEvery([yes, yes])(false), true);
    t.is(composeEvery([yes, no ])(true),  false);
    t.is(composeEvery([yes, no ])(false), false);
    t.is(composeEvery([no,  yes])(true),  false);
    t.is(composeEvery([no,  yes])(false), false);
    t.is(composeEvery([no,  no ])(true),  false);
    t.is(composeEvery([no,  no ])(false), false);
  }
);
