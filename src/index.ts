/// <reference path="./.d.ts"/>
"use strict";

export class Request implements FetchRequest {}
export class Response implements FetchResponse {}

export function fetchEngine(plugin: FetchEnginePlugin): Fetch {
  return function (request: string): Promise<FetchResponse> {
    return Promise.resolve(new Response());
  };
};
