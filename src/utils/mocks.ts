/// <reference path="../.d.ts"/>
"use strict";

import Response from "../Response";

export class Mock implements FetchEnginePlugin, FetchEngineFilter {
  constructor(args = {}) {
    Object.keys(args).forEach((method) => this.mock(method, args[method]));
  }
  mockReturn(method: string, value: any): void {
    this.mock(method, () => value);
  }
  mock(method: string, fn: Function): void {
    this[method] = fn;
  }
}

export function mockFetch(request: FetchRequest): Promise<FetchResponse> {
  return Promise.resolve(new Response());
}
