/// <reference path="../.d.ts"/>
"use strict";

import Body from "../Body";
import { ResponseHeaders } from "../Headers";
import { isValidRedirectStatus } from "../utils/http";

export default class Response extends Body implements FetchResponse {
  type: string;
  url: string;
  status: number;
  ok: boolean;
  statusText: string;
  headers: ResponseHeaders;

  constructor(body = "", init: FetchResponseInit = {}) {
    // Request inherits from Body
    super(body);

    this.type = "default";
    this.status = init.status || 200;
    this.statusText = init.statusText || "ok";
    this.ok = this.status >= 200 && this.status < 300;
    this.headers = new ResponseHeaders(init.headers);
    this.url = init.url || "";
  }

  error(): Response {
    let response = new Response(this.rawBody, {
      status: 0,
      statusText: ""
    });
    response.type = "error";
    return response;
  }

  redirect(url: string, status: number): Response {
    if (!isValidRedirectStatus(status)) {
      throw new RangeError("Invalid status code");
    }

    return new Response("", {
      status: status,
      headers: new ResponseHeaders({
        location: url
      })
    });
  }

  clone(): Response {
    if (this.bodyUsed) {
      throw new TypeError("Already read");
    }
    return new Response(this.rawBody, this);
  }
}
