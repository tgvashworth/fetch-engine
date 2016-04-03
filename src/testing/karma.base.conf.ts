/// <reference path="../.d.test.ts"/>

export default {
  basePath: "../..",
  browsers: ["Electron"],
  frameworks: ["tap"],
  files: ["dist/*.test.js"],
  preprocessors: {
    "dist/*.test.js": ["webpack"]
  },
  reporters: ["progress"],
  singleRun: true,
  webpack: {
    node: {
      fs: "empty"
    }
  },
  webpackMiddleware: {
    noInfo: true
  }
};
