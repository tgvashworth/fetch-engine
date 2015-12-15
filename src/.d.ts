/// <reference path="../typings/tsd.d.ts"/>

// fetch-spec extensions

declare interface Fetch {
  (url: string | Request, init?: RequestInit): Promise<Response>;
}

// fetch-engine types

declare interface FetchEnginePlugin {
  // pre-fetch
  shouldFetch?: (req: Request) => boolean;
  getRequest?: (req: Request) => Promise<Request>;
  willFetch?: (req: Request) => void;
  // fetch
  fetch?: (args: {
    cancel(): void;
    promise: Promise<Response>;
  }) => void;
  // post-fetch
  getResponse?: (req: Response) => Promise<Response>;
  didFetch?: (req: Response) => void;
}

declare interface FetchEngineFilter {
  testRequest?: (req: Request) => boolean;
  testResponse?: (req: Response) => boolean;
}

declare interface FetchGroupOptions {
  plugins?: Array<FetchEnginePlugin>;
  filters?: Array<FetchEngineFilter>;
}
