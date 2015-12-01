/// <reference path="./.d.test.ts" />
"use strict";
import test = require("ava");
import * as Maybe from "./Maybe";

test("Maybe is requireable", (t: TestAssertions) => {
  t.ok(Maybe);
  t.end();
});

test("Making a maybe value gives a Some", (t: TestAssertions) => {
  t.ok(Maybe.some(10));
  t.same(Maybe.some(10), new Maybe.Some(10));
  t.end();
});

test("Making a None", (t: TestAssertions) => {
  t.ok(new Maybe.None());
  t.end();
});

test("Mapping Some gives a Some", (t: TestAssertions) => {
  const inc = (x: number) => x + 1;
  t.same(Maybe.some(10).map(inc), new Maybe.Some(11));
  t.end();
});

test("Mapping None gives a None", (t: TestAssertions) => {
  const inc = (x: number) => x + 1;
  const none = new Maybe.None();
  t.same(none.map(inc), new Maybe.None());
  t.end();
});
