/// <reference path="./.d.ts"/>
"use strict";

export class MockRequest implements FetchRequest {
  url: string;
  constructor(input: string) {
    this.url = input;
  }
}
export class MockResponse implements FetchResponse {}
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
