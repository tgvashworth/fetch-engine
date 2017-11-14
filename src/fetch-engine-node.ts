/// <reference path="./.d.ts"/>
"use strict";

import makeFetchEngine from "./fetchEngine";
import fetch from "./fetch/fetch-node";
import FetchGroup from "./FetchGroup";
import Request from "./Request";
import Response from "./Response";

const fetchEngine = makeFetchEngine(fetch);
export default fetchEngine;
export { FetchGroup, Request, Response };

