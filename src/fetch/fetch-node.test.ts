/// <reference path="../.d.test.ts" />
"use strict";
import test = require("tape");

import fetchNode from "./fetch-node";

test("fetch-node is requirable", t => {
  t.plan(1);
  t.ok(fetchNode);
});
