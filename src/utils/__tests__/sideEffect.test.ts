import sideEffect from "../sideEffect";

it(
  "it returns passed in value",
  () => {
    expect.assertions(2);
    const id = (x) => x;
    const f = sideEffect(id);
    expect(f(true)).toEqual(true);
    expect(f(false)).toEqual(false);
  },
);

it(
  "calls supplied function",
  () => {
    expect.assertions(1);
    const inner = (x) => {
      expect(x).toEqual(true);
      return false;
    };
    sideEffect(inner)(true);
  },
);

it(
  "passes many arguments to supplied function",
  () => {
    expect.assertions(2);
    const inner = (x, y) => {
      expect(x).toEqual(true);
      expect(y).toEqual(false);
    };
    sideEffect(inner)(true, false);
  },
);

it(
  "ignored function's return value",
  () => {
    expect.assertions(1);
    const result = sideEffect((_) => false)(true);
    expect(result).toEqual(true);
  },
);
