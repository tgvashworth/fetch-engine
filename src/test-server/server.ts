/// <reference path="../.d.test.ts" />
"use strict";
import run = require("browser-run");

import Browserstack from "./browserstack";
import Tunnel from "./tunnel";

function timeout(t: number, v: any): Promise<any> {
  return new Promise(resolve => setTimeout(() => resolve(v), t));
}

// BrowserStack sessions

const browserstack = new Browserstack(
  process.env.BROWSERSTACK_USERNAME,
  process.env.BROWSERSTACK_KEY
);

// BrowserStack tunnel

const tunnel = new Tunnel({
  key: process.env.BROWSERSTACK_KEY
});

const browsers = [
  {
      os: "OS X",
      os_version: "Lion",
      browser: "Chrome",
      browser_version: "47",
      "browserstack.video": true,
      "browserstack.local": true
  },
  {
      os: "Windows",
      os_version: "10",
      browser: "Chrome",
      browser_version: "47",
      "browserstack.video": true,
      "browserstack.local": true
  }
];

function runBrowser(capabilities, id): Promise<void> {
  return browserstack.createSession(capabilities)
    .then(session =>
      session.get(`http://localhost:5000/${id}`)
        .then(() => session))
    .then(v => timeout(5000, v))
    .then(session => session.quit());
}

tunnel.start()
  .then(() => Promise.all(browsers.map(runBrowser)))
  .then(
    () => exit(0),
    err => {
      console.error(err);
      exit(1);
    }
  );

process.on("SIGINT", () => exit(1));

function exit(code: number = 0): Promise<void> {
  return tunnel.stop()
    .then(() => process.exit(code));
}

// Test code static file host

const browser = run({
  port: 5000
});

process.stdin
  .pipe(browser)
  .pipe(process.stdout);
