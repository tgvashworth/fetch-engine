import * as test from "tape";
import getBoundImplementations from "./getBoundImplementations";

test("getBoundImplementations is requireable", (t) => {
  t.plan(1);
  t.ok(getBoundImplementations);
});

test(
  "it extracts methods from objects and calls with correct context",
  (t) => {
    t.plan(5);
    const makeTestObj = (): object => {
      const self = {
        fn(v): void {
          t.ok(this);
          t.equal(v, true);
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
    t.equal(impls.length, 2);
    impls.forEach((impl) => {
      impl(true);
    });
  },
);
