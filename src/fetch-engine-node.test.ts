/// <reference path="./.d.test.ts" />
"use strict";
import test = require("tape");
import wrap from "./utils/wrapPromiseTest";
import fetchEngine, { Request, FetchGroup, Response } from "./fetch-engine-node";

test("node fetchEngine is requireable", t => {
  t.plan(1);
  t.ok(fetchEngine);
});

test("node FetchGroup is requireable", t => {
  t.plan(1);
  t.ok(FetchGroup);
});

test("node Request is requireable", t => {
  t.plan(1);
  t.ok(Request);
});

test("node Response is requireable", t => {
  t.plan(1);
  t.ok(Response);
});

test("browser fetchEngine can make a request to the test server", wrap(t => {
  t.plan(2);
  const req = new Request(
    `/echo/text/${encodeURIComponent("Hello fetch-node")}`
  );
  const fetch = fetchEngine();
  return fetch(req)
    .then(res => {
      t.ok(res);
      return res.text();
    })
    .then(text => {
      t.equal(text, "Hello fetch-node");
    });
}));
