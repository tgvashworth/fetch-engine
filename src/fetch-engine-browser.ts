/// <reference path="./.d.ts"/>
"use strict";

import makeFetchEngine from "./fetchEngine";
import fetch from "./fetch/fetch-browser";
module.exports = makeFetchEngine(fetch);
