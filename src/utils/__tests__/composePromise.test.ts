import composePromise from "../composePromise";

it(
  "composePromise is requireable",
  () => {
    expect.assertions(1);
    expect(composePromise).toBeTruthy();
  },
);

it(
  "it composes identity functions to produce passed value",
  () => {
    expect.assertions(1);
    const promiseId = (x) => Promise.resolve(x);
    const f = composePromise([promiseId, promiseId]);
    return f(true)
      .then((v) => {
        expect(v).toEqual(true);
      });
  },
);

it(
  "it composes increment functions to produce passed value",
  () => {
    expect.assertions(1);
    const promiseInc = (x) => Promise.resolve(x + 1);
    const f = composePromise([promiseInc, promiseInc]);
    return f(0)
      .then((v) => {
        expect(v).toEqual(2);
      });
  },
);

it(
  "it produces correct value when there are no fns",
  () => {
    expect.assertions(1);
    const f = composePromise([]);
    return f(true)
      .then((v) => {
        expect(v).toEqual(true);
      });
  },
);

it(
  "it supports passing through other arguments",
  () => {
    expect.assertions(1);
    const returNthArg = (n) => (...args) => Promise.resolve(args[n]);
    const f = composePromise([returNthArg(1), returNthArg(2)]);
    return f(1, 2, 3)
      .then((v) => {
        expect(v).toEqual(3);
      });
  },
);
