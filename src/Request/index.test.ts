/// <reference path="./../.d.test.ts" />
"use strict";
import test = require("ava");
import Request from "./index";

test(
  "Request is requireable",
  (t: TestAssertions) => {
    t.ok(Request);
    t.end();
  }
);

test(
  "mixes in Body class",
  (t: TestAssertions) => {
    let request = new Request("brain.gif");
    t.ok(request.text);
    t.ok(request.json);
    t.end();
  }
);

test(
  "Can create new Request with url string",
  (t: TestAssertions) => {
    let request = new Request("brain.gif");
    t.same(request.url, "brain.gif");
    t.end();
  }
);

test(
  "Correctly sets default properties",
  (t: TestAssertions) => {
    let request = new Request("brain.gif");
    t.same(request.url, "brain.gif");
    t.same(request.method, "GET");
    t.same(request.mode, "no-cors");
    t.same(request.cache, "default");
    let newRequest = new Request(request);
    t.same(newRequest.url, "brain.gif");
    t.same(newRequest.method, "GET");
    t.same(newRequest.mode, "no-cors");
    t.same(newRequest.cache, "default");
    t.end();
  }
);

test(
  "Can create new Request from Request",
  (t: TestAssertions) => {
    let request = new Request("mine.json", {
      method: "put",
      headers: {"A-Header": "A-Value"},
      mode: "cors",
      credentials: "omit",
      cache: "default",
      body: "The body"
    });
    let newRequest = new Request(request);
    t.same(newRequest.url, "mine.json");
    t.same(newRequest.method, "PUT");
    t.same(newRequest.headers.getAll("A-Header"), ["A-Value"]);
    t.same(newRequest.mode, "cors");
    t.same(newRequest.credentials, "omit");
    t.same(newRequest.cache, "default");
    return newRequest.text().then((v) => {
      t.same(v, "The body");
    });
  }
);

test(
  "Can create new Request with url string and full init",
  (t: TestAssertions) => {
    let request = new Request("mine.json", {
      method: "put",
      headers: {"A-Header": "A-Value"},
      mode:  "cors",
      credentials: "omit",
      cache: "default",
      body: "This is the body"
    });
    t.same(request.url, "mine.json");
    t.same(request.method, "PUT");
    t.same(request.headers.getAll("A-Header"), ["A-Value"]);
    t.same(request.mode, "cors");
    t.same(request.credentials, "omit");
    t.same(request.cache, "default");
    return request.text().then((v) => {
      t.same(v, "This is the body");
    });
  }
);

test(
  "Can create new Request with Request and full init",
  (t: TestAssertions) => {
    let request = new Request("mine.json", {
      method: "delete"
    });
    let newRequest = new Request(request, {
      method: "put",
      headers: {"A-Header": "A-Value"},
      mode:  "cors",
      credentials: "omit",
      cache: "default",
      body: "This is the body"
    });
    t.same(newRequest.url, "mine.json");
    t.same(newRequest.method, "PUT");
    t.same(newRequest.headers.getAll("A-Header"), ["A-Value"]);
    t.same(newRequest.mode, "cors");
    t.same(newRequest.credentials, "omit");
    t.same(newRequest.cache, "default");
    return newRequest.text().then((v) => {
      t.same(v, "This is the body");
    });
  }
);

test(
  "Can create new Request with Request and some init",
  (t: TestAssertions) => {
    let request = new Request("mine.json", {
      method: "delete",
      credentials: "omit",
    });
    let newRequest = new Request(request, {
      headers: {"A-Header": "A-Value"},
      mode:  "cors",
      cache: "default",
      body: "This is the body"
    });
    t.same(newRequest.url, "mine.json");
    t.same(newRequest.method, "DELETE");
    t.same(newRequest.headers.getAll("A-Header"), ["A-Value"]);
    t.same(newRequest.mode, "cors");
    t.same(newRequest.credentials, "omit");
    t.same(newRequest.cache, "default");
    return newRequest.text().then((v) => {
      t.same(v, "This is the body");
    });
  }
);

test(
  "Should set original Request bodyUsed to true",
  (t: TestAssertions) => {
    let request = new Request("brain.gif");
    t.false(request.bodyUsed);
    /* tslint:disable:no-unused-expression */
    new Request(request);
    t.true(request.bodyUsed);
    t.end();
  }
);

test(
  "Throws if creating a GET/HEAD with a body",
  (t: TestAssertions) => {
    t.throws(
      () => {
        new Request("mine.json", {body: "something"});
      },
      TypeError
    );
    t.end();
  }
);

test(
  "Can clone an existing Request",
  (t: TestAssertions) => {
    let request = new Request("mine.json");
    let newRequest = request.clone();
    t.same(request.url, newRequest.url);
    t.not(request, newRequest);
    t.end();
  }
);
