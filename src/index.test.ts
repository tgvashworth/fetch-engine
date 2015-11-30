/// <reference path="./.d.test.ts" />
"use strict";
import test = require("ava");
import { fetchEngine, FetchGroup, Request } from "./";

test("fetchEngine is requireable", (t: TestAssertions) => {
  t.ok(fetchEngine);
  t.end();
});

test("FetchGroup is requireable", (t: TestAssertions) => {
  t.ok(FetchGroup);
  t.end();
});

test("FetchGroup acts like a plugin", (t: TestAssertions) => {
  const group = new FetchGroup();
  t.true(group.shouldFetch(new Request("/mock")));
  t.end();
});
