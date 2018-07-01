import composeContinuation from "../composeContinuation";

it(
  "composeContinuation is requireable",
  () => {
    expect.assertions(1);
    expect(composeContinuation).toBeTruthy();
  },
);

it(
  "it composes no-op functions to produce passed value",
  () => {
    expect.assertions(2);
    const id = (x) => x;
    const noop = (_, next) => next();
    const f = composeContinuation([noop, noop]);
    expect(f(true, id)).toEqual(true);
    expect(f(false, id)).toEqual(false);
  },
);

it(
  "it exits early if next is not called",
  () => {
    expect.assertions(1);
    const o = {};
    const id = (x) => x;
    const noop = (_, next) => next();
    const exit = () => o;
    const f = composeContinuation([noop, exit]);
    expect(f(true, id)).toEqual(o);
  },
);
