/// <reference path="./.d.ts"/>
"use strict";
import composeEvery from "./composeEvery";
import composePromise from "./composePromise";
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

export class Response implements Response {}

export class FetchGroup implements FetchEnginePlugin, FetchEngineFilter {
  constructor(opts: FetchGroupOptions = {}) {
    const { plugins = [] }: FetchGroupOptions = opts;

    this.testRequest =
      composeEvery(getBoundImplementations("testRequest", plugins));
    this.shouldFetch =
      composeEvery(getBoundImplementations("shouldFetch", plugins));
    this.getRequest =
      composePromise(getBoundImplementations("getRequest", plugins));
    // TODO: willFetch
    // TODO: fetch
    this.getRequest =
      composePromise(getBoundImplementations("getResponse", plugins));
    this.testResponse =
      composeEvery(getBoundImplementations("testResponse", plugins));
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
  fetch(): void {}
  testResponse(req: Response): boolean {
    return true;
  }
  getResponse(res: Response): Promise<Response> {
    return Promise.resolve(res);
  }
  didFetch(): void {}
}

export function fetchEngine(group: FetchGroup): Fetch {
  return function (request: string, init?: RequestInit): Promise<Response> {
    return Promise.resolve(new Response());
  };
};
