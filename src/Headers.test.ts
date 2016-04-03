/// <reference path="./.d.test.ts" />
"use strict";
import test = require("tape");
import {
  Headers,
  ImmutableHeaders,
  RequestHeaders,
  RequestNoCorsHeaders,
  ResponseHeaders,
} from "./Headers";

test(
  "Headers is requireable",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.ok(Headers);
  }
);

test(
  "constructor() creates instance",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new Headers();
    t.ok(headers);
  }
);

test(
  "constructor() creates instance with headers dict arg",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let headers = new Headers({
      "Header-1": "Value-1",
      "Header-2": "Value-2",
    });
    t.equal(headers.get("Header-1"), "Value-1");
    t.equal(headers.get("Header-2"), "Value-2");
  }
);

test(
  "constructor() creates instance with headers list arg",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let headers = new Headers([
      ["Header-1", "Value-1"],
      ["Header-1", "Value-1"],
      ["Header-2", "Value-2"],
    ]);
    t.equal(headers.get("Header-1"), "Value-1");
    t.equal(headers.get("Header-2"), "Value-2");
  }
);

test(
  "constructor() creates instance with Headers arg",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let origHeaders = new Headers({
      "Header-1": "Value-1",
      "Header-2": "Value-2",
    });
    let headers = new Headers(origHeaders);
    t.equal(headers.get("Header-1"), "Value-1");
    t.equal(headers.get("Header-2"), "Value-2");
  }
);

test(
  "append() adds a header",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let headers = new Headers({"Header-1": "Value-1"});
    headers.append("Header-2", "Value-2");
    t.ok(headers.has("Header-1"));
    t.ok(headers.has("Header-2"));
  }
);

test(
  "append() throws if guard is immutable",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new ImmutableHeaders();
    t.throws(() => { headers.append("Header-2", "Value-2"); }, TypeError);
  }
);

test(
  "append() fails if guard is request and header is forbidden",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let headers = new RequestHeaders();
    headers.append("Header-1", "Value-1");
    headers.append("Accept-Charset", "Value-2");
    t.ok(headers.has("Header-1"));
    t.notOk(headers.has("Accept-Charset"));
  }
);

test(
  "append() fails if guard is request-no-cors and header is not simple",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let headers = new RequestNoCorsHeaders();
    headers.append("Header-1", "Value-1");
    headers.append("Content-Language", "Value-2");
    t.notOk(headers.has("Header-1"));
    t.equal(headers.get("Content-Language"), "Value-2");
  }
);

test(
  "append() succeeds if guard is request-no-cors and header is simple",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let headers = new RequestNoCorsHeaders();
    headers.append("Header-1", "Value-1");
    headers.append("Content-Type", "allowed");
    headers.append("Content-Type", "multipart/form-data");
    t.notOk(headers.has("Header-1"));
    t.deepEqual(headers.getAll("Content-Type"), ["multipart/form-data"]);
  }
);

test(
  "delete() removes a header",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let headers = new Headers();
    headers.append("Header-1", "Value-1");
    t.ok(headers.has("Header-1"));
    headers.delete("Header-1");
    t.notOk(headers.has("Value-1"));
  }
);

test(
  "delete() throws if guard is immutable",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let headers = new ImmutableHeaders({"Header-1": "Value-1"});
    t.ok(headers.has("Header-1"));
    t.throws(() => { headers.delete("Header-1"); }, TypeError);
  }
);

test(
  "delete() fails if guard is request and name is a forbidden header",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new RequestHeaders({"Accept-Charset": "Value-1"});
    headers.delete("Accept-Charset");
    t.ok(headers.has("Accept-Charset"));
  }
);

test(
  "delete() fails if guard is request-no-cors and name is not a simple header",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new RequestNoCorsHeaders({"Header-1": "Value-1"});
    headers.delete("Header-1");
    t.ok(headers.has("Header-1"));
  }
);

test(
  "delete() succeeds if guard is request-no-cors and name is a simple header",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new RequestNoCorsHeaders({"Accept": "Value-1"});
    headers.delete("Accept");
    t.notOk(headers.has("Header-1"));
  }
);

test(
  "delete() fails if guard is response and name is a forbidden response header",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new ResponseHeaders({"Set-Cookie": "Value-1"});
    t.ok(headers.has("Set-Cookie"));
  }
);

test(
  "get() returns a single header matching name",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new Headers();
    headers.append("Header-1", "Value-1");
    headers.append("Header-2", "Value-2");
    t.equal(headers.get("Header-2"), "Value-2");
  }
);

test(
  "getAll() returns list of values matching names",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new Headers();
    headers.append("Header-1", "Value-1");
    headers.append("Header-2", "Value-2");
    headers.append("Header-2", "Value-3");
    t.deepEqual(headers.getAll("Header-2"), ["Value-2", "Value-3"]);
  }
);

test(
  "has() returns true if the header exists",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new Headers();
    headers.append("Header-1", "Value-1");
    t.ok(headers.has("Header-1"));
  }
);

test(
  "has() returns false if the header does not exist",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new Headers();
    headers.append("Header-1", "Value-1");
    t.notOk(headers.has("Header-2"));
  }
);

test(
  "set() overrides an existing header",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let headers = new Headers();
    headers.append("Header-1", "Value-1");
    t.deepEqual(headers.getAll("Header-1"), ["Value-1"]);
    headers.set("Header-1", "Value-2");
    t.deepEqual(headers.getAll("Header-1"), ["Value-2"]);
  }
);

test(
  "set() removes additional duplicate headers",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let headers = new Headers();
    headers.append("Header-1", "Value-1");
    headers.append("Header-1", "Value-2");
    t.deepEqual(headers.getAll("Header-1"), ["Value-1", "Value-2"]);
    headers.set("Header-1", "Value-2");
    t.deepEqual(headers.getAll("Header-1"), ["Value-2"]);
  }
);

test(
  "set() appends a header if there is none to set",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new Headers();
    headers.set("Header-1", "Value-1");
    t.deepEqual(headers.getAll("Header-1"), ["Value-1"]);
  }
);

test(
  "set() throws if guard is immutable",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let headers = new ImmutableHeaders();
    t.throws(() => { headers.set("Header-2", "Value-2"); }, TypeError);
  }
);

test(
  "getHeaders() returns something useful for now",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let h = {
      "header-1": "value-1",
      "header-2": "value-2",
    };
    let headers = new Headers(h);
    t.deepEqual(headers.getHeaders(), h);
  }
);
