/* tslint:disable:object-literal-sort-keys */
// tslint:disable:no-var-requires
import "whatwg-fetch";
import {
  FetchNext,
  FetchRetry,
  IFetchFetchingArgs,
  IFetchGroupOptions,
} from "../d";
import makeFetchEngine from "../fetchEngine";
import FetchGroup from "../FetchGroup";

function mockFetch(request: Request): Promise<Response> {
  return Promise.resolve(new Response());
}

it("makeFetchEngine is requireable", () => {
  expect(makeFetchEngine).toBeDefined();
});

it(
  "fetchEngine with no args returns a response",
  () => {
    expect.assertions(1);
    const fetch = makeFetchEngine(mockFetch)();
    return fetch(new Request("/mock"))
      .then((res: Response) => {
        expect(res).toBeDefined();
      });
  },
);

it(
  "fetchEngine with shouldFetch false throws",
  () => {
    expect.assertions(1);
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          shouldFetch: (): boolean => false,
        },
      ],
    }));
    return expect(fetch(new Request("/mock"))).rejects.toThrow(
      "shouldFetch prevented the request from being made",
    );
  },
);

it(
  "fetchEngine with getRequest passes transformed request to willFetch",
  () => {
    expect.assertions(2);
    const firstMockReq = new Request("/mock");
    const secondMockReq = new Request("/mock/other");
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          getRequest: (req: Request): Promise<Request> => {
            expect(req).toEqual(firstMockReq);
            return Promise.resolve(secondMockReq);
          },
          willFetch: (req: Request): void => {
            expect(req).toEqual(secondMockReq);
          },
        },
      ],
    }));
    return fetch(firstMockReq);
  },
);

it(
  "fetchEngine with fetch passes request and next function",
  () => {
    expect.assertions(2);
    const mockReq = new Request("/mock");
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          fetch: (
            req: Request,
            next: () => Promise<Response>,
          ): Promise<Response> => {
            expect(req).toEqual(mockReq);
            expect(typeof next).toBe("function");
            return next();
          },
        },
      ],
    }));
    return fetch(mockReq);
  },
);

it(
  "fetchEngine with fetching passes promise and original request",
  () => {
    expect.assertions(3);
    const mockReq = new Request("/mock");
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          fetching: (args: IFetchFetchingArgs): void => {
            expect(args.request).toEqual(mockReq);
            expect(args.promise).toBeDefined();
            expect(typeof args.promise.then).toBe("function");
          },
        },
      ],
    }));
    return fetch(mockReq);
  },
);

it(
  "fetchEngine with getResponse passes transformed response to didFetch",
  () => {
    expect.assertions(1);
    const mockReq = new Request("/mock");
    const mockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          getResponse: (res: Response): Promise<Response> => {
            return Promise.resolve(mockRes);
          },
          didFetch: (res: Response): void => {
            expect(res).toBe(mockRes);
          },
        },
      ],
    }));
    return fetch(mockReq);
  },
);

it(
  "fetchEngine with getResponse passes root fetch method for retries",
  () => {
    expect.assertions(2);
    const mockReq = new Request("/mock");
    const mockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          getResponse: (res: Response, retry: FetchRetry): Promise<Response> => {
            expect(typeof retry).toBe("function");
            return Promise.resolve(mockRes);
          },
        },
      ],
    }));
    return fetch(mockReq).then((res) => {
      expect(res).toBe(mockRes);
    });
  },
);

it(
  "fetchEngine with getResponse can retry original request",
  () => {
    expect.assertions(2);
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
      expect(calls).toBe(2);
      expect(res).toBe(mockRes);
    });
  },
);

it(
  "fetchEngine with getResponse can retry new request",
  () => {
    expect.assertions(4);
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
              expect(req).toEqual(mockReq);
            } else {
              expect(req).toEqual(mockRetryReq);
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
      expect(calls).toBe(2);
      expect(res).toEqual(mockRes);
    });
  },
);

it(
  "fetchEngine flows through full stack in order",
  () => {
    expect.assertions(6);
    const firstMockReq = new Request("/mock");
    const secondMockReq = new Request("/mock");
    const firstMockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)(new FetchGroup({
      plugins: [
        {
          shouldFetch: (req: Request): boolean => {
            expect(req).toEqual(firstMockReq);
            return true;
          },
          getRequest: (req: Request): Promise<Request> => {
            expect(req).toEqual(firstMockReq);
            return Promise.resolve(secondMockReq);
          },
          willFetch: (req: Request): void => {
            expect(req).toEqual(secondMockReq);
          },
          fetch: (
            req: Request,
            next: () => Promise<Response>,
          ): Promise<Response> => {
            expect(req).toEqual(secondMockReq);
            return next();
          },
          fetching: (args: IFetchFetchingArgs): void => {
            expect(args.request).toEqual(secondMockReq);
          },
          getResponse: (res: Response, retry): Promise<Response> => {
            // TODO find a way to fake the retured response
            return Promise.resolve(firstMockRes);
          },
          didFetch: (res: Response): void => {
            expect(res).toEqual(firstMockRes);
          },
        },
      ],
    }));
    return fetch(firstMockReq);
  },
);

it(
  "fetchEngine with opts creates FetchGroup and flows through full stack in order",
  () => {
    expect.assertions(12);
    const firstMockReq = new Request("/mock");
    const secondMockReq = new Request("/mock");
    const firstMockRes = new Response();
    const fetch = makeFetchEngine(mockFetch)({
      filters: [
        {
          testRequest: (req: Request): boolean => {
            expect(req).toEqual(firstMockReq);
            return true;
          },
          testResponse: (res: Response): boolean => {
            expect(res).toEqual(firstMockRes);
            return true;
          },
        },
      ],
      plugins: [
        {
          shouldFetch: (req: Request): boolean => {
            expect(req).toEqual(firstMockReq);
            return true;
          },
          getRequest: (req: Request): Promise<Request> => {
            expect(req).toEqual(firstMockReq);
            return Promise.resolve(secondMockReq);
          },
          willFetch: (req: Request): void => {
            expect(req).toEqual(secondMockReq);
          },
          fetch: (
            req: Request,
            next: () => Promise<Response>,
          ): Promise<Response> => {
            expect(req).toEqual(secondMockReq);
            return next();
          },
          fetching: (args: IFetchFetchingArgs): void => {
            expect(args.request).toEqual(secondMockReq);
          },
          getResponse: (res: Response): Promise<Response> => {
            // TODO find a way to fake the retured response
            return Promise.resolve(firstMockRes);
          },
          didFetch: (res: Response): void => {
            expect(res).toEqual(firstMockRes);
          },
        },
      ],
    });
    return fetch(firstMockReq);
  },
);
