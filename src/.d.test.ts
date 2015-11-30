/// <reference path="../typings/node/node.d.ts" />

declare interface TestAssertions {
  pass: (message?: string) => void;
  fail: (message?: string) => void;
  ok: (value: any, message?: string) => void;
  notOk: (value: any, message?: string) => void;
  true: (value: boolean, message?: string) => void;
  false: (value: boolean, message?: string) => void;
  is: <T>(value: T, expected: T, message?: string) => void;
  same: <T>(value: T, expected: T, message?: string) => void;
  notSame: <T>(value: T, expected: T, message?: string) => void;
  throws: (value: Function | Promise<any>, error: any, message?: string) => void;
  doesNotThrow: (value: Function | Promise<any>, message?: string) => void;
  regexTest: (regex: RegExp, contents: string, message?: string) => void;
}

declare interface Test {
  (t: TestAssertions): Promise<void> | void;
}

declare module "ava" {
  function test(f: Test): void
  export = test;
}
