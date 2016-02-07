/// <reference path="../.d.test.ts" />
"use strict";
import test = require("ava");
import Response from "./index";
import { ResponseHeaders } from "../Headers";

test(
  "Response is requireable",
  (t: TestAssertions) => {
    t.ok(Response);
  }
);

test(
  "mixes in Body class",
  (t: TestAssertions) => {
    let response = new Response("string");
    t.ok(response.json);
    return response.text().then((v) => {
      t.same(v, "string");
    });
  }
);

test(
  "type always defaults to 'default'",
  (t: TestAssertions) => {
    let response = new Response("string");
    t.same(response.type, "default");
  }
);

test(
  "status is ok if code between 200 and 299",
  (t: TestAssertions) => {
    let response = new Response("string", {
      status: 200
    });
    t.true(response.ok);
    response = new Response("string", {
      status: 299
    });
    t.true(response.ok);
  }
);

test(
  "status is not ok if code 300",
  (t: TestAssertions) => {
    let response = new Response("string", {
      status: 300
    });
    t.false(response.ok);
  }
);

test(
  "init params are set correctly",
  (t: TestAssertions) => {
    let response = new Response("string", {
      status: 201,
      statusText: "statusText",
      headers: new ResponseHeaders({ "X-Header": "Value"}),
      url: "url"
    });
    t.same(response.status, 201);
    t.same(response.statusText, "statusText");
    t.same(response.headers.getAll("X-Header"), ["Value"]);
    t.same(response.url, "url");
  }
);

test(
  "defaults are set correctly",
  (t: TestAssertions) => {
    let response = new Response();
    t.same(response.type, "default");
    t.same(response.status, 200);
    t.same(response.statusText, "ok");
    t.same(response.url, "");
    t.same(response.ok, true);
  }
);

test(
  "Can clone an existing Response",
  (t: TestAssertions) => {
    let response = new Response("theBody");
    let newResponse = response.clone();
    t.same(response.rawBody, newResponse.rawBody);
    t.not(response, newResponse);
  }
);

test(
  "clone() throws if body has been previously read",
  (t: TestAssertions) => {
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
  "Can redirect an existing Response",
  (t: TestAssertions) => {
    let response = new Response("theBody");
    let newResponse = response.redirect("newUrl", 301);
    t.same(newResponse.status, 301);
    t.same(newResponse.headers.getAll("location"), ["newUrl"]);
  }
);

test(
  "redirect() throws if status code is not valid redirect code",
  (t: TestAssertions) => {
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
  (t: TestAssertions) => {
    let response = new Response("theBody");
    let newResponse = response.error();
    t.same(newResponse.type, "error");
  }
);
