// tslint:disable:no-var-requires
import "whatwg-fetch";
import fetchEngine, { FetchGroup, makeFetchGroup } from "../fetch-engine-browser";
import { ORIGIN } from "../integration-tests/jest";

it(
  "browser fetchEngine is requireable",
  () => {
    expect.assertions(1);
    expect(fetchEngine).toBeTruthy();
  },
);

it(
  "browser fetchEngine exports FetchGroup",
  () => {
    expect.assertions(1);
    expect(FetchGroup).toBeTruthy();
  },
);

it(
  "browser fetchEngine exports makeFetchGroup",
  () => {
    expect.assertions(1);
    expect(makeFetchGroup).toBeTruthy();
  },
);

it(
  "browser fetchEngine can make a request to the test server",
  () => {
    expect.assertions(2);
    const req = new Request(
      `${ORIGIN}/echo/text/${encodeURIComponent("Hello fetch-browser")}`,
    );
    const fetch = fetchEngine();
    return fetch(req)
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
  "browser fetchEngine can be used with FetchGroups",
  () => {
    expect.assertions(7);
    const request = new Request(
      `${ORIGIN}/echo/text/${encodeURIComponent("Hello fetch-browser")}`,
    );
    const group = new FetchGroup({
      filters: [
        {
          testRequest(req) {
            // Note: this is run multiple times for each relevant phase of the request
            expect(req).toEqual(request);
            return true;
          },
        },
      ],
      plugins: [
        {
          shouldFetch(req) {
            expect(req).toEqual(request);
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
        expect(res).toBeTruthy();
        return res.text();
      })
      .then((text) => {
        expect(text).toEqual("Hello fetch-browser");
      });
  },
);

it(
  "browser fetchEngine can be used with stateful FetchGroups",
  () => {
    expect.assertions(7);
    const request = new Request(
      `${ORIGIN}/echo/text/${encodeURIComponent("Hello fetch-browser")}`,
    );
    const Group = makeFetchGroup(() => ({
      filters: [
        {
          testRequest(req) {
            // Note: this is run multiple times for each relevant phase of the request
            expect(req).toEqual(request);
            return true;
          },
        },
      ],
      plugins: [
        {
          shouldFetch(req) {
            expect(req).toEqual(request);
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
        expect(res).toBeTruthy();
        return res.text();
      })
      .then((text) => {
        expect(text).toEqual("Hello fetch-browser");
      });
  },
);
