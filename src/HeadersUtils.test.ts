/// <reference path="./.d.test.ts" />
"use strict";

import test = require("ava");
import {
  isForbiddenHeaderName,
  isForbiddenResponseHeaderName,
  isSimpleHeader,
  getNormalizedHeaderName,
} from "./HeadersUtils";

test(
  "Functions are requireable",
  (t: TestAssertions) => {
    t.ok(isForbiddenHeaderName);
    t.ok(isForbiddenResponseHeaderName);
    t.ok(isSimpleHeader);
    t.ok(getNormalizedHeaderName);
    t.end();
  }
);

test(
  "getNormalizedHeaderName() strips all whitespace types",
  (t: TestAssertions) => {
    t.same(getNormalizedHeaderName("\r\t\n header-name\r\t \n"), "header-name");
    t.end();
  }
);

test(
  "getNormalizedHeaderName() lowercases characters",
  (t: TestAssertions) => {
    t.same(getNormalizedHeaderName("Header-Name"), "header-name");
    t.end();
  }
);

test(
  "isForbiddenHeaderName() returns true if forbidden",
  (t: TestAssertions) => {
    t.true(isForbiddenHeaderName("Content-Length"));
    t.end();
  }
);

test(
  "isForbiddenHeaderName() returns false if allowed",
  (t: TestAssertions) => {
    t.false(isForbiddenHeaderName("Not-Forbidden"));
    t.end();
  }
);

test(
  "isForbiddenResponseHeaderName() returns true if forbidden",
  (t: TestAssertions) => {
    t.true(isForbiddenResponseHeaderName("Set-Cookie"));
    t.end();
  }
);

test(
  "isForbiddenResponseHeaderName() returns false if allowed",
  (t: TestAssertions) => {
    t.false(isForbiddenResponseHeaderName("Not-Forbidden"));
    t.end();
  }
);

test(
  "isSimpleHeader() returns true if simple header name",
  (t: TestAssertions) => {
    t.true(isSimpleHeader("Content-Type"));
    t.end();
  }
);

test(
  "isSimpleHeader() returns true if valid name/value combination",
  (t: TestAssertions) => {
    t.true(isSimpleHeader("Content-Type", "text/plain"));
    t.end();
  }
);

test(
  "isSimpleHeader() returns false if not simple header name",
  (t: TestAssertions) => {
    t.false(isSimpleHeader("Not-Simple"));
    t.end();
  }
);

test(
  "isSimpleHeader() returns false if invalid name/value combination",
  (t: TestAssertions) => {
    t.false(isSimpleHeader("Content-Type", "not/allowed-mime"));
    t.end();
  }
);
