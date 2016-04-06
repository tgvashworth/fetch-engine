/// <reference path="../typings/node/node.d.ts" />

// General

interface Callback<T> {
  (error: Error, v?: T): any;
}

// Tape

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

// browser-run

declare module "browser-run" {
  import * as stream from "stream";

  namespace run {
    interface BrowserRun {
      (opts: Options): Browser;
    }

    interface Browser extends stream.Duplex {
      stop(): void;
    }

    interface Options {
      port: any;
    }
  }

  const run: run.BrowserRun;
  export = run;
}

// browserstacktunnel-wrapper

declare module "browserstacktunnel-wrapper" {
  class BrowserStackTunnel {
    constructor(opts?: Options);
    start: (cb: Callback<void>) => any;
    stop: (cb: Callback<void>) => any;
  }

  interface Options {
    key: string;
  }

  export = BrowserStackTunnel;
}

// leadfoot

declare namespace leadfoot {
  export interface Capabilities {
    "browserstack.user": string;
    "browserstack.key": string;
    os: string;
    os_version: string;
    browser: string;
    browser_version: string;
    device?: string;
    timeout?: string;
    name?: string;
    build?: string;
    project?: string;
    "browserstack.video"?: boolean;
    "browserstack.local"?: boolean;
  }

  export class Server {
    constructor(url: string);
    createSession(
      desiredCapabilities: Capabilities,
      requiredCapabilities?: Capabilities
    ): Promise<Session>;
  }

  export class Session {
    get(url: string): Promise<void>;
    quit(): Promise<void>;
  }
}

declare module "leadfoot/Server" {
  export = leadfoot.Server;
}

declare module "leadfoot/Session" {
  export = leadfoot.Session;
}
