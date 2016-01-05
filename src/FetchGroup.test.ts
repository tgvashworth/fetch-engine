/// <reference path="./.d.test.ts" />
"use strict";
import test = require("ava");
import FetchGroup from "./FetchGroup";
import { Mock, MockRequest, MockResponse } from "./utils/mocks";

test("FetchGroup is requireable", (t: TestAssertions) => {
  t.ok(FetchGroup);
});

test("FetchGroup has default plugin implementations", (t: TestAssertions) => {
  t.plan(8);
  const group = new FetchGroup();
  const mockRequest = new MockRequest("/mock");
  const mockResponse = new MockResponse();
  const mockPromise = Promise.resolve(mockResponse);
  t.true(group.shouldFetch(mockRequest));
  t.true(typeof group.willFetch === "function");
  t.true(typeof group.fetch === "function");
  t.true(typeof group.fetching === "function");
  t.true(typeof group.didFetch === "function");
  return Promise.resolve()
    .then(() => group.getRequest(mockRequest))
    .then((req: FetchRequest) => {
      t.is(req, mockRequest);
    })
    .then(() => group.fetch(mockRequest, () => mockPromise))
    .then((res: FetchResponse) => {
      t.is(res, mockResponse);
      return group.getResponse(res);
    })
    .then((res: FetchResponse) => {
      t.is(res, mockResponse);
    });
});

// shouldFetch

test("shouldFetch true value is respected", (t: TestAssertions) => {
  const mockReq = new MockRequest("/mock");
  const group = new FetchGroup({
    plugins: [
      new Mock({
        shouldFetch: (): boolean => true
      })
    ]
  });
  t.same(group.shouldFetch(mockReq), true);
});

test("shouldFetch false value is respected", (t: TestAssertions) => {
  const mockReq = new MockRequest("/mock");
  const group = new FetchGroup({
    plugins: [
      new Mock({
        shouldFetch: (): boolean => false
      })
    ]
  });
  t.same(group.shouldFetch(mockReq), false);
});

test(
  "shouldFetch true value is respected with multiple plugins",
  (t: TestAssertions) => {
    const mockReq = new MockRequest("/mock");
    const group = new FetchGroup({
      plugins: [
        new Mock({
          shouldFetch: (): boolean => true
        }),
        new Mock({
          shouldFetch: (): boolean => true
        })
      ]
    });
    t.same(group.shouldFetch(mockReq), true);
  }
);

test(
  "shouldFetch false value is respected with multiple plugins",
  (t: TestAssertions) => {
    const mockReq = new MockRequest("/mock");
    const group = new FetchGroup({
      plugins: [
        new Mock({
          shouldFetch: (): boolean => true
        }),
        new Mock({
          shouldFetch: (): boolean => false
        })
      ]
    });
    t.same(group.shouldFetch(mockReq), false);
  }
);

// getRequest

test("getRequest is passed the input request", (t: TestAssertions) => {
  t.plan(2);
  const mockReq = new MockRequest("/mock");
  const group = new FetchGroup({
    plugins: [
      new Mock({
        getRequest: (req: FetchRequest): Promise<FetchRequest> => {
          t.same(req, mockReq);
          return Promise.resolve(req);
        }
      })
    ]
  });
  return group.getRequest(mockReq)
    .then((req: FetchRequest) => {
      t.same(req, mockReq);
    });
});

test("getRequest output is passed back", (t: TestAssertions) => {
  t.plan(1);
  const mockReq = new MockRequest("/mock");
  const newReq = new MockRequest("/another-mock");
  const group = new FetchGroup({
    plugins: [
      new Mock({
        getRequest: (req: FetchRequest): Promise<FetchRequest> => {
          return Promise.resolve(newReq);
        }
      })
    ]
  });
  return group.getRequest(mockReq)
    .then((req: FetchRequest) => {
      t.same(req, newReq);
    });
});

test(
  "getRequest output is passed back with multiple plugins",
  (t: TestAssertions) => {
    t.plan(3);
    const mockReq = new MockRequest("/mock");
    const secondReq = new MockRequest("/another-mock");
    const thirdReq = new MockRequest("/another-mock");
    const group = new FetchGroup({
      plugins: [
        new Mock({
          getRequest: (req: FetchRequest): Promise<FetchRequest> => {
            t.same(req, mockReq);
            return Promise.resolve(secondReq);
          }
        }),
        new Mock({
          getRequest: (req: FetchRequest): Promise<FetchRequest> => {
            t.same(req, secondReq);
            return Promise.resolve(thirdReq);
          }
        })
      ]
    });
    return group.getRequest(mockReq)
      .then((req: FetchRequest) => {
        t.same(req, thirdReq);
      });
  }
);

// willFetch

test("willFetch is passed the input request", (t: TestAssertions) => {
  t.plan(1);
  const mockReq = new MockRequest("/mock");
  const group = new FetchGroup({
    plugins: [
      new Mock({
        willFetch: (req: FetchRequest): void => {
          t.same(req, mockReq);
        }
      })
    ]
  });
  group.willFetch(mockReq);
});

test("willFetch output is ignored", (t: TestAssertions) => {
  t.plan(1);
  const mockReq = new MockRequest("/mock");
  const group = new FetchGroup({
    plugins: [
      new Mock({
        willFetch: (req: FetchRequest): boolean => {
          return true;
        }
      })
    ]
  });
  const result = group.willFetch(mockReq);
  t.same(result, undefined);
});

test(
  "willFetch is passed the same request in multiple plugins",
  (t: TestAssertions) => {
    t.plan(2);
    const mockReq = new MockRequest("/mock");
    const group = new FetchGroup({
      plugins: [
        new Mock({
          willFetch: (req: FetchRequest): void => {
            t.same(req, mockReq);
          }
        }),
        new Mock({
          willFetch: (req: FetchRequest): void => {
            t.same(req, mockReq);
          }
        })
      ]
    });
    group.willFetch(mockReq);
  }
);

// fetch

test(
  "fetch is passed the input request and a 'next' function which is " +
  "eventually called",
  (t: TestAssertions) => {
    t.plan(3);
    const mockReq = new MockRequest("/mock");
    const mockResponse = new MockResponse();
    const mockPromise = Promise.resolve(mockResponse);
    const group = new FetchGroup({
      plugins: [
        new Mock({
          fetch: (
            request: FetchRequest,
            next: FetchNext
          ): Promise<FetchResponse> => {
            t.same(request, mockReq);
            t.true(typeof next === "function");
            return next();
          }
        })
      ]
    });
    return group.fetch(mockReq, () => mockPromise)
      .then((res: FetchResponse) => {
        t.is(res, mockResponse);
      });
  }
);

test(
  "each fetch step is passed same request & can pass control to the next mock",
  (t: TestAssertions) => {
    t.plan(3);
    const mockReq = new MockRequest("/mock");
    const mockResponse = new MockResponse();
    const mockPromise = Promise.resolve(mockResponse);
    const group = new FetchGroup({
      plugins: [
        new Mock({
          fetch: (request, next): Promise<FetchResponse> => {
            t.same(request, mockReq);
            return next();
          }
        }),
        new Mock({
          fetch: (request, next): Promise<FetchResponse> => {
            t.same(request, mockReq);
            return next();
          }
        })
      ]
    });
    return group.fetch(mockReq, () => mockPromise)
      .then((res: FetchResponse) => {
        t.is(res, mockResponse);
      });
  }
);

test(
  "a fetch step can return early",
  (t: TestAssertions) => {
    t.plan(1);
    const mockReq = new MockRequest("/mock");
    const mockResponse = new MockResponse();
    const mockPromise = Promise.resolve(mockResponse);
    const group = new FetchGroup({
      plugins: [
        new Mock({
          fetch: (request, next): Promise<FetchResponse> => {
            return Promise.resolve(mockResponse);
          }
        })
      ]
    });
    return group.fetch(mockReq, () => mockPromise)
      .then((res: FetchResponse) => {
        t.is(res, mockResponse);
      });
  }
);

// fetching

test(
  "fetching is passed the input request and a promise for the response",
  (t: TestAssertions) => {
    t.plan(2);
    const mockReq = new MockRequest("/mock");
    const mockPromise = Promise.resolve(new MockResponse());
    const group = new FetchGroup({
      plugins: [
        new Mock({
          fetching: (args: FetchFetchingArgs): void => {
            t.same(args.request, mockReq);
            t.same(args.promise, mockPromise);
          }
        })
      ]
    });
    group.fetching({
      promise: mockPromise,
      request: mockReq,
    });
  }
);

test(
  "fetching is passed same input for multiple plugins",
  (t: TestAssertions) => {
    t.plan(4);
    const mockReq = new MockRequest("/mock");
    const mockPromise = Promise.resolve(new MockResponse());
    const group = new FetchGroup({
      plugins: [
        new Mock({
          fetching: (args: FetchFetchingArgs): void => {
            t.same(args.request, mockReq);
            t.same(args.promise, mockPromise);
          }
        }),
        new Mock({
          fetching: (args: FetchFetchingArgs): void => {
            t.same(args.request, mockReq);
            t.same(args.promise, mockPromise);
          }
        })
      ]
    });
    group.fetching({
      promise: mockPromise,
      request: mockReq,
    });
  }
);

// getResponse

test("getResponse is passed the input response", (t: TestAssertions) => {
  t.plan(2);
  const mockRes = new MockResponse();
  const group = new FetchGroup({
    plugins: [
      new Mock({
        getResponse: (res: FetchResponse): Promise<FetchResponse> => {
          t.same(res, mockRes);
          return Promise.resolve(res);
        }
      })
    ]
  });
  return group.getResponse(mockRes)
    .then((res: FetchResponse) => {
      t.same(res, mockRes);
    });
});

test("getResponse output is passed back", (t: TestAssertions) => {
  t.plan(1);
  const mockRes = new MockResponse();
  const newRes = new MockResponse();
  const group = new FetchGroup({
    plugins: [
      new Mock({
        getResponse: (res: FetchResponse): Promise<FetchResponse> => {
          return Promise.resolve(newRes);
        }
      })
    ]
  });
  return group.getResponse(mockRes)
    .then((res: FetchResponse) => {
      t.same(res, newRes);
    });
});

test(
  "getResponse output is passed back with multiple plugins",
  (t: TestAssertions) => {
    t.plan(3);
    const mockRes = new MockResponse();
    const secondRes = new MockResponse();
    const thirdRes = new MockResponse();
    const group = new FetchGroup({
      plugins: [
        new Mock({
          getResponse: (req: FetchResponse): Promise<FetchResponse> => {
            t.same(req, mockRes);
            return Promise.resolve(secondRes);
          }
        }),
        new Mock({
          getResponse: (req: FetchResponse): Promise<FetchResponse> => {
            t.same(req, secondRes);
            return Promise.resolve(thirdRes);
          }
        })
      ]
    });
    return group.getResponse(mockRes)
      .then((req: FetchResponse) => {
        t.same(req, thirdRes);
      });
  }
);

// didFetch

test("didFetch is passed the input response", (t: TestAssertions) => {
  t.plan(1);
  const mockRes = new MockResponse();
  const group = new FetchGroup({
    plugins: [
      new Mock({
        didFetch: (req: FetchResponse): void => {
          t.same(req, mockRes);
        }
      })
    ]
  });
  group.didFetch(mockRes);
});

test("didFetch output is ignored", (t: TestAssertions) => {
  t.plan(1);
  const mockRes = new MockResponse();
  const group = new FetchGroup({
    plugins: [
      new Mock({
        didFetch: (req: FetchResponse): boolean => {
          return true;
        }
      })
    ]
  });
  const result = group.didFetch(mockRes);
  t.same(result, undefined);
});

test(
  "didFetch is passed the same response in multiple plugins",
  (t: TestAssertions) => {
    t.plan(2);
    const mockRes = new MockResponse();
    const group = new FetchGroup({
      plugins: [
        new Mock({
          didFetch: (req: FetchResponse): void => {
            t.same(req, mockRes);
          }
        }),
        new Mock({
          didFetch: (req: FetchResponse): void => {
            t.same(req, mockRes);
          }
        })
      ]
    });
    group.didFetch(mockRes);
  }
);

// testRequest

test("testRequest prevents shouldFetch being called", (t: TestAssertions) => {
  t.plan(1);
  const mockReq = new MockRequest("/mock");
  const group = new FetchGroup({
    filters: [
      new Mock({
        testRequest: (req: FetchRequest): boolean => {
          t.same(req, mockReq);
          return false;
        }
      })
    ],
    plugins: [
      new Mock({
        shouldFetch: (req: FetchRequest): void => {
          t.fail("shouldFetch was called");
        }
      })
    ]
  });
  group.shouldFetch(mockReq);
});

test("testRequest prevents getRequest being called", (t: TestAssertions) => {
  t.plan(1);
  const mockReq = new MockRequest("/mock");
  const group = new FetchGroup({
    filters: [
      new Mock({
        testRequest: (req: FetchRequest): boolean => {
          t.same(req, mockReq);
          return false;
        }
      })
    ],
    plugins: [
      new Mock({
        getRequest: (req: FetchRequest): void => {
          t.fail("getRequest was called");
        }
      })
    ]
  });
  group.getRequest(mockReq);
});

test("testRequest prevents willFetch being called", (t: TestAssertions) => {
  t.plan(1);
  const mockReq = new MockRequest("/mock");
  const group = new FetchGroup({
    filters: [
      new Mock({
        testRequest: (req: FetchRequest): boolean => {
          t.same(req, mockReq);
          return false;
        }
      })
    ],
    plugins: [
      new Mock({
        willFetch: (req: FetchRequest): void => {
          t.fail("willFetch was called");
        }
      })
    ]
  });
  group.willFetch(mockReq);
});

test("testRequest prevents fetch being called", (t: TestAssertions) => {
  t.plan(1);
  const mockReq = new MockRequest("/mock");
  const mockPromise = Promise.resolve(mockReq);
  const group = new FetchGroup({
    filters: [
      new Mock({
        testRequest: (req: FetchRequest): boolean => {
          t.same(req, mockReq);
          return false;
        }
      })
    ],
    plugins: [
      new Mock({
        fetching: (args: FetchFetchingArgs): void => {
          t.fail("fetch was called");
        }
      })
    ]
  });
  group.fetching({
    promise: mockPromise,
    request: mockReq,
  });
});

// testResponse

test("testResponse prevents getResponse being called", (t: TestAssertions) => {
  t.plan(1);
  const mockRes = new MockResponse();
  const group = new FetchGroup({
    filters: [
      new Mock({
        testResponse: (res: FetchResponse): boolean => {
          t.same(res, mockRes);
          return false;
        }
      })
    ],
    plugins: [
      new Mock({
        getResponse: (res: FetchResponse): void => {
          t.fail("getResponse was called");
        }
      })
    ]
  });
  group.getResponse(mockRes);
});

test("testResponse prevents didFetch being called", (t: TestAssertions) => {
  t.plan(1);
  const mockRes = new MockResponse();
  const group = new FetchGroup({
    filters: [
      new Mock({
        testResponse: (res: FetchResponse): boolean => {
          t.same(res, mockRes);
          return false;
        }
      })
    ],
    plugins: [
      new Mock({
        didFetch: (res: FetchResponse): void => {
          t.fail("didFetch was called");
        }
      })
    ]
  });
  group.didFetch(mockRes);
});
