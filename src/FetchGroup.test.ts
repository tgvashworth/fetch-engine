/// <reference path="./.d.test.ts" />
"use strict";
import test = require("tape");
import wrap from "./utils/wrapPromiseTest";
import FetchGroup from "./FetchGroup";
import { Mock } from "./utils/mocks";
import Request from "./Request";
import Response from "./Response";

test("FetchGroup is requireable", (t: TapeTestAssertions) => {
  t.plan(1);
  t.ok(FetchGroup);
});

test(
  "FetchGroup has default plugin implementations",
  wrap((t: TapeTestAssertions) => {
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
      .then((req: FetchRequest) => {
        t.equal(req, mockRequest);
      })
      .then(() => group.fetch(mockRequest, () => mockPromise))
      .then((res: FetchResponse) => {
        t.equal(res, mockResponse);
        return group.getResponse(res);
      })
      .then((res: FetchResponse) => {
        t.equal(res, mockResponse);
      });
  })
);

// shouldFetch

test("shouldFetch true value is respected", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    plugins: [
      new Mock({
        shouldFetch: (): boolean => true
      })
    ]
  });
  t.equal(group.shouldFetch(mockReq), true);
});

test("shouldFetch false value is respected", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    plugins: [
      new Mock({
        shouldFetch: (): boolean => false
      })
    ]
  });
  t.equal(group.shouldFetch(mockReq), false);
});

test(
  "shouldFetch true value is respected with multiple plugins",
  (t: TapeTestAssertions) => {
    t.plan(1);
    const mockReq = new Request("/mock");
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
    t.equal(group.shouldFetch(mockReq), true);
  }
);

test(
  "shouldFetch false value is respected with multiple plugins",
  (t: TapeTestAssertions) => {
    t.plan(1);
    const mockReq = new Request("/mock");
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
    t.equal(group.shouldFetch(mockReq), false);
  }
);

// getRequest

test(
  "getRequest is passed the input request",
  wrap((t: TapeTestAssertions) => {
    t.plan(2);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      plugins: [
        new Mock({
          getRequest: (req: FetchRequest): Promise<FetchRequest> => {
            t.deepEqual(req, mockReq);
            return Promise.resolve(req);
          }
        })
      ]
    });
    return group.getRequest(mockReq)
      .then((req: FetchRequest) => {
        t.deepEqual(req, mockReq);
      });
  })
);

test(
  "getRequest output is passed back",
  wrap((t: TapeTestAssertions) => {
    t.plan(1);
    const mockReq = new Request("/mock");
    const newReq = new Request("/another-mock");
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
        t.deepEqual(req, newReq);
      });
  })
);

test(
  "getRequest output is passed back with multiple plugins",
  wrap((t: TapeTestAssertions) => {
    t.plan(3);
    const mockReq = new Request("/mock");
    const secondReq = new Request("/another-mock");
    const thirdReq = new Request("/another-mock");
    const group = new FetchGroup({
      plugins: [
        new Mock({
          getRequest: (req: FetchRequest): Promise<FetchRequest> => {
            t.deepEqual(req, mockReq);
            return Promise.resolve(secondReq);
          }
        }),
        new Mock({
          getRequest: (req: FetchRequest): Promise<FetchRequest> => {
            t.deepEqual(req, secondReq);
            return Promise.resolve(thirdReq);
          }
        })
      ]
    });
    return group.getRequest(mockReq)
      .then((req: FetchRequest) => {
        t.deepEqual(req, thirdReq);
      });
  })
);

// willFetch

test("willFetch is passed the input request", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    plugins: [
      new Mock({
        willFetch: (req: FetchRequest): void => {
          t.deepEqual(req, mockReq);
        }
      })
    ]
  });
  group.willFetch(mockReq);
});

test("willFetch output is ignored", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockReq = new Request("/mock");
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
  t.equal(result, undefined);
});

test(
  "willFetch is passed the same request in multiple plugins",
  (t: TapeTestAssertions) => {
    t.plan(2);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      plugins: [
        new Mock({
          willFetch: (req: FetchRequest): void => {
            t.deepEqual(req, mockReq);
          }
        }),
        new Mock({
          willFetch: (req: FetchRequest): void => {
            t.deepEqual(req, mockReq);
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
  wrap((t: TapeTestAssertions) => {
    t.plan(3);
    const mockReq = new Request("/mock");
    const mockResponse = new Response();
    const mockPromise = Promise.resolve(mockResponse);
    const group = new FetchGroup({
      plugins: [
        new Mock({
          fetch: (
            request: FetchRequest,
            next: FetchNext
          ): Promise<FetchResponse> => {
            t.deepEqual(request, mockReq);
            t.ok(typeof next === "function");
            return next();
          }
        })
      ]
    });
    return group.fetch(mockReq, () => mockPromise)
      .then((res: FetchResponse) => {
        t.equal(res, mockResponse);
      });
  })
);

test(
  "each fetch step is passed same request & can pass control to the next mock",
  wrap((t: TapeTestAssertions) => {
    t.plan(3);
    const mockReq = new Request("/mock");
    const mockResponse = new Response();
    const mockPromise = Promise.resolve(mockResponse);
    const group = new FetchGroup({
      plugins: [
        new Mock({
          fetch: (request, next): Promise<FetchResponse> => {
            t.deepEqual(request, mockReq);
            return next();
          }
        }),
        new Mock({
          fetch: (request, next): Promise<FetchResponse> => {
            t.deepEqual(request, mockReq);
            return next();
          }
        })
      ]
    });
    return group.fetch(mockReq, () => mockPromise)
      .then((res: FetchResponse) => {
        t.equal(res, mockResponse);
      });
  })
);

test(
  "a fetch step can return early",
  wrap((t: TapeTestAssertions) => {
    t.plan(1);
    const mockReq = new Request("/mock");
    const mockResponse = new Response();
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
        t.equal(res, mockResponse);
      });
  })
);

// fetching

test(
  "fetching is passed the input request and a promise for the response",
  (t: TapeTestAssertions) => {
    t.plan(2);
    const mockReq = new Request("/mock");
    const mockPromise = Promise.resolve(new Response());
    const group = new FetchGroup({
      plugins: [
        new Mock({
          fetching: (args: FetchFetchingArgs): void => {
            t.deepEqual(args.request, mockReq);
            t.deepEqual(args.promise, mockPromise);
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
  (t: TapeTestAssertions) => {
    t.plan(4);
    const mockReq = new Request("/mock");
    const mockPromise = Promise.resolve(new Response());
    const group = new FetchGroup({
      plugins: [
        new Mock({
          fetching: (args: FetchFetchingArgs): void => {
            t.deepEqual(args.request, mockReq);
            t.deepEqual(args.promise, mockPromise);
          }
        }),
        new Mock({
          fetching: (args: FetchFetchingArgs): void => {
            t.deepEqual(args.request, mockReq);
            t.deepEqual(args.promise, mockPromise);
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

test(
  "getResponse is passed the input response",
  wrap((t: TapeTestAssertions) => {
    t.plan(2);
    const mockRes = new Response();
    const group = new FetchGroup({
      plugins: [
        new Mock({
          getResponse: (res: FetchResponse): Promise<FetchResponse> => {
            t.deepEqual(res, mockRes);
            return Promise.resolve(res);
          }
        })
      ]
    });
    return group.getResponse(mockRes)
      .then((res: FetchResponse) => {
        t.deepEqual(res, mockRes);
      });
  })
);

test(
  "getResponse output is passed back",
  wrap((t: TapeTestAssertions) => {
    t.plan(1);
    const mockRes = new Response();
    const newRes = new Response();
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
        t.deepEqual(res, newRes);
      });
  })
);

test(
  "getResponse output is passed back with multiple plugins",
  wrap((t: TapeTestAssertions) => {
    t.plan(3);
    const mockRes = new Response();
    const secondRes = new Response();
    const thirdRes = new Response();
    const group = new FetchGroup({
      plugins: [
        new Mock({
          getResponse: (req: FetchResponse): Promise<FetchResponse> => {
            t.deepEqual(req, mockRes);
            return Promise.resolve(secondRes);
          }
        }),
        new Mock({
          getResponse: (req: FetchResponse): Promise<FetchResponse> => {
            t.deepEqual(req, secondRes);
            return Promise.resolve(thirdRes);
          }
        })
      ]
    });
    return group.getResponse(mockRes)
      .then((req: FetchResponse) => {
        t.deepEqual(req, thirdRes);
      });
  })
);

// didFetch

test("didFetch is passed the input response", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockRes = new Response();
  const group = new FetchGroup({
    plugins: [
      new Mock({
        didFetch: (req: FetchResponse): void => {
          t.deepEqual(req, mockRes);
        }
      })
    ]
  });
  group.didFetch(mockRes);
});

test("didFetch output is ignored", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockRes = new Response();
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
  t.equal(result, undefined);
});

test(
  "didFetch is passed the same response in multiple plugins",
  (t: TapeTestAssertions) => {
    t.plan(2);
    const mockRes = new Response();
    const group = new FetchGroup({
      plugins: [
        new Mock({
          didFetch: (req: FetchResponse): void => {
            t.deepEqual(req, mockRes);
          }
        }),
        new Mock({
          didFetch: (req: FetchResponse): void => {
            t.deepEqual(req, mockRes);
          }
        })
      ]
    });
    group.didFetch(mockRes);
  }
);

// testRequest

test("testRequest prevents shouldFetch being called", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    filters: [
      new Mock({
        testRequest: (req: FetchRequest): boolean => {
          t.deepEqual(req, mockReq);
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

test("testRequest prevents getRequest being called", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    filters: [
      new Mock({
        testRequest: (req: FetchRequest): boolean => {
          t.deepEqual(req, mockReq);
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

test("testRequest prevents willFetch being called", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const group = new FetchGroup({
    filters: [
      new Mock({
        testRequest: (req: FetchRequest): boolean => {
          t.deepEqual(req, mockReq);
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

test("testRequest prevents fetch being called", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockReq = new Request("/mock");
  const mockResp = new Response();
  const mockPromise = Promise.resolve(mockResp);
  const group = new FetchGroup({
    filters: [
      new Mock({
        testRequest: (req: FetchRequest): boolean => {
          t.deepEqual(req, mockReq);
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

test("testResponse prevents getResponse being called", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockRes = new Response();
  const group = new FetchGroup({
    filters: [
      new Mock({
        testResponse: (res: FetchResponse): boolean => {
          t.deepEqual(res, mockRes);
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

test("testResponse prevents didFetch being called", (t: TapeTestAssertions) => {
  t.plan(1);
  const mockRes = new Response();
  const group = new FetchGroup({
    filters: [
      new Mock({
        testResponse: (res: FetchResponse): boolean => {
          t.deepEqual(res, mockRes);
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
