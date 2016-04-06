/* tslint:disable */
/// <reference path="./.d.test.ts" />

type RequireGlobifyOpts = {
  mode: string;
}

interface NodeRequire {
  (id: string, opts: RequireGlobifyOpts): void;
}

require("./test-globals");
require("./**/*!(node).test.js", { mode: "expand" });
