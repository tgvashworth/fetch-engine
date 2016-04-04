/// <reference path="../.d.test.ts"/>

import baseconf from "./karma.base.conf";

if (
  !process.env.BROWSERSTACK_USERNAME ||
  !process.env.BROWSERSTACK_KEY
) {
  throw new Error("BrowserStack info missing. Use BROWSERSTACK_USERNAME and BROWSERSTACK_KEY");
}

module.exports = function (config): void {
  config.set(Object.assign({}, baseconf, {
    browserStack: {
      username: process.env.BROWSERSTACK_USERNAME,
      accessKey: process.env.BROWSERSTACK_KEY
    },
    customLaunchers: {
      _ie: {
        base: "BrowserStack",
        browser: "ie",
        browser_version: "10",
        os: "Windows",
        os_version: "7"
      },
      _firefox: {
        base: "BrowserStack",
        browser: "firefox",
        browser_version: "latest",
        os: "Windows",
        os_version: "7"
      },
      _chrome: {
        base: "BrowserStack",
        browser: "chrome",
        browser_version: "latest",
        os: "Windows",
        os_version: "7"
      },
      _opera: {
        base: "BrowserStack",
        browser: "opera",
        browser_version: "latest",
        os: "Windows",
        os_version: "7"
      },
      _safari: {
        base: "BrowserStack",
        browser: "safari",
        browser_version: "6",
        os: "OS X",
        os_version: "Lion"
      }
    },
    browsers: ["_ie", "_firefox", "_chrome", "_opera", "_safari"]
  }));
};
