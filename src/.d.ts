/// <reference path="../typings/tsd.d.ts"/>

export declare type PromiseOrValue<T> = T | Promise<T>;

export declare interface FetchEnginePlugin {
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

export declare interface FetchEngineFilter {
	testRequest?: (Request) => boolean;
	testResponse?: (Response, Request) => boolean;
}

export declare interface FetchEngineOptions {
	plugins?: Array<FetchEnginePlugin>
}

export declare interface FetchGroupOptions extends FetchEngineOptions {
  filters?: Array<FetchEngineFilter>
}

export declare interface Fetch {
  (url: string | Request, init?: RequestInit): Promise<Response>
}
