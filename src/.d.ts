/// <reference path="../typings/tsd.d.ts"/>

declare type PromiseOrValue<T> = T | Promise<T>;

declare interface FetchEnginePlugin {
	// pre-fetch
	shouldFetch?: (Request) => boolean;
	getRequest?: (Request) => PromiseOrValue<Request>;
	willFetch?: (Request) => void;
	// fetch
	fetch?: (args: {
		cancel(): void;
		promise: Promise<Response>;
	}) => void;
	// post-fetch
	getResponse?: (Response) => PromiseOrValue<Response>;
	didFetch?: (Response) => void;
}

declare interface FetchEngineFilter {
	testRequest?: (Request) => boolean;
	testResponse?: (Response, Request) => boolean;
}

declare interface FetchEngineOptions {
	plugins?: Array<FetchEnginePlugin>
}

declare interface FetchGroupOptions extends FetchEngineOptions {
  filters?: Array<FetchEngineFilter>
}

declare interface Fetch {
  (url: string | Request, init?: RequestInit): Promise<Response>
}
