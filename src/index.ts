/// <reference path="../typings/tsd.d.ts"/>

export interface FetchEnginePlugin {
	// pre-fetch
	shouldFetch?: (Request) => boolean;
	getRequest?: (Request) => Request;
	willFetch?: (Request) => void;
	// fetch
	fetch?: (args: {
		cancel(): void;
		promise: Promise<Response>;
	}) => void;
	// post-fetch
	getResponse?: (Response) => Response;
	didFetch?: (Response) => void;
}

export interface FetchEngineFilter {
	testRequest?: (Request) => boolean;
	testResponse?: (Response, Request) => boolean;
}

export interface FetchEngineOptions {
	plugins?: Array<FetchEnginePlugin>
}

export interface Fetch {
  (url: string|Request, init?: RequestInit): Promise<Response>
}

export const fetchEngine = (opts: FetchEngineOptions): Fetch => window.fetch;
