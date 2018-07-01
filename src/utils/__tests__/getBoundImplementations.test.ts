import getBoundImplementations from "../getBoundImplementations";

it(
  "it extracts methods from objects and calls with correct context",
  () => {
    expect.assertions(5);
    const makeTestObj = (): object => {
      const self = {
        fn(v): void {
          expect(this).toBeTruthy();
          expect(v).toEqual(true);
        },
      };
      return self;
    };

    const objs: any[] = [
      makeTestObj(),
      makeTestObj(),
      {},
    ];
    const impls = getBoundImplementations("fn", objs);
    expect(impls.length).toEqual(2);
    impls.forEach((impl) => {
      impl(true);
    });
  },
);
