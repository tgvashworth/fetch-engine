/* tslint:disable */
/// <reference path="./.d.test.ts" />

interface NodeRequire {
  (id: string, opts: RequireGlobifyOpts): void;
}

require("./**/*!(node).test.js", { mode: "expand" });
