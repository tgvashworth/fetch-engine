// tslint:disable:no-var-requires
require("isomorphic-fetch");
import test = require("tape");
import wrap from "../utils/wrapPromiseTest";
import fetchBrowser from "./fetch-browser";

test("fetch-browser is requirable", (t) => {
  t.plan(1);
  t.ok(fetchBrowser);
});

test("fetch-browser can make a request to the test server", wrap((t) => {
  t.plan(2);
  const req = new Request(
    `/echo/text/${encodeURIComponent("Hello fetch-browser")}`,
  );
  return fetchBrowser(req)
    .then((res) => {
      t.ok(res);
      return res.text();
    })
    .then((text) => {
      t.equal(text, "Hello fetch-browser");
    });
}));

test("fetch-browser can set headers", wrap((t) => {
  t.plan(1);
  const req = new Request(
    "/echo/header/x-example",
    { headers: { "X-Example": "example" } },
  );
  return fetchBrowser(req)
    .then((res) => res.text())
    .then((text) => {
      t.equal(text, "example");
    });
}));

test("fetch-browser can POST a string body", wrap((t) => {
  t.plan(1);
  const req = new Request(
    "/echo/body",
    {
      body: "example",
      method: "POST",
    },
  );
  return fetchBrowser(req)
    .then((res) => res.text())
    .then((text) => {
      t.equal(text, "example");
    });
}));

test("fetch-browser can POST a JSON body", wrap((t) => {
  t.plan(1);
  const body = JSON.stringify({ a: 10 });
  const req = new Request(
    `/echo/body`,
    {
      body,
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );
  return fetchBrowser(req)
    .then((res) => res.text())
    .then((text) => {
      t.equal(text, body);
    });
}));

test("fetch-browser can parse a JSON response", wrap((t) => {
  t.plan(1);
  const body = { a: 10 };
  const req = new Request(
    `/echo/body`,
    {
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
    },
  );
  return fetchBrowser(req)
    .then((res) => res.json())
    .then((data) => {
      t.deepEqual(data, body);
    });
}));

test("fetch-browser can send cookies to same-origin", wrap((t) => {
  t.plan(1);
  document.cookie = `example-cookie=;`;
  document.cookie = `example-cookie=example`;
  const req = new Request("/echo/cookie/example-cookie", {
    credentials: "same-origin",
  });
  return fetchBrowser(req)
    .then((res) => res.text())
    .then((text) => {
      t.equal(text, "example");
    });
}));

test("fetch-browser handles an error", wrap((t) => {
  t.plan(2);
  const req = new Request("/error/500");
  return fetchBrowser(req)
    .then((res) => {
      t.equal(res.status, 500);
      t.equal(res.ok, false);
    });
}));

// Tests matching github/fetch

test("fetch request", wrap((t) => {
  t.plan(2);
  const req = new Request("/echo", {
    headers: {
      "Accept": "application/json",
      "X-Test": "42",
    },
  });

  return fetchBrowser(req)
    .then((res) => res.json())
    .then((json) => {
      t.equal(json.headers.accept, "application/json");
      t.equal(json.headers["x-test"], "42");
    });
}));

test("populates response", wrap((t) => {
  t.plan(4);
  const req = new Request("/echo/text/hello");

  return fetchBrowser(req)
    .then((res) => {
      t.equal(res.status, 200);
      t.equal(res.ok, true);
      t.equal(res.headers.get("Content-Type"), "text/html; charset=utf-8");
      return res.text();
    })
    .then((text) => {
      t.equal(text, "hello");
    });
}));

test("supports POST", wrap((t) => {
  t.plan(2);
  const req = new Request("/echo", {
    body: "a=10",
    method: "post",
  });

  return fetchBrowser(req)
    .then((res) => res.json())
    .then((json) => {
      t.equal(json.method, "post");
      t.equal(json.payload, "a=10");
    });
}));

test("supports PUT", wrap((t) => {
  t.plan(2);
  const req = new Request("/echo", {
    body: "a=10",
    method: "put",
  });

  return fetchBrowser(req)
    .then((res) => res.json())
    .then((json) => {
      t.equal(json.method, "put");
      t.equal(json.payload, "a=10");
    });
}));

test("supports DELETE", wrap((t) => {
  t.plan(2);
  const req = new Request("/echo", {
    method: "delete",
  });

  return fetchBrowser(req)
    .then((res) => res.json())
    .then((json) => {
      t.equal(json.method, "delete");
      t.equal(json.payload, null);
    });
}));
