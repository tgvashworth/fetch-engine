// tslint:disable:no-var-requires
require("isomorphic-fetch");
import * as test from "tape";
import fetchEngine from "./fetch-engine-browser";
import wrap from "./utils/wrapPromiseTest";

test("browser fetchEngine is requireable", (t) => {
  t.plan(1);
  t.ok(fetchEngine);
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
