/// <reference path="../typings/tsd.d.ts"/>

// fetch-spec

declare class FetchRequest {
  url: string;
}

declare class FetchHeaders {
  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string;
  getAll(name: string): Array<string>;
  has(name: string): boolean;
  set(name: string, value: string): void;
}

declare class FetchResponse {}

declare interface Fetch {
  (request: FetchRequest): Promise<FetchResponse>;
}

// fetch-engine types

declare interface FetchArgs {
  request: FetchRequest;
  promise: Promise<FetchResponse>;
  cancel?(): void;
}

declare interface FetchEnginePlugin {
  // pre-fetch
  shouldFetch?: (req: FetchRequest) => boolean;
  getRequest?: (req: FetchRequest) => Promise<FetchRequest>;
  willFetch?: (req: FetchRequest) => void;
  // fetch
  fetch?: (args: FetchArgs) => void;
  // post-fetch
  getResponse?: (req: FetchResponse) => Promise<FetchResponse>;
  didFetch?: (req: FetchResponse) => void;
}

declare interface FetchEngineFilter {
  testRequest?: (req: FetchRequest) => boolean;
  testResponse?: (req: FetchResponse) => boolean;
}

declare interface FetchGroupOptions {
  plugins?: Array<FetchEnginePlugin>;
  filters?: Array<FetchEngineFilter>;
}
