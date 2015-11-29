/// <reference path="../typings/tsd.d.ts"/>

declare type PromiseOrValue<T> = T | Promise<T>;

declare interface FetchEnginePlugin {
  // pre-fetch
  shouldFetch?: (req: Request) => boolean;
  getRequest?: (req: Request) => PromiseOrValue<Request>;
  willFetch?: (req: Request) => void;
  // fetch
  fetch?: (args: {
    cancel(): void;
    promise: Promise<Response>;
  }) => void;
  // post-fetch
  getResponse?: (req: Response) => PromiseOrValue<Response>;
  didFetch?: (req: Response) => void;
}

declare interface FetchEngineFilter {
  testRequest?: (req: Request) => boolean;
  testResponse?: (req: Response, res: Request) => boolean;
}

declare interface FetchEngineOptions {
  plugins?: Array<FetchEnginePlugin>;
}

declare interface FetchGroupOptions extends FetchEngineOptions {
  filters?: Array<FetchEngineFilter>;
}

declare interface Fetch {
  (url: string | Request, init?: RequestInit): Promise<Response>;
}
