/// <reference path="./.d.test.ts" />
"use strict";
import test = require("tape");
import wrap from "./utils/wrapPromiseTest";
import makeFetchEngine from "./fetchEngine";
import FetchGroup from "./FetchGroup";
import { Mock, mockFetch } from "./utils/mocks";
import Request from "./Request";
import Response from "./Response";

test("makeFetchEngine is requireable", (t: TapeTestAssertions) => {
  t.plan(1);
  t.ok(makeFetchEngine);
});

test(
  "fetchEngine with no args returns a response",
  wrap((t: TapeTestAssertions) => {
    t.plan(1);
    const fetch = makeFetchEngine(mockFetch)();
    return fetch(new Request("/mock"))
      .then((res: FetchResponse) => {
        t.ok(res);
      });
  })
);

test(
  "fetchEngine with shouldFetch false throws",
  wrap((t: TapeTestAssertions) => {
    t.plan(1);
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        new Mock({
          shouldFetch: (): boolean => false
        })
      ]
    }));
    return fetch(new Request("/mock"))
      .then(
        () => t.fail(),
        (err) => {
          t.equal(
            err.message,
            "shouldFetch prevented the request from being made"
          );
        }
      );
  })
);

test(
  "fetchEngine with getRequest passes transformed request to willFetch",
  wrap((t: TapeTestAssertions) => {
    t.plan(2);
    const firstMockReq = new Request("/mock");
    const secondMockReq = new Request("/mock/other");
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        new Mock({
          getRequest: (req: FetchRequest): Promise<FetchRequest> => {
            t.deepEqual(req, firstMockReq);
            return Promise.resolve(secondMockReq);
          },
          willFetch: (req: FetchRequest): void => {
            t.deepEqual(req, secondMockReq);
          }
        })
      ]
    }));
    return fetch(firstMockReq);
  })
);

test(
  "fetchEngine with fetch passes request and next function",
  wrap((t: TapeTestAssertions) => {
    t.plan(2);
    const mockReq = new Request("/mock");
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        new Mock({
          fetch: (
            req: FetchRequest,
            next: () => Promise<FetchResponse>
          ): Promise<FetchResponse> => {
            t.deepEqual(req, mockReq);
            t.equal(typeof next, "function");
            return next();
          }
        })
      ]
    }));
    return fetch(mockReq);
  })
);

test(
  "fetchEngine with fetching passes promise and original request",
  wrap((t: TapeTestAssertions) => {
    t.plan(3);
    const mockReq = new Request("/mock");
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        new Mock({
          fetching: (args: FetchFetchingArgs): void => {
            t.deepEqual(args.request, mockReq);
            t.ok(args.promise);
            t.equal(typeof args.promise.then, "function");
          }
        })
      ]
    }));
    return fetch(mockReq);
  })
);

test(
  "fetchEngine with getResponse passes transformed response to didFetch",
  wrap((t: TapeTestAssertions) => {
    t.plan(1);
    const mockReq = new Request("/mock");
    const mockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        new Mock({
          getResponse: (res: FetchResponse): Promise<FetchResponse> => {
            return Promise.resolve(mockRes);
          },
          didFetch: (res: FetchResponse): void => {
            t.deepEqual(res, mockRes);
          }
        })
      ]
    }));
    return fetch(mockReq);
  })
);

test(
  "fetchEngine flows through full stack in order",
  wrap((t: TapeTestAssertions) => {
    t.plan(6);
    const firstMockReq = new Request("/mock");
    const secondMockReq = new Request("/mock");
    const firstMockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        new Mock({
          shouldFetch: (req: FetchRequest): boolean => {
            t.deepEqual(req, firstMockReq);
            return true;
          },
          getRequest: (req: FetchRequest): Promise<FetchRequest> => {
            t.deepEqual(req, firstMockReq);
            return Promise.resolve(secondMockReq);
          },
          willFetch: (req: FetchRequest): void => {
            t.deepEqual(req, secondMockReq);
          },
          fetch: (
            req: FetchRequest,
            next: () => Promise<FetchResponse>
          ): Promise<FetchResponse> => {
            t.deepEqual(req, secondMockReq);
            return next();
          },
          fetching: (args: FetchFetchingArgs): void => {
            t.deepEqual(args.request, secondMockReq);
          },
          getResponse: (res: FetchResponse): Promise<FetchResponse> => {
            // TODO find a way to fake the retured response
            return Promise.resolve(firstMockRes);
          },
          didFetch: (res: FetchResponse): void => {
            t.deepEqual(res, firstMockRes);
          }
        })
      ]
    }));
    return fetch(firstMockReq);
  })
);
