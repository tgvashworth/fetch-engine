/// <reference path="./.d.ts"/>
"use strict";

import innerFetch = require("isomorphic-fetch");

export default function fetch(request: FetchRequest): Promise<FetchResponse> {
  return innerFetch(request.url, request);
}
