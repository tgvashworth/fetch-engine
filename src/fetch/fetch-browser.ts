/// <reference path="../.d.ts"/>
"use strict";

import Response from "../Response";

export default function fetch(request: FetchRequest): Promise<FetchResponse> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(request.method, request.url, true);
    xhr.onload = () => {
      resolve(new Response(xhr.responseText, {
        status: xhr.status,
        statusText: xhr.statusText
      }));
    };
    xhr.onerror = () => {
      // TODO: handle errors
      reject(new Error(`Request failed: ${xhr.status} ${xhr.statusText}`));
    };
    xhr.send();
  });
}
