import * as test from "tape";
import composePromise from "./composePromise";
import wrap from "./wrapPromiseTest";

test("composePromise is requireable", (t) => {
  t.plan(1);
  t.ok(composePromise);
});

test(
  "it composes identity functions to produce passed value",
  wrap((t) => {
    t.plan(1);
    const promiseId = (x) => Promise.resolve(x);
    const f = composePromise([promiseId, promiseId]);
    return f(true)
      .then((v) => {
        t.equal(v, true);
      });
  }),
);

test(
  "it composes increment functions to produce passed value",
  wrap((t) => {
    t.plan(1);
    const promiseInc = (x) => Promise.resolve(x + 1);
    const f = composePromise([promiseInc, promiseInc]);
    return f(0)
      .then((v) => {
        t.equal(v, 2);
      });
  }),
);

test(
  "it produces correct value when there are no fns",
  wrap((t) => {
    t.plan(1);
    const f = composePromise([]);
    return f(true)
      .then((v) => {
        t.equal(v, true);
      });
  }),
);

test(
  "it supports passing through other arguments",
  wrap((t) => {
    t.plan(1);
    const returNthArg = (n) => (...args) => Promise.resolve(args[n]);
    const f = composePromise([returNthArg(1), returNthArg(2)]);
    return f(1, 2, 3)
      .then((v) => {
        t.equal(v, 3);
      });
  }),
);
