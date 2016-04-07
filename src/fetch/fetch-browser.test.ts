/// <reference path="../.d.test.ts" />
"use strict";
import test = require("tape");

import fetchBrowser from "./fetch-browser";
import wrap from "../utils/wrapPromiseTest";
import Request from "../Request";

test("fetch-browser is requirable", t => {
  t.plan(1);
  t.ok(fetchBrowser);
});

test("fetch-browser can make a request to the test server", wrap(t => {
  t.plan(2);
  const req = new Request("/fetch-browser/basic");
  return fetchBrowser(req)
    .then(res => {
      t.ok(res);
      return res.text();
    })
    .then(text => {
      t.equal(text, "Hello fetch-browser");
    });
}));
