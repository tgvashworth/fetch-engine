/// <reference path="./.d.test.ts" />
"use strict";
import test = require("ava");
import { fetchEngine, FetchGroup, Request, Response } from "./";

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
  const mockRequest = new Request("/mock");
  const mockResponse = new Response();
  t.true(group.shouldFetch(mockRequest));
  t.true(typeof group.willFetch === "function");
  t.true(typeof group.fetch === "function");
  t.true(typeof group.didFetch === "function");
  return Promise.all([
    group.getRequest(mockRequest),
    group.getResponse(mockResponse)
  ]).then(([req, res]: [Request, Response]): void => {
    t.is(req, mockRequest);
    t.is(res, mockResponse);
  });
});
