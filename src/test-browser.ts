/* tslint:disable */
/// <reference path="./.d.test.ts" />

interface NodeRequire {
  (id: string, opts: RequireGlobifyOpts): void;
}

namespace NodeJS {
  export interface Global {
    ZUUL: { port: number };
  }
}

// console.log("# ========================");
// console.log("# port", global.ZUUL.port);
// console.log("# ========================");

require("./test-globals");
require("./**/*!(node).test.js", { mode: "expand" });
