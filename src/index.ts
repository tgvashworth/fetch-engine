/// <reference path="./.d.ts"/>
"use strict";
import { Maybe } from "./Maybe";
import composeEvery from "./composeEvery";
import getBoundImplementations from "./getBoundImplementations";

export class Request implements Request {
  method: string = "GET";
  url: string;
  constructor(input: string | Request, init?: RequestInit)  {
    if (typeof input === "string") {
      this.url = input;
    } else {
      this.url = input.url;
    }
  }
}

export class Response implements Response {
  constructor() {}
}

export class FetchGroup implements FetchEnginePlugin, FetchEngineFilter {
  constructor(opts: FetchGroupOptions = {}) {
    const { filters = [], plugins = [] }: FetchGroupOptions = opts;

    this.testRequest =
      composeEvery(getBoundImplementations("testRequest", plugins));
    this.shouldFetch =
      composeEvery(getBoundImplementations("shouldFetch", plugins));
    // TODO: getRequest
    // TODO: willFetch
    // TODO: fetch
    // TODO: getResponse
    // TODO: testResponse
    // TODO: didFetch
  }
  testRequest(req: Request): boolean {
    return true;
  }
  shouldFetch(req: Request): boolean {
    return true;
  }
  getRequest(req: Request): Promise<Request> {
    return Promise.resolve(req);
  }
  willFetch(req: Request): void {}
  fetch({ promise: Promise, cancel: Function }): void {}
  testResponse(req: Response): boolean {
    return true;
  }
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
