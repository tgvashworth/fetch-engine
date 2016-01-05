/// <reference path="./.d.ts"/>
"use strict";
import composeEvery from "./utils/composeEvery";
import composePromise from "./utils/composePromise";
import composeVoid from "./utils/composeVoid";
import composeContinuation from "./utils/composeContinuation";
import getBoundImplementations from "./utils/getBoundImplementations";

export default class FetchGroup implements FetchEnginePlugin {
  // Filters
  private _testRequest: (req: FetchRequest) => boolean;
  private _testResponse: (req: FetchResponse) => boolean;
  // Plugins
  private _shouldFetch: (req: FetchRequest) => boolean;
  private _getRequest: (req: FetchRequest) => Promise<FetchRequest>;
  private _willFetch: (req: FetchRequest) => void;
  private _fetch: (
    req: FetchRequest,
    fetch: Fetch
  ) => Promise<FetchResponse>;
  private _fetching: (args: FetchFetchingArgs) => void;
  private _getResponse: (req: FetchResponse) => Promise<FetchResponse>;
  private _didFetch: (req: FetchResponse) => void;
  constructor(opts: FetchGroupOptions = {}) {
    const { plugins = [], filters = [] }: FetchGroupOptions = opts;

    // Filters
    this._testRequest =
      composeEvery(getBoundImplementations("testRequest", filters));
    this._testResponse =
      composeEvery(getBoundImplementations("testResponse", filters));

    // Plugin methods
    this._shouldFetch =
      composeEvery(getBoundImplementations("shouldFetch", plugins));
    this._getRequest =
      composePromise(getBoundImplementations("getRequest", plugins));
    this._willFetch =
      composeVoid(getBoundImplementations("willFetch", plugins));
    this._fetch =
      composeContinuation<FetchRequest, Promise<FetchResponse>>(
        getBoundImplementations("fetch", plugins)
      );
    this._fetching =
      composeVoid(getBoundImplementations("fetching", plugins));
    this._getResponse =
      composePromise(getBoundImplementations("getResponse", plugins));
    this._didFetch =
      composeVoid(getBoundImplementations("didFetch", plugins));
  }
  // Plugins
  shouldFetch(req: FetchRequest): boolean {
    return this._testRequest(req) && this._shouldFetch(req);
  }
  getRequest(req: FetchRequest): Promise<FetchRequest> {
    if (this._testRequest(req)) {
      return this._getRequest(req);
    }
    return Promise.resolve(req);
  }
  willFetch(req: FetchRequest): void {
    if (this._testRequest(req)) {
      return this._willFetch(req);
    }
  }
  fetch(request: FetchRequest, fetch: FetchNext): Promise<FetchResponse> {
    return this._fetch(request, fetch);
  }
  fetching(args: FetchFetchingArgs): void {
    const { request } = args;
    if (this._testRequest(request)) {
      return this._fetching(args);
    }
  }
  getResponse(res: FetchResponse): Promise<FetchResponse> {
    if (this._testResponse(res)) {
      return this._getResponse(res);
    }
    return Promise.resolve(res);
  }
  didFetch(res: FetchResponse): void {
    if (this._testResponse(res)) {
      return this._didFetch(res);
    }
  }
}
