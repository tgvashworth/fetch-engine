/// <reference path="./.d.test.ts" />
"use strict";
import test = require("ava");
import { fetchEngine, FetchGroup, Request, Response } from "./";

class ShouldFetchPlugin implements FetchEnginePlugin {
  innerShouldFetch: boolean = true;
  constructor(shouldFetch: boolean) {
    this.innerShouldFetch = shouldFetch;
  }
  shouldFetch(req: Request): boolean {
    return this.innerShouldFetch;
  }
}

test("fetchEngine is requireable", (t: TestAssertions) => {
  t.ok(fetchEngine);
  t.end();
});

test("FetchGroup is requireable", (t: TestAssertions) => {
  t.ok(FetchGroup);
  t.end();
});

test("FetchGroup has default plugin implementations", (t: TestAssertions) => {
  const group = new FetchGroup();
  const mockRequest = new Request("/mock");
  const mockResponse = new Response();
  t.true(group.shouldFetch(mockRequest));
  t.true(typeof group.willFetch === "function");
  t.true(typeof group.fetch === "function");
  t.true(typeof group.didFetch === "function");
  return Promise.resolve()
    .then(() => group.getRequest(mockRequest))
    .then((req: Request) => {
      t.is(req, mockRequest);
    })
    .then(() => group.getResponse(mockResponse))
    .then((res: Response) => {
      t.is(res, mockResponse);
    });
});

test("FetchGroup composes plugin shouldFetch", (t: TestAssertions) => {
  const specs = [
    [
      new FetchGroup({
        plugins: [
          new ShouldFetchPlugin(true),
          new ShouldFetchPlugin(false)
        ]
      }),
      false
    ],
    [
      new FetchGroup({
        plugins: [
          new ShouldFetchPlugin(true),
          new ShouldFetchPlugin(true)
        ]
      }),
      true
    ]
  ];
  const mockRequest = new Request("/mock");
  specs.forEach(([group, expected]: [FetchGroup, boolean]) => {
    t.same(group.shouldFetch(mockRequest), expected);
  });
  t.end();
});
