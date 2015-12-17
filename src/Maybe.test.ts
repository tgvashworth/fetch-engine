/// <reference path="./.d.test.ts" />
"use strict";
import test = require("ava");
import jsc = require("jsverify");
import deepEqual = require("deeper");
import * as Maybe from "./Maybe";

test("Maybe is requireable", (t: TestAssertions) => {
  t.ok(Maybe);
  t.end();
});

test("Making a maybe value gives a Some", (t: TestAssertions) => {
  jsc.assert(jsc.forall("nat", (i: number) => {
    return deepEqual(Maybe.some(i), new Maybe.Some(i));
  }));
  t.end();
});

test("Making a None", (t: TestAssertions) => {
  t.ok(new Maybe.None());
  t.end();
});

test("Mapping Some gives a Some", (t: TestAssertions) => {
  const inc = (x: number) => x + 1;
  jsc.assert(jsc.forall("nat", (i: number) => {
    return deepEqual(Maybe.some(i).map(inc), new Maybe.Some(i + 1));
  }));
  t.end();
});

test("Mapping the identity gives the same object", (t: TestAssertions) => {
  const id = (x) => x;
  jsc.assert(jsc.forall("nat", (i: number) => {
    return deepEqual(Maybe.some(i).map(id), new Maybe.Some(i));
  }));
  t.end();
});

test("Mapping None gives a None", (t: TestAssertions) => {
  const inc = (x: number) => x + 1;
  jsc.assert(jsc.forall("nat", (i: number) => {
    const none = new Maybe.None();
    return deepEqual(none.map(inc), new Maybe.None());
  }));
  t.end();
});

test("Mapping None gives a None", (t: TestAssertions) => {
  const inc = (x: number) => x + 1;
  jsc.assert(jsc.forall("nat", (i: number) => {
    const none = new Maybe.None();
    return deepEqual(none.map(inc), new Maybe.None());
  }));
  t.end();
});
