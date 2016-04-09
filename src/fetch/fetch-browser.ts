/// <reference path="../.d.ts"/>
"use strict";

import parseHeaders = require("parse-headers");

import Response from "../Response";
import { Headers } from "../Headers";

export default function fetch(request: FetchRequest): Promise<FetchResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(request.method, request.url, true);

    // Set request headers
    (<Headers>request.headers).forEach((v, k) => xhr.setRequestHeader(k, v));

    xhr.onload = () => {
      resolve(new Response(xhr.responseText, {
        status: xhr.status,
        statusText: xhr.statusText,
        headers: parseHeaders(xhr.getAllResponseHeaders())
      }));
    };
    xhr.onerror = () => {
      // TODO: handle errors
      reject(new Error(`Request failed: ${xhr.status} ${xhr.statusText}`));
    };

    if (request.method === "POST") {
      if (!request.headers.get("Content-Type")) {
        xhr.setRequestHeader("Content-Type", "text/plain");
      }
      request.text()
        .then(body => xhr.send(body));
    } else {
      xhr.send();
    }
  });
}
