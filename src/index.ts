/// <reference path="./.d.ts"/>
"use strict";
import * as Maybe from "./Maybe";

export class Request implements Request {
  constructor(input: string | Request, init?: RequestInit)  {}
}

export class Response implements Response {
  constructor() {}
}

export class FetchGroup implements FetchEnginePlugin {
  filters: Array<FetchEngineFilter>;
  plugins: Array<FetchEnginePlugin>;
  constructor(opts: FetchGroupOptions = {}) {
    const { filters = [], plugins = [] }: FetchGroupOptions = opts;
    this.filters = filters;
    this.plugins = plugins;
  }
  shouldFetch(req: Request): boolean {
    return true;
  }
  getRequest(req: Request): Promise<Request> {
    return Promise.resolve(req);
  }
  willFetch(req: Request): void {}
  fetch({ promise: Promise, cancel: Function }): void {}
  getResponse(res: Response): Promise<Response> {
    return Promise.resolve(res);
  }
  didFetch(res: Response): void {}
}

export function fetchEngine(group: FetchGroup): Fetch {
  return function (request: string, init?: RequestInit): Promise<Response> {
    return Promise.resolve(new Response());
  };
};
