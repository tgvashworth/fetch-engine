/// <reference path="../.d.ts"/>
"use strict";

export class MockRequest implements FetchRequest {
  bodyUsed: boolean = false;
  arrayBuffer: any;
  blob: any;
  formData: any;
  text: any;
  json: any;
  method: string;
  url: string;
  headers: FetchHeaders;
  context: string;
  referrer: string;
  mode: string;
  credentials: string;
  cache: string;
  constructor(input: string) {
    this.url = input;
  }
  clone(): MockRequest {
    return new MockRequest(this.url);
  }
}
export class MockResponse implements FetchResponse {
  bodyUsed: boolean = false;
  arrayBuffer: any;
  blob: any;
  formData: any;
  text: any;
  json: any;
  type: string;
  url: string;
  status: number;
  ok: boolean;
  statusText: string;
  headers: FetchHeaders;
  constructor() {
    return this;
  }
  error(): MockResponse {
    return new MockResponse();
  }
  redirect(url: string, status: number): MockResponse {
    return new MockResponse();
  }
  clone(): MockResponse {
    return new MockResponse();
  }
}
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
