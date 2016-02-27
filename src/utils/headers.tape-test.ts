/// <reference path="../.d.test.ts" />
"use strict";

import test = require("tape");
import {
  isForbiddenHeaderName,
  isForbiddenResponseHeaderName,
  isSimpleHeader,
  getNormalizedHeaderName,
} from "./headers";

test(
  "Functions are requireable",
  (t: TapeTestAssertions) => {
    t.plan(4);
    t.ok(isForbiddenHeaderName);
    t.ok(isForbiddenResponseHeaderName);
    t.ok(isSimpleHeader);
    t.ok(getNormalizedHeaderName);
  }
);

test(
  "getNormalizedHeaderName() strips all whitespace types",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.equal(getNormalizedHeaderName("\r\t\n header-name\r\t \n"), "header-name");
  }
);

test(
  "getNormalizedHeaderName() lowercases characters",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.equal(getNormalizedHeaderName("Header-Name"), "header-name");
  }
);

test(
  "isForbiddenHeaderName() returns true if forbidden",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.ok(isForbiddenHeaderName("Content-Length"));
  }
);

test(
  "isForbiddenHeaderName() returns false if allowed",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.notOk(isForbiddenHeaderName("Not-Forbidden"));
  }
);

test(
  "isForbiddenResponseHeaderName() returns true if forbidden",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.ok(isForbiddenResponseHeaderName("Set-Cookie"));
  }
);

test(
  "isForbiddenResponseHeaderName() returns false if allowed",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.notOk(isForbiddenResponseHeaderName("Not-Forbidden"));
  }
);

test(
  "isSimpleHeader() returns true if simple header name",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.ok(isSimpleHeader("Content-Type"));
  }
);

test(
  "isSimpleHeader() returns true if valid name/value combination",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.ok(isSimpleHeader("Content-Type", "text/plain"));
  }
);

test(
  "isSimpleHeader() returns false if not simple header name",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.notOk(isSimpleHeader("Not-Simple"));
  }
);

test(
  "isSimpleHeader() returns false if invalid name/value combination",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.notOk(isSimpleHeader("Content-Type", "not/allowed-mime"));
  }
);
