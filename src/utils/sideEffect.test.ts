import * as test from "tape";
import sideEffect from "./sideEffect";

test("sideEffect is requireable", (t) => {
  t.plan(1);
  t.ok(sideEffect);
});

test(
  "it returns passed in value",
  (t) => {
    t.plan(2);
    const id = (x) => x;
    const f = sideEffect(id);
    t.equal(f(true), true);
    t.equal(f(false), false);
  },
);

test(
  "calls supplied function",
  (t) => {
    t.plan(1);
    const inner = (x) => {
      t.equal(x, true);
      return false;
    };
    sideEffect(inner)(true);
  },
);

test(
  "passes many arguments to supplied function",
  (t) => {
    t.plan(2);
    const inner = (x, y) => {
      t.equal(x, true);
      t.equal(y, false);
    };
    sideEffect(inner)(true, false);
  },
);

test(
  "ignored function's return value",
  (t) => {
    t.plan(1);
    const result = sideEffect((_) => false)(true);
    t.equal(result, true);
  },
);
