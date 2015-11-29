/// <reference path="../typings/tsd.d.ts"/>

export type PromiseOrValue<T> = T | Promise<T>;

export interface FetchEnginePlugin {
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

export interface FetchEngineFilter {
	testRequest?: (Request) => boolean;
	testResponse?: (Response, Request) => boolean;
}

export interface FetchEngineOptions {
	plugins?: Array<FetchEnginePlugin>
}

export interface FetchGroupOptions extends FetchEngineOptions {
  filters?: Array<FetchEngineFilter>
}

export interface Fetch {
  (url: string | Request, init?: RequestInit): Promise<Response>
}

export class FetchGroup {
  filters: Array<FetchEngineFilter>;
  plugins: Array<FetchEnginePlugin>;
  constructor(opts: FetchGroupOptions) {
    const { filters=[], plugins=[] } = opts;
    this.filters = filters;
    this.plugins = plugins;
  }
}

export const fetchEngine = (opts: FetchEngineOptions): Fetch => window.fetch;
