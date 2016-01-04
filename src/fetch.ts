/// <reference path="./.d.ts"/>
"use strict";

import Response from "./Response";

export default function fetch(request: FetchRequest): Promise<FetchResponse> {
  return Promise.resolve(new Response("", {}));
}
