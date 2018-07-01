// tslint:disable:no-var-requires max-classes-per-file
import "whatwg-fetch";
import {
  FetchNext,
  IFetchFetchingArgs,
} from "../d";
import FetchGroup from "../FetchGroup";

it(
  "FetchGroup is requireable",
  () => {
    expect.assertions(1);
    expect(FetchGroup).toBeTruthy();
  },
);

it(
  "FetchGroup has default plugin implementations",
  () => {
    expect.assertions(8);
    const group = new FetchGroup();
    const mockRequest = new Request("/mock");
    const mockResponse = new Response();
    const mockPromise = Promise.resolve(mockResponse);
    expect(group.shouldFetch(mockRequest)).toBeTruthy();
    expect(typeof group.willFetch === "function").toBeTruthy();
    expect(typeof group.fetch === "function").toBeTruthy();
    expect(typeof group.fetching === "function").toBeTruthy();
    expect(typeof group.didFetch === "function").toBeTruthy();
    return Promise.resolve()
      .then(() => group.getRequest(mockRequest))
      .then((req: Request) => {
        expect(req).toEqual(mockRequest);
      })
      .then(() => group.fetch(mockRequest, () => mockPromise))
      .then((res: Response) => {
        expect(res).toEqual(mockResponse);
        return group.getResponse(res);
      })
      .then((res: Response) => {
        expect(res).toEqual(mockResponse);
      });
  },
);

// shouldFetch

test(
  "shouldFetch true value is respected",
  () => {
    expect.assertions(1);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      plugins: [
        {
          shouldFetch: (): boolean => true,
        },
      ],
    });
    expect(group.shouldFetch(mockReq)).toEqual(true);
  },
);

test(
  "shouldFetch false value is respected",
  () => {
    expect.assertions(1);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      plugins: [
        {
          shouldFetch: (): boolean => false,
        },
      ],
    });
    expect(group.shouldFetch(mockReq)).toEqual(false);
  },
);

test(
  "shouldFetch true value is respected with multiple plugins",
  () => {
    expect.assertions(1);
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
    expect(group.shouldFetch(mockReq)).toEqual(true);
  },
);

test(
  "shouldFetch false value is respected with multiple plugins",
  () => {
    expect.assertions(1);
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
    expect(group.shouldFetch(mockReq)).toEqual(false);
  },
);

// getRequest

it(
  "getRequest is passed the input request",
  () => {
    expect.assertions(2);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      plugins: [
        {
          getRequest: (req: Request): Promise<Request> => {
            expect(req).toEqual(mockReq);
            return Promise.resolve(req);
          },
        },
      ],
    });
    return group.getRequest(mockReq)
      .then((req: Request) => {
        expect(req).toEqual(mockReq);
      });
  },
);

it(
  "getRequest output is passed back",
  () => {
    expect.assertions(1);
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
        expect(req).toEqual(newReq);
      });
  },
);

it(
  "getRequest output is passed back with multiple plugins",
  () => {
    expect.assertions(3);
    const mockReq = new Request("/mock");
    const secondReq = new Request("/another-mock");
    const thirdReq = new Request("/another-mock");
    const group = new FetchGroup({
      plugins: [
        {
          getRequest: (req: Request): Promise<Request> => {
            expect(req).toEqual(mockReq);
            return Promise.resolve(secondReq);
          },
        },
        {
          getRequest: (req: Request): Promise<Request> => {
            expect(req).toEqual(secondReq);
            return Promise.resolve(thirdReq);
          },
        },
      ],
    });
    return group.getRequest(mockReq)
      .then((req: Request) => {
        expect(req).toEqual(thirdReq);
      });
  },
);

// willFetch

it(
  "willFetch is passed the input request",
  () => {
    expect.assertions(1);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      plugins: [
        {
          willFetch: (req: Request): void => {
            expect(req).toEqual(mockReq);
          },
        },
      ],
    });
    group.willFetch(mockReq);
  },
);

it(
  "willFetch output is ignored",
  () => {
    expect.assertions(1);
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
    expect(result).toEqual(undefined);
  },
);

it(
  "willFetch is passed the same request in multiple plugins",
  () => {
    expect.assertions(2);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      plugins: [
        {
          willFetch: (req: Request): void => {
            expect(req).toEqual(mockReq);
          },
        },
        {
          willFetch: (req: Request): void => {
            expect(req).toEqual(mockReq);
          },
        },
      ],
    });
    group.willFetch(mockReq);
  },
);

// fetch

it(
  "fetch is passed the input request and a 'next' function which is eventually called",
  () => {
    expect.assertions(3);
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
            expect(request).toEqual(mockReq);
            expect(typeof next === "function").toBeTruthy();
            return next();
          },
        },
      ],
    });
    return group.fetch(mockReq, () => mockPromise)
      .then((res: Response) => {
        expect(res).toEqual(mockResponse);
      });
  },
);

it(
  "each fetch step is passed same request & can pass control to the next mock",
  () => {
    expect.assertions(3);
    const mockReq = new Request("/mock");
    const mockResponse = new Response();
    const mockPromise = Promise.resolve(mockResponse);
    const group = new FetchGroup({
      plugins: [
        {
          fetch: (request, next): Promise<Response> => {
            expect(request).toEqual(mockReq);
            return next();
          },
        },
        {
          fetch: (request, next): Promise<Response> => {
            expect(request).toEqual(mockReq);
            return next();
          },
        },
      ],
    });
    return group.fetch(mockReq, () => mockPromise)
      .then((res: Response) => {
        expect(res).toEqual(mockResponse);
      });
  },
);

it(
  "a fetch step can return early",
  () => {
    expect.assertions(1);
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
        expect(res).toEqual(mockResponse);
      });
  },
);

// fetching

it(
  "fetching is passed the input request and a promise for the response",
  () => {
    expect.assertions(2);
    const mockReq = new Request("/mock");
    const mockPromise = Promise.resolve(new Response());
    const group = new FetchGroup({
      plugins: [
        {
          fetching: (args: IFetchFetchingArgs): void => {
            expect(args.request).toEqual(mockReq);
            expect(args.promise).toEqual(mockPromise);
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

it(
  "fetching is passed same input for multiple plugins",
  () => {
    expect.assertions(4);
    const mockReq = new Request("/mock");
    const mockPromise = Promise.resolve(new Response());
    const group = new FetchGroup({
      plugins: [
        {
          fetching: (args: IFetchFetchingArgs): void => {
            expect(args.request).toEqual(mockReq);
            expect(args.promise).toEqual(mockPromise);
          },
        },
        {
          fetching: (args: IFetchFetchingArgs): void => {
            expect(args.request).toEqual(mockReq);
            expect(args.promise).toEqual(mockPromise);
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

it(
  "getResponse is passed the input response",
  () => {
    expect.assertions(2);
    const mockRes = new Response();
    const group = new FetchGroup({
      plugins: [
        {
          getResponse: (res: Response): Promise<Response> => {
            expect(res).toEqual(mockRes);
            return Promise.resolve(res);
          },
        },
      ],
    });
    return group.getResponse(mockRes)
      .then((res: Response) => {
        expect(res).toEqual(mockRes);
      });
  },
);

it(
  "getResponse output is passed back",
  () => {
    expect.assertions(1);
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
        expect(res).toEqual(newRes);
      });
  },
);

it(
  "getResponse output is passed back with multiple plugins",
  () => {
    expect.assertions(3);
    const mockRes = new Response();
    const secondRes = new Response();
    const thirdRes = new Response();
    const group = new FetchGroup({
      plugins: [
        {
          getResponse: (req: Response): Promise<Response> => {
            expect(req).toEqual(mockRes);
            return Promise.resolve(secondRes);
          },
        },
        {
          getResponse: (req: Response): Promise<Response> => {
            expect(req).toEqual(secondRes);
            return Promise.resolve(thirdRes);
          },
        },
      ],
    });
    return group.getResponse(mockRes)
      .then((req: Response) => {
        expect(req).toEqual(thirdRes);
      });
  },
);

// didFetch

it(
  "didFetch is passed the input response",
  () => {
    expect.assertions(1);
    const mockRes = new Response();
    const group = new FetchGroup({
      plugins: [
        {
          didFetch: (req: Response): void => {
            expect(req).toEqual(mockRes);
          },
        },
      ],
    });
    group.didFetch(mockRes);
  },
);

it(
  "didFetch output is ignored",
  () => {
    expect.assertions(1);
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
    expect(result).toEqual(undefined);
  },
);

it(
  "didFetch is passed the same response in multiple plugins",
  () => {
    expect.assertions(2);
    const mockRes = new Response();
    const group = new FetchGroup({
      plugins: [
        {
          didFetch: (req: Response): void => {
            expect(req).toEqual(mockRes);
          },
        },
        {
          didFetch: (req: Response): void => {
            expect(req).toEqual(mockRes);
          },
        },
      ],
    });
    group.didFetch(mockRes);
  },
);

// testRequest

it(
  "testRequest prevents shouldFetch being called",
  () => {
    expect.assertions(1);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      filters: [
        {
          testRequest: (req: Request): boolean => {
            expect(req).toEqual(mockReq);
            return false;
          },
        },
      ],
      plugins: [
        {
          shouldFetch: (req: Request): boolean => {
            throw new Error("shouldFetch was called");
          },
        },
      ],
    });
    group.shouldFetch(mockReq);
  },
);

it(
  "testRequest prevents getRequest being called",
  () => {
    expect.assertions(1);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      filters: [
        {
          testRequest: (req: Request): boolean => {
            expect(req).toEqual(mockReq);
            return false;
          },
        },
      ],
      plugins: [
        {
          getRequest: (req: Request): Request => {
            throw new Error("getRequest was called");
          },
        },
      ],
    });
    group.getRequest(mockReq);
  },
);

it(
  "testRequest prevents willFetch being called",
  () => {
    expect.assertions(1);
    const mockReq = new Request("/mock");
    const group = new FetchGroup({
      filters: [
        {
          testRequest: (req: Request): boolean => {
            expect(req).toEqual(mockReq);
            return false;
          },
        },
      ],
      plugins: [
        {
          willFetch: (req: Request): void => {
            throw new Error("willFetch was called");
          },
        },
      ],
    });
    group.willFetch(mockReq);
  },
);

it(
  "testRequest prevents fetch being called",
  () => {
    expect.assertions(1);
    const mockReq = new Request("/mock");
    const mockResp = new Response();
    const mockPromise = Promise.resolve(mockResp);
    const group = new FetchGroup({
      filters: [
        {
          testRequest: (req: Request): boolean => {
            expect(req).toEqual(mockReq);
            return false;
          },
        },
      ],
      plugins: [
        {
          fetching: (args: IFetchFetchingArgs): void => {
            throw new Error("fetch was called");
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

// testResponse

it(
  "testResponse prevents getResponse being called",
  () => {
    expect.assertions(1);
    const mockRes = new Response();
    const group = new FetchGroup({
      filters: [
        {
          testResponse: (res: Response): boolean => {
            expect(res).toEqual(mockRes);
            return false;
          },
        },
      ],
      plugins: [
        {
          getResponse: (res: Response): Response => {
            throw new Error("getResponse was called");
          },
        },
      ],
    });
    group.getResponse(mockRes);
  },
);

it(
  "testResponse prevents didFetch being called",
  () => {
    expect.assertions(1);
    const mockRes = new Response();
    const group = new FetchGroup({
      filters: [
        {
          testResponse: (res: Response): boolean => {
            expect(res).toEqual(mockRes);
            return false;
          },
        },
      ],
      plugins: [
        {
          didFetch: (res: Response): void => {
            throw new Error("didFetch was called");
          },
        },
      ],
    });
    group.didFetch(mockRes);
  },
);
