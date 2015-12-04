/// <reference path="./.d.ts"/>
"use strict";
import { Maybe } from "./Maybe";

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

export class FetchGroup implements FetchEnginePlugin {
  filters: Array<FetchEngineFilter>;
  plugins: Array<FetchEnginePlugin>;
  constructor(opts: FetchGroupOptions = {}) {
    const { filters = [], plugins = [] }: FetchGroupOptions = opts;
    this.filters = filters;
    this.plugins = plugins;

    type ShouldFetch = (Request) => boolean;
    this.shouldFetch =
      plugins
        .map(plugin => [plugin, plugin.shouldFetch])
        .reduceRight(
          (
            next: ShouldFetch,
            [plugin, shouldFetch]: [FetchEnginePlugin, ShouldFetch]
          ): ShouldFetch => (
            (req: Request): boolean => (
              shouldFetch.call(plugin, req)
                ? next(req)
                : false
            )
          ),
          (r: Request): boolean => true
        );
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
