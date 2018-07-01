import composeVoid from "../composeVoid";

it(
  "composeVoid is requireable",
  () => {
    expect.assertions(1);
    expect(composeVoid).toBeTruthy();
  },
);

it(
  "it passes value to each function and ignores return values",
  () => {
    expect.assertions(3);
    const testVal = {};
    const testFn = (x) => {
      expect(x).toEqual(testVal);
      return {};
    };
    const f = composeVoid([testFn, testFn]);
    const result = f(testVal);
    expect(result).toEqual(undefined);
  },
);
