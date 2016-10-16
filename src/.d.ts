// fetch-spec

declare class FetchBody {
  bodyUsed: boolean;
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  formData(): Promise<FormData>;
  json(): Promise<any>;
  json<T>(): Promise<T>;
  text(): Promise<string>;
}

declare class FetchRequest extends FetchBody {
  method: string;
  url: string;
  headers: FetchHeaders;
  context: string;
  referrer: string;
  mode: string;
  credentials: string;
  cache: string;
  constructor(input: string|FetchRequest, init?: FetchRequestInit);
  clone(): FetchRequest;
}

interface FetchRequestInit {
  method?: string;
  headers?: FetchHeaderInit|{ [index: string]: string };
  body?: FetchBodyInit;
  mode?: string;
  credentials?: string;
  cache?: string;
}

declare class FetchHeaders {
  append(name: string, value: string): void;
  delete(name: string): void;
  get(name: string): string;
  getAll(name: string): Array<string>;
  has(name: string): boolean;
  set(name: string, value: string): void;
}

declare class FetchResponse extends FetchBody {
  type: string;
  url: string;
  status: number;
  ok: boolean;
  statusText: string;
  headers: FetchHeaders;
  error(): FetchResponse;
  redirect(url: string, status: number): FetchResponse;
  clone(): FetchResponse;
  constructor(body?: FetchBodyInit, init?: FetchResponseInit);
}

interface FetchResponseInit {
  status?: number;
  statusText?: string;
  headers?: FetchHeaderInit | { [index: string]: string | string[] };
  url?: string;
}

declare interface Fetch {
  (request: FetchRequest): Promise<FetchResponse>;
}

declare type FetchHeaderInit = FetchHeaders | string[];
declare type FetchBodyInit = Blob | FormData | string;

// fetch-engine types

declare type FetchNext = () => Promise<FetchResponse>;

declare interface FetchFetchingArgs {
  request: FetchRequest;
  promise: Promise<FetchResponse>;
  cancel?(): void;
}

declare interface FetchEnginePlugin {
  // pre-fetch
  shouldFetch?: (req: FetchRequest) => boolean;
  getRequest?: (req: FetchRequest) => Promise<FetchRequest>|FetchRequest;
  willFetch?: (req: FetchRequest) => void;
  // fetch
  fetch?: (req: FetchRequest, next: FetchNext) => Promise<FetchResponse>;
  fetching?: (args: FetchFetchingArgs) => void;
  // post-fetch
  getResponse?: (req: FetchResponse) => Promise<FetchResponse>|FetchResponse;
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

// "parse-headers"

declare module "parse-headers" {
  const parse: (headers: string) => { [key: string]: string | string[] };
  export = parse;
}
