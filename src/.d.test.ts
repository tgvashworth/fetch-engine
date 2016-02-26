/// <reference path="../typings/node/node.d.ts" />

declare interface TapeTestAssertions {
  plan: (n: number) => void;
  end: () => void;
  pass: (message?: string) => void;
  fail: (message?: string) => void;
  timeoutAfter: (ms: number) => void;
  ok: (value: any, message?: string) => void;
  notOk: (value: any, message?: string) => void;
  error: (err: any, message?: string) => void;
  equal: <T>(value: T, expected: T, message?: string) => void;
  notEqual: <T>(value: T, expected: T, message?: string) => void;
  deepEqual: <T>(value: T, expected: T, message?: string) => void;
  notDeepEqual: <T>(value: T, expected: T, message?: string) => void;
  deepLooseEqual: <T>(value: T, expected: T, message?: string) => void;
  notDeepLooseEqual: <T>(value: T, expected: T, message?: string) => void;
  throws: (value: Function | Promise<any>, error: any, message?: string) => void;
  doesNotThrow: (value: Function | Promise<any>, message?: string) => void;
  regexTest: (regex: RegExp, contents: string, message?: string) => void;
  comment: (message?: string) => void;
}

declare interface TapeTest {
  (t: TapeTestAssertions): Promise<any> | any;
}

declare interface Tape {
  (f: TapeTest): void;
  (message: string, f: TapeTest): void;
  (message: string, opts: { skip: Boolean, timeout: number }, f: TapeTest): void;
  skip: Tape;
}

declare module "tape"  {
  const test: Tape;
  export = test;
}

declare interface TestAssertions {
  plan: (n: number) => void;
  end: () => void;
  pass: (message?: string) => void;
  fail: (message?: string) => void;
  ok: (value: any, message?: string) => void;
  notOk: (value: any, message?: string) => void;
  true: (value: boolean, message?: string) => void;
  false: (value: boolean, message?: string) => void;
  is: <T>(value: T, expected: T, message?: string) => void;
  not: <T>(value: T, expected: T, message?: string) => void;
  same: <T>(value: T, expected: T, message?: string) => void;
  notSame: <T>(value: T, expected: T, message?: string) => void;
  throws: (value: Function | Promise<any>, error: any, message?: string) => void;
  doesNotThrow: (value: Function | Promise<any>, message?: string) => void;
  regexTest: (regex: RegExp, contents: string, message?: string) => void;
}

declare interface AvaTest {
  (t: TestAssertions): Promise<any> | any;
}

declare interface Ava {
  (f: AvaTest): void;
  (message: string, f: AvaTest): void;
  only: Ava;
}

declare module "ava"  {
  const test: Ava;
  export = test;
}
