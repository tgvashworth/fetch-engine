/// <reference path="./.d.ts"/>
"use strict";

import makeFetchEngine from "./fetchEngine";
import fetch from "./fetch/fetch-browser";
const fetchEngine = makeFetchEngine(fetch);
export = fetchEngine;
