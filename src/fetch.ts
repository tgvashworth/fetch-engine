/// <reference path="./.d.ts"/>
"use strict";

export class Request implements FetchRequest {}
export class Response implements FetchResponse {}

export default function fetch(request: FetchRequest): Promise<FetchResponse> {
  return Promise.resolve(new Response());
}
