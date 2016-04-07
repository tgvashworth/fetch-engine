"use strict";

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

type RequireGlobifyOpts = {
  mode: string;
}

/* tslint:disable */
namespace NodeJS {
  export interface Global {
    ZUUL: { port: number };
  }
}
/* tslint:enable */
