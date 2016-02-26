/// <reference path="../.d.test.ts" />
"use strict";
import test = require("tape");
import Request from "./index";

test(
  "Request is requireable",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.ok(Request);
  }
);

test(
  "mixes in Body class",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let request = new Request("brain.gif");
    t.ok(request.text);
    t.ok(request.json);
  }
);

test(
  "Can create new Request with url string",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let request = new Request("brain.gif");
    t.equal(request.url, "brain.gif");
  }
);

test(
  "Correctly sets default properties",
  (t: TapeTestAssertions) => {
    t.plan(8);
    let request = new Request("brain.gif");
    t.equal(request.url, "brain.gif");
    t.equal(request.method, "GET");
    t.equal(request.mode, "no-cors");
    t.equal(request.cache, "default");
    let newRequest = new Request(request);
    t.equal(newRequest.url, "brain.gif");
    t.equal(newRequest.method, "GET");
    t.equal(newRequest.mode, "no-cors");
    t.equal(newRequest.cache, "default");
  }
);

test(
  "Can create new Request from Request",
  (t: TapeTestAssertions) => {
    t.plan(7);
    let request = new Request("mine.json", {
      method: "put",
      headers: {"A-Header": "A-Value"},
      mode: "cors",
      credentials: "omit",
      cache: "default",
      body: "The body"
    });
    let newRequest = new Request(request);
    t.equal(newRequest.url, "mine.json");
    t.equal(newRequest.method, "PUT");
    t.deepEqual(newRequest.headers.getAll("A-Header"), ["A-Value"]);
    t.equal(newRequest.mode, "cors");
    t.equal(newRequest.credentials, "omit");
    t.equal(newRequest.cache, "default");
    return newRequest.text().then((v) => {
      t.equal(v, "The body");
    });
  }
);

test(
  "Can create new Request with url string and full init",
  (t: TapeTestAssertions) => {
    t.plan(7);
    let request = new Request("mine.json", {
      method: "put",
      headers: {"A-Header": "A-Value"},
      mode:  "cors",
      credentials: "omit",
      cache: "default",
      body: "This is the body"
    });
    t.equal(request.url, "mine.json");
    t.equal(request.method, "PUT");
    t.deepEqual(request.headers.getAll("A-Header"), ["A-Value"]);
    t.equal(request.mode, "cors");
    t.equal(request.credentials, "omit");
    t.equal(request.cache, "default");
    return request.text().then((v) => {
      t.equal(v, "This is the body");
    });
  }
);

test(
  "Can create new Request with Request and full init",
  (t: TapeTestAssertions) => {
    t.plan(7);
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
    t.equal(newRequest.url, "mine.json");
    t.equal(newRequest.method, "PUT");
    t.deepEqual(newRequest.headers.getAll("A-Header"), ["A-Value"]);
    t.equal(newRequest.mode, "cors");
    t.equal(newRequest.credentials, "omit");
    t.equal(newRequest.cache, "default");
    return newRequest.text().then((v) => {
      t.equal(v, "This is the body");
    });
  }
);

test(
  "Can create new Request with Request and some init",
  (t: TapeTestAssertions) => {
    t.plan(7);
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
    t.equal(newRequest.url, "mine.json");
    t.equal(newRequest.method, "DELETE");
    t.deepEqual(newRequest.headers.getAll("A-Header"), ["A-Value"]);
    t.equal(newRequest.mode, "cors");
    t.equal(newRequest.credentials, "omit");
    t.equal(newRequest.cache, "default");
    return newRequest.text().then((v) => {
      t.equal(v, "This is the body");
    });
  }
);

// TODO: this messes up tests and assertions. What to do?
// test(
//   "Should set original Request bodyUsed to true",
//   (t: TapeTestAssertions) => {
//     let request = new Request("brain.gif");
//     t.false(request.bodyUsed);
//     /* tslint:disable:no-unused-expression */
//     new Request(request);
//     t.true(request.bodyUsed);
//   }
// );

test(
  "Throws if creating a GET/HEAD with a body",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.throws(
      () => {
        /* tslint:disable:no-unused-expression */
        new Request("mine.json", {body: "something"});
      },
      TypeError
    );
  }
);

test(
  "Can clone an existing Request",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let request = new Request("mine.json");
    let newRequest = request.clone();
    t.equal(request.url, newRequest.url);
    t.notEqual(request, newRequest);
  }
);
