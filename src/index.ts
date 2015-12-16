/// <reference path="./.d.ts"/>
"use strict";
import composeEvery from "./composeEvery";
import composePromise from "./composePromise";
import composeVoid from "./composeVoid";
import getBoundImplementations from "./getBoundImplementations";

export class Request {
  method: string = "GET";
  url: string;
  constructor(input: string | Request, init?: FetchRequestInit)  {
    if (typeof input === "string") {
      this.url = input;
    } else {
      this.url = input.url;
    }
  }
}

export class Response {}

export class FetchGroup implements FetchEnginePlugin, FetchEngineFilter {
  constructor(opts: FetchGroupOptions = {}) {
    const { plugins = [] }: FetchGroupOptions = opts;

    this.testRequest =
      composeEvery(getBoundImplementations("testRequest", plugins));
    this.shouldFetch =
      composeEvery(getBoundImplementations("shouldFetch", plugins));
    this.getRequest =
      composePromise(getBoundImplementations("getRequest", plugins));
    this.willFetch =
      composeVoid(getBoundImplementations("willFetch", plugins));
    this.fetch =
      composeVoid(getBoundImplementations("fetch", plugins));
    this.getRequest =
      composePromise(getBoundImplementations("getResponse", plugins));
    this.testResponse =
      composeEvery(getBoundImplementations("testResponse", plugins));
    this.didFetch =
      composeVoid(getBoundImplementations("didFetch", plugins));
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
  fetch(args: FetchArgs): void {}
  testResponse(req: Response): boolean {
    return true;
  }
  getResponse(res: Response): Promise<Response> {
    return Promise.resolve(res);
  }
  didFetch(res: Response): void {}
}

export function fetchEngine(group: FetchGroup): Fetch {
  return function (request: string, init?: FetchRequestInit): Promise<Response> {
    return Promise.resolve(new Response());
  };
};
