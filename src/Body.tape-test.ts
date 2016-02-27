/// <reference path="./.d.test.ts" />
"use strict";
import test = require("tape");
import Body from "./Body";

test(
  "Body is requireable",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.ok(Body);
  }
);

test(
  "Body takes and returns text string",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let body = new Body("hello");
    return body.text().then((v) => {
      t.equal(v, "hello");
    });
  }
);

test(
  "Body takes and returns json",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let body = new Body("{\"Europe\": \"big\", \"Asia\": \"massive\"}");
    return body.json().then((v) => {
      t.equal(v.Europe, "big");
    });
  }
);

test(
  "Body defaults to null",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let body = new Body();
    return t.equal(body.rawBody, null);
  }
);
