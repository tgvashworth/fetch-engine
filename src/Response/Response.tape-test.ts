/// <reference path="../.d.test.ts" />
"use strict";
import test = require("tape");
import Response from "./index";
import { ResponseHeaders } from "../Headers";

test(
  "Response is requireable",
  (t: TapeTestAssertions) => {
    t.plan(1);
    t.ok(Response);
  }
);

test(
  "mixes in Body class",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let response = new Response("string");
    t.ok(response.json);
    return response.text().then((v) => {
      t.equal(v, "string");
    });
  }
);

test(
  "type always defaults to 'default'",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let response = new Response("string");
    t.equal(response.type, "default");
  }
);

test(
  "status is ok if code between 200 and 299",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let response = new Response("string", {
      status: 200
    });
    t.ok(response.ok);
    response = new Response("string", {
      status: 299
    });
    t.ok(response.ok);
  }
);

test(
  "status is not ok if code 300",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let response = new Response("string", {
      status: 300
    });
    t.notOk(response.ok);
  }
);

test(
  "init params are set correctly",
  (t: TapeTestAssertions) => {
    t.plan(4);
    let response = new Response("string", {
      status: 201,
      statusText: "statusText",
      headers: new ResponseHeaders({ "X-Header": "Value"}),
      url: "url"
    });
    t.equal(response.status, 201);
    t.equal(response.statusText, "statusText");
    t.deepEqual(response.headers.getAll("X-Header"), ["Value"]);
    t.equal(response.url, "url");
  }
);

test(
  "defaults are set correctly",
  (t: TapeTestAssertions) => {
    t.plan(5);
    let response = new Response();
    t.equal(response.type, "default");
    t.equal(response.status, 200);
    t.equal(response.statusText, "ok");
    t.equal(response.url, "");
    t.equal(response.ok, true);
  }
);

test(
  "Can clone an existing Response",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let response = new Response("theBody");
    let newResponse = response.clone();
    t.equal(response.rawBody, newResponse.rawBody);
    t.notEqual(response, newResponse);
  }
);

test(
  "clone() throws if body has been previously read",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let request = new Response("theBody");
    return request.text().then((v) => {
      t.throws(
        () => {
          request.clone();
        },
        TypeError
      );
    });
  }
);

test(
  "can redirect an existing Response",
  (t: TapeTestAssertions) => {
    t.plan(2);
    let response = new Response("theBody");
    let newResponse = response.redirect("newUrl", 301);
    t.equal(newResponse.status, 301);
    t.deepEqual(newResponse.headers.getAll("location"), ["newUrl"]);
  }
);

test(
  "redirect() throws if status code is not valid redirect code",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let request = new Response("theBody");
    t.throws(
      () => {
        request.redirect("newUrl", 500);
      },
      RangeError
    );
  }
);

test(
  "Can create error on existing Response",
  (t: TapeTestAssertions) => {
    t.plan(1);
    let response = new Response("theBody");
    let newResponse = response.error();
    t.equal(newResponse.type, "error");
  }
);
