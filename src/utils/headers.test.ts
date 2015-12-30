/// <reference path="../.d.test.ts" />
"use strict";

import test = require("ava");
import {
  isForbiddenHeaderName,
  isForbiddenResponseHeaderName,
  isSimpleHeader,
  getNormalizedHeaderName,
} from "./headers";

test(
  "Functions are requireable",
  (t: TestAssertions) => {
    t.ok(isForbiddenHeaderName);
    t.ok(isForbiddenResponseHeaderName);
    t.ok(isSimpleHeader);
    t.ok(getNormalizedHeaderName);
  }
);

test(
  "getNormalizedHeaderName() strips all whitespace types",
  (t: TestAssertions) => {
    t.same(getNormalizedHeaderName("\r\t\n header-name\r\t \n"), "header-name");
  }
);

test(
  "getNormalizedHeaderName() lowercases characters",
  (t: TestAssertions) => {
    t.same(getNormalizedHeaderName("Header-Name"), "header-name");
  }
);

test(
  "isForbiddenHeaderName() returns true if forbidden",
  (t: TestAssertions) => {
    t.true(isForbiddenHeaderName("Content-Length"));
  }
);

test(
  "isForbiddenHeaderName() returns false if allowed",
  (t: TestAssertions) => {
    t.false(isForbiddenHeaderName("Not-Forbidden"));
  }
);

test(
  "isForbiddenResponseHeaderName() returns true if forbidden",
  (t: TestAssertions) => {
    t.true(isForbiddenResponseHeaderName("Set-Cookie"));
  }
);

test(
  "isForbiddenResponseHeaderName() returns false if allowed",
  (t: TestAssertions) => {
    t.false(isForbiddenResponseHeaderName("Not-Forbidden"));
  }
);

test(
  "isSimpleHeader() returns true if simple header name",
  (t: TestAssertions) => {
    t.true(isSimpleHeader("Content-Type"));
  }
);

test(
  "isSimpleHeader() returns true if valid name/value combination",
  (t: TestAssertions) => {
    t.true(isSimpleHeader("Content-Type", "text/plain"));
  }
);

test(
  "isSimpleHeader() returns false if not simple header name",
  (t: TestAssertions) => {
    t.false(isSimpleHeader("Not-Simple"));
  }
);

test(
  "isSimpleHeader() returns false if invalid name/value combination",
  (t: TestAssertions) => {
    t.false(isSimpleHeader("Content-Type", "not/allowed-mime"));
  }
);
