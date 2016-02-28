/// <reference path="../.d.test.ts" />
"use strict";
import test = require("tape");
import composeEvery from "./composeEvery";

test("composeEvery is requireable", (t: TapeTestAssertions) => {
  t.plan(1);
  t.ok(composeEvery);
});

test(
  "it composes identity functions to produce passed value",
  (t: TapeTestAssertions) => {
    t.plan(2);
    const id = x => x;
    const f = composeEvery([id, id]);
    t.equal(f(true), true);
    t.equal(f(false), false);
  }
);

test(
  "it composes value generating functions",
  (t: TapeTestAssertions) => {
    t.plan(8);
    const yes = () => true;
    const no = () => false;
    t.equal(composeEvery([yes, yes])(true),  true);
    t.equal(composeEvery([yes, yes])(false), true);
    t.equal(composeEvery([yes, no ])(true),  false);
    t.equal(composeEvery([yes, no ])(false), false);
    t.equal(composeEvery([no,  yes])(true),  false);
    t.equal(composeEvery([no,  yes])(false), false);
    t.equal(composeEvery([no,  no ])(true),  false);
    t.equal(composeEvery([no,  no ])(false), false);
  }
);
