// tslint:disable:no-var-requires
require("isomorphic-fetch");
import * as test from "tape";
import {
  FetchNext,
  IFetchFetchingArgs,
} from "./d";
import FetchGroup from "./FetchGroup";
import wrap from "./utils/wrapPromiseTest";

test("FetchGroup is requireable", (t) => {
  t.plan(1);
  t.ok(FetchGroup);
});

test(
  "FetchGroup has default plugin implementations",
  wrap((t) => {
    t.plan(8);
    const group = new FetchGroup();
    const mockRequest = new Request("/mock");
    const mockResponse = new Response();
    const mockPromise = Promise.resolve(mockResponse);
    t.ok(group.shouldFetch(mockRequest));
    t.ok(typeof group.willFetch === "function");
    t.ok(typeof group.fetch === "function");
    t.ok(typeof group.fetching === "function");
    t.ok(typeof group.didFetch === "function");
    return Promise.resolve()
      .then(() => group.getRequest(mockRequest))
      .then((req: Request) => {
        t.equal(req, mockRequest);
      })
      .then(() => group.fetch(mockRequest, () => mockPromise))
      .then((res: Response) => {
        t.equal(res, mockResponse);
        return group.getResponse(res);
      })
      .then((res: Response) => {
        t.equal(res, mockResponse);
      });
  }),
);

// shouldFetch

test("shouldFetch true value is respected", (t) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    plugins: [
      {
        shouldFetch: (): boolean => true,
      },
    ],
  });
  t.equal(group.shouldFetch(mockReq), true);
});

test("shouldFetch false value is respected", (t) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    plugins: [
      {
        shouldFetch: (): boolean => false,
      },
    ],
  });
  t.equal(group.shouldFetch(mockReq), false);
});

test(
  "shouldFetch true value is respected with multiple plugins",
  (t) => {
    t.plan(1);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      plugins: [
        {
          shouldFetch: (): boolean => true,
        },
        {
          shouldFetch: (): boolean => true,
        },
      ],
    });
    t.equal(group.shouldFetch(mockReq), true);
  },
);

test(
  "shouldFetch false value is respected with multiple plugins",
  (t) => {
    t.plan(1);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      plugins: [
        {
          shouldFetch: (): boolean => true,
        },
        {
          shouldFetch: (): boolean => false,
        },
      ],
    });
    t.equal(group.shouldFetch(mockReq), false);
  },
);

// getRequest

test(
  "getRequest is passed the input request",
  wrap((t) => {
    t.plan(2);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      plugins: [
        {
          getRequest: (req: Request): Promise<Request> => {
            t.deepEqual(req, mockReq);
            return Promise.resolve(req);
          },
        },
      ],
    });
    return group.getRequest(mockReq)
      .then((req: Request) => {
        t.deepEqual(req, mockReq);
      });
  }),
);

test(
  "getRequest output is passed back",
  wrap((t) => {
    t.plan(1);
    const mockReq = new Request("/mock");
    const newReq = new Request("/another-mock");
    const group = new FetchGroup({
      plugins: [
        {
          getRequest: (req: Request): Promise<Request> => {
            return Promise.resolve(newReq);
          },
        },
      ],
    });
    return group.getRequest(mockReq)
      .then((req: Request) => {
        t.deepEqual(req, newReq);
      });
  }),
);

test(
  "getRequest output is passed back with multiple plugins",
  wrap((t) => {
    t.plan(3);
    const mockReq = new Request("/mock");
    const secondReq = new Request("/another-mock");
    const thirdReq = new Request("/another-mock");
    const group = new FetchGroup({
      plugins: [
        {
          getRequest: (req: Request): Promise<Request> => {
            t.deepEqual(req, mockReq);
            return Promise.resolve(secondReq);
          },
        },
        {
          getRequest: (req: Request): Promise<Request> => {
            t.deepEqual(req, secondReq);
            return Promise.resolve(thirdReq);
          },
        },
      ],
    });
    return group.getRequest(mockReq)
      .then((req: Request) => {
        t.deepEqual(req, thirdReq);
      });
  }),
);

// willFetch

test("willFetch is passed the input request", (t) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    plugins: [
      {
        willFetch: (req: Request): void => {
          t.deepEqual(req, mockReq);
        },
      },
    ],
  });
  group.willFetch(mockReq);
});

test("willFetch output is ignored", (t) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    plugins: [
      {
        willFetch: (req: Request): boolean => {
          return true;
        },
      },
    ],
  });
  const result = group.willFetch(mockReq);
  t.equal(result, undefined);
});

test(
  "willFetch is passed the same request in multiple plugins",
  (t) => {
    t.plan(2);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      plugins: [
        {
          willFetch: (req: Request): void => {
            t.deepEqual(req, mockReq);
          },
        },
        {
          willFetch: (req: Request): void => {
            t.deepEqual(req, mockReq);
          },
        },
      ],
    });
    group.willFetch(mockReq);
  },
);

// fetch

test(
  "fetch is passed the input request and a 'next' function which is " +
  "eventually called",
  wrap((t) => {
    t.plan(3);
    const mockReq = new Request("/mock");
    const mockResponse = new Response();
    const mockPromise = Promise.resolve(mockResponse);
    const group = new FetchGroup({
      plugins: [
        {
          fetch: (
            request: Request,
            next: FetchNext,
          ): Promise<Response> => {
            t.deepEqual(request, mockReq);
            t.ok(typeof next === "function");
            return next();
          },
        },
      ],
    });
    return group.fetch(mockReq, () => mockPromise)
      .then((res: Response) => {
        t.equal(res, mockResponse);
      });
  }),
);

test(
  "each fetch step is passed same request & can pass control to the next mock",
  wrap((t) => {
    t.plan(3);
    const mockReq = new Request("/mock");
    const mockResponse = new Response();
    const mockPromise = Promise.resolve(mockResponse);
    const group = new FetchGroup({
      plugins: [
        {
          fetch: (request, next): Promise<Response> => {
            t.deepEqual(request, mockReq);
            return next();
          },
        },
        {
          fetch: (request, next): Promise<Response> => {
            t.deepEqual(request, mockReq);
            return next();
          },
        },
      ],
    });
    return group.fetch(mockReq, () => mockPromise)
      .then((res: Response) => {
        t.equal(res, mockResponse);
      });
  }),
);

test(
  "a fetch step can return early",
  wrap((t) => {
    t.plan(1);
    const mockReq = new Request("/mock");
    const mockResponse = new Response();
    const mockPromise = Promise.resolve(mockResponse);
    const group = new FetchGroup({
      plugins: [
        {
          fetch: (request, next): Promise<Response> => {
            return Promise.resolve(mockResponse);
          },
        },
      ],
    });
    return group.fetch(mockReq, () => mockPromise)
      .then((res: Response) => {
        t.equal(res, mockResponse);
      });
  }),
);

// fetching

test(
  "fetching is passed the input request and a promise for the response",
  (t) => {
    t.plan(2);
    const mockReq = new Request("/mock");
    const mockPromise = Promise.resolve(new Response());
    const group = new FetchGroup({
      plugins: [
        {
          fetching: (args: IFetchFetchingArgs): void => {
            t.deepEqual(args.request, mockReq);
            t.deepEqual(args.promise, mockPromise);
          },
        },
      ],
    });
    group.fetching({
      promise: mockPromise,
      request: mockReq,
    });
  },
);

test(
  "fetching is passed same input for multiple plugins",
  (t) => {
    t.plan(4);
    const mockReq = new Request("/mock");
    const mockPromise = Promise.resolve(new Response());
    const group = new FetchGroup({
      plugins: [
        {
          fetching: (args: IFetchFetchingArgs): void => {
            t.deepEqual(args.request, mockReq);
            t.deepEqual(args.promise, mockPromise);
          },
        },
        {
          fetching: (args: IFetchFetchingArgs): void => {
            t.deepEqual(args.request, mockReq);
            t.deepEqual(args.promise, mockPromise);
          },
        },
      ],
    });
    group.fetching({
      promise: mockPromise,
      request: mockReq,
    });
  },
);

// getResponse

test(
  "getResponse is passed the input response",
  wrap((t) => {
    t.plan(2);
    const mockRes = new Response();
    const group = new FetchGroup({
      plugins: [
        {
          getResponse: (res: Response): Promise<Response> => {
            t.deepEqual(res, mockRes);
            return Promise.resolve(res);
          },
        },
      ],
    });
    return group.getResponse(mockRes)
      .then((res: Response) => {
        t.deepEqual(res, mockRes);
      });
  }),
);

test(
  "getResponse output is passed back",
  wrap((t) => {
    t.plan(1);
    const mockRes = new Response();
    const newRes = new Response();
    const group = new FetchGroup({
      plugins: [
        {
          getResponse: (res: Response): Promise<Response> => {
            return Promise.resolve(newRes);
          },
        },
      ],
    });
    return group.getResponse(mockRes)
      .then((res: Response) => {
        t.deepEqual(res, newRes);
      });
  }),
);

test(
  "getResponse output is passed back with multiple plugins",
  wrap((t) => {
    t.plan(3);
    const mockRes = new Response();
    const secondRes = new Response();
    const thirdRes = new Response();
    const group = new FetchGroup({
      plugins: [
        {
          getResponse: (req: Response): Promise<Response> => {
            t.deepEqual(req, mockRes);
            return Promise.resolve(secondRes);
          },
        },
        {
          getResponse: (req: Response): Promise<Response> => {
            t.deepEqual(req, secondRes);
            return Promise.resolve(thirdRes);
          },
        },
      ],
    });
    return group.getResponse(mockRes)
      .then((req: Response) => {
        t.deepEqual(req, thirdRes);
      });
  }),
);

// didFetch

test("didFetch is passed the input response", (t) => {
  t.plan(1);
  const mockRes = new Response();
  const group = new FetchGroup({
    plugins: [
      {
        didFetch: (req: Response): void => {
          t.deepEqual(req, mockRes);
        },
      },
    ],
  });
  group.didFetch(mockRes);
});

test("didFetch output is ignored", (t) => {
  t.plan(1);
  const mockRes = new Response();
  const group = new FetchGroup({
    plugins: [
      {
        didFetch: (req: Response): boolean => {
          return true;
        },
      },
    ],
  });
  const result = group.didFetch(mockRes);
  t.equal(result, undefined);
});

test(
  "didFetch is passed the same response in multiple plugins",
  (t) => {
    t.plan(2);
    const mockRes = new Response();
    const group = new FetchGroup({
      plugins: [
        {
          didFetch: (req: Response): void => {
            t.deepEqual(req, mockRes);
          },
        },
        {
          didFetch: (req: Response): void => {
            t.deepEqual(req, mockRes);
          },
        },
      ],
    });
    group.didFetch(mockRes);
  },
);

// testRequest

test("testRequest prevents shouldFetch being called", (t) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    filters: [
      {
        testRequest: (req: Request): boolean => {
          t.deepEqual(req, mockReq);
          return false;
        },
      },
    ],
    plugins: [
      {
        shouldFetch: (req: Request): boolean => {
          t.fail("shouldFetch was called");
          return false;
        },
      },
    ],
  });
  group.shouldFetch(mockReq);
});

test("testRequest prevents getRequest being called", (t) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    filters: [
      {
        testRequest: (req: Request): boolean => {
          t.deepEqual(req, mockReq);
          return false;
        },
      },
    ],
    plugins: [
      {
        getRequest: (req: Request): Request => {
          t.fail("getRequest was called");
          return new Request("/");
        },
      },
    ],
  });
  group.getRequest(mockReq);
});

test("testRequest prevents willFetch being called", (t) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    filters: [
      {
        testRequest: (req: Request): boolean => {
          t.deepEqual(req, mockReq);
          return false;
        },
      },
    ],
    plugins: [
      {
        willFetch: (req: Request): void => {
          t.fail("willFetch was called");
        },
      },
    ],
  });
  group.willFetch(mockReq);
});

test("testRequest prevents fetch being called", (t) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const mockResp = new Response();
  const mockPromise = Promise.resolve(mockResp);
  const group = new FetchGroup({
    filters: [
      {
        testRequest: (req: Request): boolean => {
          t.deepEqual(req, mockReq);
          return false;
        },
      },
    ],
    plugins: [
      {
        fetching: (args: IFetchFetchingArgs): void => {
          t.fail("fetch was called");
        },
      },
    ],
  });
  group.fetching({
    promise: mockPromise,
    request: mockReq,
  });
});

// testResponse

test("testResponse prevents getResponse being called", (t) => {
  t.plan(1);
  const mockRes = new Response();
  const group = new FetchGroup({
    filters: [
      {
        testResponse: (res: Response): boolean => {
          t.deepEqual(res, mockRes);
          return false;
        },
      },
    ],
    plugins: [
      {
        getResponse: (res: Response): Response => {
          t.fail("getResponse was called");
          return mockRes;
        },
      },
    ],
  });
  group.getResponse(mockRes);
});

test("testResponse prevents didFetch being called", (t) => {
  t.plan(1);
  const mockRes = new Response();
  const group = new FetchGroup({
    filters: [
      {
        testResponse: (res: Response): boolean => {
          t.deepEqual(res, mockRes);
          return false;
        },
      },
    ],
    plugins: [
      {
        didFetch: (res: Response): void => {
          t.fail("didFetch was called");
        },
      },
    ],
  });
  group.didFetch(mockRes);
});
