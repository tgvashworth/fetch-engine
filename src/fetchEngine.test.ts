/// <reference path="./.d.test.ts" />
"use strict";
import test = require("ava");
import fetchEngine from "./fetchEngine";
import FetchGroup from "./FetchGroup";
import { Mock, MockRequest, MockResponse } from "./utils/mocks";

test("fetchEngine is requireable", (t: TestAssertions) => {
  t.ok(fetchEngine);
});

test("fetchEngine with no args returns a response", (t: TestAssertions) => {
  const fetch = fetchEngine();
  return fetch(new MockRequest("/mock"))
    .then((res: FetchResponse) => {
      t.ok(res);
    });
});

test("fetchEngine with shouldFetch false throws", (t: TestAssertions) => {
  const fetch = fetchEngine(new FetchGroup({
    plugins: [
      new Mock({
        shouldFetch: (): boolean => false
      })
    ]
  }));
  return t.throws(
    fetch(new MockRequest("/mock")),
    Error
  );
});

test(
  "fetchEngine with getRequest passes transformed request to willFetch",
  (t: TestAssertions) => {
    t.plan(2);
    const firstMockReq = new MockRequest("/mock");
    const secondMockReq = new MockRequest("/mock/other");
    const fetch = fetchEngine(new FetchGroup({
      plugins: [
        new Mock({
          getRequest: (req: FetchRequest): Promise<FetchRequest> => {
            t.same(req, firstMockReq);
            return Promise.resolve(secondMockReq);
          },
          willFetch: (req: FetchRequest): void => {
            t.same(req, secondMockReq);
          }
        })
      ]
    }));
    return fetch(firstMockReq);
  }
);

test(
  "fetchEngine with fetching passes promise and original request",
  (t: TestAssertions) => {
    t.plan(3);
    const mockReq = new MockRequest("/mock");
    const fetch = fetchEngine(new FetchGroup({
      plugins: [
        new Mock({
          fetching: (args: FetchFetchingArgs): void => {
            t.same(args.request, mockReq);
            t.ok(args.promise);
            t.same(typeof args.promise.then, "function");
          }
        })
      ]
    }));
    return fetch(mockReq);
  }
);

test(
  "fetchEngine with getResponse passes transformed response to didFetch",
  (t: TestAssertions) => {
    t.plan(1);
    const mockReq = new MockRequest("/mock");
    const mockRes = new MockResponse();
    const fetch = fetchEngine(new FetchGroup({
      plugins: [
        new Mock({
          getResponse: (res: FetchResponse): Promise<FetchResponse> => {
            return Promise.resolve(mockRes);
          },
          didFetch: (res: FetchResponse): void => {
            t.same(res, mockRes);
          }
        })
      ]
    }));
    return fetch(mockReq);
  }
);

test(
  "fetchEngine flows through full stack in order",
  (t: TestAssertions) => {
    t.plan(5);
    const firstMockReq = new MockRequest("/mock");
    const secondMockReq = new MockRequest("/mock");
    const firstMockRes = new MockResponse();
    const fetch = fetchEngine(new FetchGroup({
      plugins: [
        new Mock({
          shouldFetch: (req: FetchRequest): boolean => {
            t.same(req, firstMockReq);
            return true;
          },
          getRequest: (req: FetchRequest): Promise<FetchRequest> => {
            t.same(req, firstMockReq);
            return Promise.resolve(secondMockReq);
          },
          willFetch: (req: FetchRequest): void => {
            t.same(req, secondMockReq);
          },
          fetching: (args: FetchFetchingArgs): void => {
            t.same(args.request, secondMockReq);
          },
          getResponse: (res: FetchResponse): Promise<FetchResponse> => {
            // TODO find a way to fake the retured response
            return Promise.resolve(firstMockRes);
          },
          didFetch: (res: FetchResponse): void => {
            t.same(res, firstMockRes);
          }
        })
      ]
    }));
    return fetch(firstMockReq);
  }
);
