/// <reference path="./.d.test.ts" />
"use strict";
import test = require("ava");
import Body from "./Body";

test(
  "Body is requireable",
  (t: TestAssertions) => {
    t.ok(Body);
  }
);

test(
  "Body takes and returns text string",
  (t: TestAssertions) => {
    let body = new Body("hello");
    return body.text().then((v) => {
      t.same(v, "hello");
    });
  }
);

test(
  "Body takes and returns json",
  (t: TestAssertions) => {
    let body = new Body("{\"Europe\": \"big\", \"Asia\": \"massive\"}");
    return body.json().then((v) => {
      t.same(v.Europe, "big");
    });
  }
);

test(
  "Body defaults to null",
  (t: TestAssertions) => {
    let body = new Body();
    return t.same(body.rawBody, null);
  }
);
