// tslint:disable:no-var-requires
require("isomorphic-fetch");
import * as test from "tape";
import fetchEngine, { FetchGroup, makeFetchGroup } from "./fetch-engine-browser";
import wrap from "./utils/wrapPromiseTest";

test("browser fetchEngine is requireable", (t) => {
  t.plan(1);
  t.ok(fetchEngine);
});

test("browser fetchEngine exports FetchGroup", (t) => {
  t.plan(1);
  t.ok(FetchGroup);
});

test("browser fetchEngine exports makeFetchGroup", (t) => {
  t.plan(1);
  t.ok(makeFetchGroup);
});

test("browser fetchEngine can make a request to the test server", wrap((t) => {
  t.plan(2);
  const req = new Request(
    `/echo/text/${encodeURIComponent("Hello fetch-browser")}`,
  );
  const fetch = fetchEngine();
  return fetch(req)
    .then((res) => {
      t.ok(res);
      return res.text();
    })
    .then((text) => {
      t.equal(text, "Hello fetch-browser");
    });
}));

test("browser fetchEngine can be used with FetchGroups", wrap((t) => {
  t.plan(7);
  const request = new Request(
    `/echo/text/${encodeURIComponent("Hello fetch-browser")}`,
  );
  const group = new FetchGroup({
    filters: [
      {
        testRequest(req) {
          // Note: this is run multiple times for each relevant phase of the request
          t.deepEqual(req, request);
          return true;
        },
      },
    ],
    plugins: [
      {
        shouldFetch(req) {
          t.deepEqual(req, request);
          return true;
        },
      },
    ],
  });
  const fetch = fetchEngine({
    plugins: [ group ],
  });
  return fetch(request)
    .then((res) => {
      t.ok(res);
      return res.text();
    })
    .then((text) => {
      t.equal(text, "Hello fetch-browser");
    });
}));

test("browser fetchEngine can be used with stateful FetchGroups", wrap((t) => {
  t.plan(7);
  const request = new Request(
    `/echo/text/${encodeURIComponent("Hello fetch-browser")}`,
  );
  const Group = makeFetchGroup(() => ({
    filters: [
      {
        testRequest(req) {
          // Note: this is run multiple times for each relevant phase of the request
          t.deepEqual(req, request);
          return true;
        },
      },
    ],
    plugins: [
      {
        shouldFetch(req) {
          t.deepEqual(req, request);
          return true;
        },
      },
    ],
  }));
  const fetch = fetchEngine({
    plugins: [ new Group() ],
  });
  return fetch(request)
    .then((res) => {
      t.ok(res);
      return res.text();
    })
    .then((text) => {
      t.equal(text, "Hello fetch-browser");
    });
}));
