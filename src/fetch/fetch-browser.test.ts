/// <reference path="../.d.test.ts" />
"use strict";
import test = require("tape");

import fetchBrowser from "./fetch-browser";

test("fetch-browser is requirable", t => {
  t.plan(1);
  t.ok(fetchBrowser);
});
