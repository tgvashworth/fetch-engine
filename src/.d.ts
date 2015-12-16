/// <reference path="../typings/tsd.d.ts"/>

// fetch-spec

declare class FetchRequest extends FetchBody {
  constructor(input: string|FetchRequest, init?: FetchRequestInit);
  method: string;
  url: string;
  headers: FetchHeaders;
  context: string|FetchRequestContext;
  referrer: string;
  mode: string|FetchRequestMode;
  credentials: string|FetchRequestCredentials;
  cache: string|FetchRequestCache;
}

interface FetchRequestInit {
  method?: string;
  headers?: FetchHeaderInit|{ [index: string]: string };
  body?: FetchBodyInit;
  mode?: string|FetchRequestMode;
  credentials?: string|FetchRequestCredentials;
  cache?: string|FetchRequestCache;
}

declare enum FetchRequestContext {
  "audio", "beacon", "cspreport", "download", "embed", "eventsource", "favicon", "fetch",
  "font", "form", "frame", "hyperlink", "iframe", "image", "imageset", "import",
  "internal", "location", "manifest", "object", "ping", "plugin", "prefetch", "script",
  "serviceworker", "sharedworker", "subresource", "style", "track", "video", "worker",
  "xmlhttprequest", "xslt"
}
declare enum FetchRequestMode { "same-origin", "no-cors", "cors" }
declare enum FetchRequestCredentials { "omit", "same-origin", "include" }
declare enum FetchRequestCache { "default", "no-store", "reload", "no-cache", "force-cache", "only-if-cached" }

declare class FetchHeaders {
  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string;
  getAll(name: string): Array<string>;
  has(name: string): boolean;
  set(name: string, value: string): void;
}

declare class FetchBody {
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  json<T>(): Promise<T>;
  text(): Promise<string>;
}
declare class FetchResponse extends FetchBody {
  type: string|FetchResponseType;
  url: string;
  status: number;
  ok: boolean;
  statusText: string;
  headers: FetchHeaders;
  constructor(body?: FetchBodyInit, init?: FetchResponseInit);
  error(): FetchResponse;
  redirect(url: string, status: number): FetchResponse;
  clone(): FetchResponse;
}

declare enum FetchResponseType { "basic", "cors", "default", "error", "opaque" }

interface FetchResponseInit {
  status: number;
  statusText?: string;
  headers?: FetchHeaderInit;
}

declare type FetchHeaderInit = FetchHeaders|Array<string>;
declare type FetchBodyInit = Blob|FormData|string;
declare type FetchRequestInfo = FetchRequest|string;

declare interface Fetch {
  (url: string | FetchRequest, init?: FetchRequestInit): Promise<FetchResponse>;
}

// fetch-engine types

declare interface FetchEnginePlugin {
  // pre-fetch
  shouldFetch?: (req: FetchRequest) => boolean;
  getRequest?: (req: FetchRequest) => Promise<FetchRequest>;
  willFetch?: (req: FetchRequest) => void;
  // fetch
  fetch?: (args: {
    cancel(): void;
    promise: Promise<FetchResponse>;
  }) => void;
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
