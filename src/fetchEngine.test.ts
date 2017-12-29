/* tslint:disable:object-literal-sort-keys */
// tslint:disable:no-var-requires
require("isomorphic-fetch");
import * as test from "tape";
import {
  FetchNext,
  FetchRetry,
  IFetchFetchingArgs,
  IFetchGroupOptions,
} from "./d";
import makeFetchEngine from "./fetchEngine";
import FetchGroup from "./FetchGroup";
import wrap from "./utils/wrapPromiseTest";

function mockFetch(request: Request): Promise<Response> {
  return Promise.resolve(new Response());
}

test("makeFetchEngine is requireable", (t) => {
  t.plan(1);
  t.ok(makeFetchEngine);
});

test(
  "fetchEngine with no args returns a response",
  wrap((t) => {
    t.plan(1);
    const fetch = makeFetchEngine(mockFetch)();
    return fetch(new Request("/mock"))
      .then((res: Response) => {
        t.ok(res);
      });
  }),
);

test(
  "fetchEngine with shouldFetch false throws",
  wrap((t) => {
    t.plan(1);
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          shouldFetch: (): boolean => false,
        },
      ],
    }));
    return fetch(new Request("/mock"))
      .then(
        () => t.fail(),
        (err) => {
          t.equal(
            err.message,
            "shouldFetch prevented the request from being made",
          );
        },
      );
  }),
);

test(
  "fetchEngine with getRequest passes transformed request to willFetch",
  wrap((t) => {
    t.plan(2);
    const firstMockReq = new Request("/mock");
    const secondMockReq = new Request("/mock/other");
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          getRequest: (req: Request): Promise<Request> => {
            t.deepEqual(req, firstMockReq);
            return Promise.resolve(secondMockReq);
          },
          willFetch: (req: Request): void => {
            t.deepEqual(req, secondMockReq);
          },
        },
      ],
    }));
    return fetch(firstMockReq);
  }),
);

test(
  "fetchEngine with fetch passes request and next function",
  wrap((t) => {
    t.plan(2);
    const mockReq = new Request("/mock");
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          fetch: (
            req: Request,
            next: () => Promise<Response>,
          ): Promise<Response> => {
            t.deepEqual(req, mockReq);
            t.equal(typeof next, "function");
            return next();
          },
        },
      ],
    }));
    return fetch(mockReq);
  }),
);

test(
  "fetchEngine with fetching passes promise and original request",
  wrap((t) => {
    t.plan(3);
    const mockReq = new Request("/mock");
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          fetching: (args: IFetchFetchingArgs): void => {
            t.deepEqual(args.request, mockReq);
            t.ok(args.promise);
            t.equal(typeof args.promise.then, "function");
          },
        },
      ],
    }));
    return fetch(mockReq);
  }),
);

test(
  "fetchEngine with getResponse passes transformed response to didFetch",
  wrap((t) => {
    t.plan(1);
    const mockReq = new Request("/mock");
    const mockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          getResponse: (res: Response): Promise<Response> => {
            return Promise.resolve(mockRes);
          },
          didFetch: (res: Response): void => {
            t.deepEqual(res, mockRes);
          },
        },
      ],
    }));
    return fetch(mockReq);
  }),
);

test(
  "fetchEngine with getResponse passes root fetch method for retries",
  wrap((t) => {
    t.plan(2);
    const mockReq = new Request("/mock");
    const mockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          getResponse: (res: Response, retry: FetchRetry): Promise<Response> => {
            t.equal(typeof retry, "function");
            return Promise.resolve(mockRes);
          },
        },
      ],
    }));
    return fetch(mockReq).then((res) => {
      t.equal(res, mockRes);
    });
  }),
);

test(
  "fetchEngine with getResponse can retry original request",
  wrap((t) => {
    t.plan(2);
    let calls = 0;
    const mockReq = new Request("/mock");
    const mockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          willFetch() {
            calls = calls + 1;
          },
          getResponse(res: Response, retry: FetchRetry) {
            if (calls === 1) {
              return retry();
            } else {
              return mockRes;
            }
          },
        },
      ],
    }));
    return fetch(mockReq).then((res) => {
      t.equal(calls, 2);
      t.equal(res, mockRes);
    });
  }),
);

test(
  "fetchEngine with getResponse can retry new request",
  wrap((t) => {
    t.plan(4);
    let calls = 0;
    const mockReq = new Request("/mock");
    const mockRetryReq = new Request("/mock-retry");
    const mockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          willFetch(req) {
            calls = calls + 1;
            if (calls === 1) {
              t.deepEqual(req, mockReq);
            } else {
              t.deepEqual(req, mockRetryReq);
            }
          },
          getResponse(res: Response, retry: FetchRetry) {
            if (calls === 1) {
              return retry(mockRetryReq);
            } else {
              return mockRes;
            }
          },
        },
      ],
    }));
    return fetch(mockReq).then((res) => {
      t.equal(calls, 2);
      t.equal(res, mockRes);
    });
  }),
);

test(
  "fetchEngine flows through full stack in order",
  wrap((t) => {
    t.plan(6);
    const firstMockReq = new Request("/mock");
    const secondMockReq = new Request("/mock");
    const firstMockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          shouldFetch: (req: Request): boolean => {
            t.deepEqual(req, firstMockReq);
            return true;
          },
          getRequest: (req: Request): Promise<Request> => {
            t.deepEqual(req, firstMockReq);
            return Promise.resolve(secondMockReq);
          },
          willFetch: (req: Request): void => {
            t.deepEqual(req, secondMockReq);
          },
          fetch: (
            req: Request,
            next: () => Promise<Response>,
          ): Promise<Response> => {
            t.deepEqual(req, secondMockReq);
            return next();
          },
          fetching: (args: IFetchFetchingArgs): void => {
            t.deepEqual(args.request, secondMockReq);
          },
          getResponse: (res: Response, retry): Promise<Response> => {
            // TODO find a way to fake the retured response
            return Promise.resolve(firstMockRes);
          },
          didFetch: (res: Response): void => {
            t.deepEqual(res, firstMockRes);
          },
        },
      ],
    }));
    return fetch(firstMockReq);
  }),
);

test(
  "fetchEngine with opts creates FetchGroup and flows through full stack in order",
  wrap((t) => {
    t.plan(12);
    const firstMockReq = new Request("/mock");
    const secondMockReq = new Request("/mock");
    const firstMockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)({
      filters: [
        {
          testRequest: (req: Request): boolean => {
            t.deepEqual(req, firstMockReq);
            return true;
          },
          testResponse: (res: Response): boolean => {
            t.deepEqual(res, firstMockRes);
            return true;
          },
        },
      ],
      plugins: [
        {
          shouldFetch: (req: Request): boolean => {
            t.deepEqual(req, firstMockReq);
            return true;
          },
          getRequest: (req: Request): Promise<Request> => {
            t.deepEqual(req, firstMockReq);
            return Promise.resolve(secondMockReq);
          },
          willFetch: (req: Request): void => {
            t.deepEqual(req, secondMockReq);
          },
          fetch: (
            req: Request,
            next: () => Promise<Response>,
          ): Promise<Response> => {
            t.deepEqual(req, secondMockReq);
            return next();
          },
          fetching: (args: IFetchFetchingArgs): void => {
            t.deepEqual(args.request, secondMockReq);
          },
          getResponse: (res: Response): Promise<Response> => {
            // TODO find a way to fake the retured response
            return Promise.resolve(firstMockRes);
          },
          didFetch: (res: Response): void => {
            t.deepEqual(res, firstMockRes);
          },
        },
      ],
    });
    return fetch(firstMockReq);
  }),
);
