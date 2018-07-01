// tslint:disable:no-var-requires
import "whatwg-fetch";
import makeFetchEngine from "../../fetchEngine";
import FetchGroup from "../../FetchGroup";
import RetryPlugin from "../RetryPlugin";

function returnValues(vs: any[]) {
  let calls = 0;
  return () => {
    if (calls >= vs.length) {
      throw new Error(`returnValues ran out of values to call after ${calls} calls`);
    }

    const v = vs[calls];
    calls = calls + 1;
    return v;
  };
}

it(
  "requireable",
  () => {
    expect.assertions(1);
    expect(RetryPlugin).toBeTruthy();
  },
);

it(
  "use in engine",
  () => {
    expect.assertions(1);
    const mockReq = new Request("/");
    const mock503 = new Response(null, {
      status: 503,
    });
    const mock200 = new Response("ok");
    const fetch = makeFetchEngine(returnValues([mock503, mock200]))({
      plugins: [
        new RetryPlugin(),
      ],
    });
    return fetch(mockReq).then((res) => {
      expect(res).toEqual(mock200);
    });
  },
);
