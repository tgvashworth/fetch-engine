/// <reference path="./.d.ts"/>
"use strict";

export class Request implements FetchRequest {
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
}
export class Response implements FetchResponse {}

export default function fetch(request: FetchRequest): Promise<FetchResponse> {
  return Promise.resolve(new Response());
}
