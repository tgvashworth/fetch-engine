// tslint:disable:no-var-requires
import "whatwg-fetch";
import { ORIGIN, SAME_ORIGIN } from "../../integration-tests/jest";
import fetchBrowser from "../fetch-browser";

it(
  "fetch-browser is requirable",
  () => {
    expect.assertions(1);
    expect(fetchBrowser).toBeTruthy();
  },
);

it(
  "fetch-browser can make a request to the test server",
  () => {
    expect.assertions(2);
    const req = new Request(
      `${ORIGIN}/echo/text/${encodeURIComponent("Hello fetch-browser")}`,
    );
    return fetchBrowser(req)
      .then((res) => {
        expect(res).toBeTruthy();
        return res.text();
      })
      .then((text) => {
        expect(text).toEqual("Hello fetch-browser");
      });
  },
);

it(
  "fetch-browser can set headers",
  () => {
    expect.assertions(1);
    const req = new Request(
      `${ORIGIN}/echo/header/x-example`,
      { headers: { "X-Example": "example" } },
    );
    return fetchBrowser(req)
      .then((res) => res.text())
      .then((text) => {
        expect(text).toEqual("example");
      });
  },
);

it(
  "fetch-browser can POST a string body",
  () => {
    expect.assertions(1);
    const req = new Request(
      `${ORIGIN}/echo/body`,
      {
        body: "example",
        headers: {
          "Content-Type": "text/html",
        },
        method: "POST",
      },
    );
    return fetchBrowser(req)
      .then((res) => res.text())
      .then((text) => {
        expect(text).toEqual("example");
      });
  },
);

it(
  "fetch-browser can POST a JSON body",
  () => {
    expect.assertions(1);
    const body = JSON.stringify({ a: 10 });
    const req = new Request(
      `${ORIGIN}/echo/body`,
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
        expect(text).toEqual(body);
      });
  },
);

it(
  "fetch-browser can parse a JSON response",
  () => {
    expect.assertions(1);
    const body = { a: 10 };
    const req = new Request(
      `${ORIGIN}/echo/body`,
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
        expect(data).toEqual(body);
      });
  },
);

it(
  "fetch-browser can send cookies to same-origin",
  () => {
    expect.assertions(1);
    document.cookie = `example-cookie=;`;
    document.cookie = `example-cookie=example`;
    const req = new Request(`${SAME_ORIGIN}/echo/cookie/example-cookie`, {
      credentials: "same-origin",
    });
    return fetchBrowser(req)
      .then((res) => res.text())
      .then((text) => {
        expect(text).toEqual("example");
      });
  },
);

it(
  "fetch-browser handles an error",
  () => {
    expect.assertions(2);
    const req = new Request(`${ORIGIN}/error/500`);
    return fetchBrowser(req)
      .then((res) => {
        expect(res.status).toEqual(500);
        expect(res.ok).toEqual(false);
      });
  },
);

// Tests matching github/fetch

it(
  "fetch request",
  () => {
    expect.assertions(2);
    const req = new Request(`${ORIGIN}/echo`, {
      headers: {
        "Accept": "application/json",
        "X-Test": "42",
      },
    });

    return fetchBrowser(req)
      .then((res) => res.json())
      .then((json) => {
        expect(json.headers.accept).toEqual("application/json");
        expect(json.headers["x-test"]).toEqual("42");
      });
  },
);

it(
  "populates response",
  () => {
    expect.assertions(4);
    const req = new Request(`${ORIGIN}/echo/text/hello`);

    return fetchBrowser(req)
      .then((res) => {
        expect(res.status).toEqual(200);
        expect(res.ok).toEqual(true);
        expect(res.headers.get("Content-Type")).toEqual("text/html; charset=utf-8");
        return res.text();
      })
      .then((text) => {
        expect(text).toEqual("hello");
      });
  },
);

it(
  "supports POST",
  () => {
    expect.assertions(2);
    const req = new Request(`${ORIGIN}/echo`, {
      body: "a=10",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "post",
    });

    return fetchBrowser(req)
      .then((res) => res.json())
      .then((json) => {
        expect(json.method).toEqual("post");
        expect(json.payload).toEqual({ a: "10" });
      });
  },
);

it(
  "supports PUT",
  () => {
    expect.assertions(2);
    const req = new Request(`${ORIGIN}/echo`, {
      body: "a=10",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      method: "put",
    });

    return fetchBrowser(req)
      .then((res) => res.json())
      .then((json) => {
        expect(json.method).toEqual("put");
        expect(json.payload).toEqual({ a: "10" });
      });
  },
);

it(
  "supports DELETE",
  () => {
    expect.assertions(2);
    const req = new Request(`${ORIGIN}/echo`, {
      method: "delete",
    });

    return fetchBrowser(req)
      .then((res) => res.json())
      .then((json) => {
        expect(json.method).toEqual("delete");
        expect(json.payload).toEqual(null);
      });
  },
);
