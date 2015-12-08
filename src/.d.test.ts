/// <reference path="../typings/node/node.d.ts" />

declare interface TestAssertions {
  end: () => void;
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
  function test(f: Test): void;
  function test(message: string, f: Test): void;
  export = test;
}

declare module "deeper" {
  function deepEqual<T>(a: T, b: T): boolean;
  export = deepEqual;
}

// Partial definition.

declare interface Property {
}

declare module "jsverify" {
  function forall(arbs: String, assertion: (input: any) => void): Property;
  function assert(prop: Property): void;
}
