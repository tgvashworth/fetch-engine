/// <reference path="../.d.test.ts" />
"use strict";
import test = require("tape");

import fetchBrowser from "./fetch-browser";
import wrap from "../utils/wrapPromiseTest";
import Request from "../Request";

test("fetch-browser is requirable", t => {
  t.plan(1);
  t.ok(fetchBrowser);
});

test("fetch-browser can make a request to the test server", wrap(t => {
  t.plan(2);
  const req = new Request(
    `/echo/text/${encodeURIComponent("Hello fetch-browser")}`
  );
  return fetchBrowser(req)
    .then(res => {
      t.ok(res);
      return res.text();
    })
    .then(text => {
      t.equal(text, "Hello fetch-browser");
    });
}));

test("fetch-browser can set headers", wrap(t => {
  t.plan(1);
  const req = new Request(
    "/echo/header/x-example",
    { headers: { "X-Example": "example" } }
  );
  return fetchBrowser(req)
    .then(res => res.text())
    .then(text => {
      t.equal(text, "example");
    });
}));

test("fetch-browser can POST a string body", wrap(t => {
  t.plan(1);
  const req = new Request(
    "/echo/body",
    {
      method: "POST",
      body: "example"
    }
  );
  return fetchBrowser(req)
    .then(res => res.text())
    .then(text => {
      t.equal(text, "example");
    });
}));

test("fetch-browser can POST a JSON body", wrap(t => {
  t.plan(1);
  const body = JSON.stringify({ a: 10 });
  const req = new Request(
    `/echo/body`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body
    }
  );
  return fetchBrowser(req)
    .then(res => res.text())
    .then(text => {
      t.equal(text, body);
    });
}));

test("fetch-browser can parse a JSON response", wrap(t => {
  t.plan(1);
  const body = { a: 10 };
  const req = new Request(
    `/echo/body`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    }
  );
  return fetchBrowser(req)
    .then(res => res.json())
    .then(data => {
      t.deepEqual(data, body);
    });
}));

test("fetch-browser can send cookies to same-origin", wrap(t => {
  t.plan(1);
  document.cookie = `example-cookie=example`;
  const req = new Request("/echo/cookie/example-cookie");
  return fetchBrowser(req)
    .then(res => res.text())
    .then(text => {
      t.equal(text, "example");
    });
}));

test("fetch-browser handles an error", wrap(t => {
  t.plan(1);
  const req = new Request("/error/500");
  return fetchBrowser(req)
    .then(res => {
      t.equal(res.status, 500);
    });
}));

// Tests matching github/fetch

test("fetch request", wrap(t => {
  t.plan(2);
  const req = new Request("/echo", {
    headers: {
      "Accept": "application/json",
      "X-Test": "42"
    }
  });

  return fetchBrowser(req)
    .then(res => res.json())
    .then(json => {
      t.equal(json.headers.accept, "application/json");
      t.equal(json.headers["x-test"], "42");
    });
}));

test("populates response", wrap(t => {
  t.plan(4);
  const req = new Request("/echo/text/hello");

  return fetchBrowser(req)
    .then(res => {
      t.equal(res.status, 200);
      t.equal(res.ok, true);
      t.equal(res.headers.get("Content-Type"), "text/html; charset=utf-8");
      return res.text();
    })
    .then(text => {
      t.equal(text, "hello");
    });
}));
