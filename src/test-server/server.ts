/// <reference path="../.d.test.ts" />
"use strict";
import yargs = require("yargs");
import run = require("browser-run");

import Browserstack from "./browserstack";
import Tunnel from "./tunnel";

const argv = yargs.argv;

function timeout(t: number, v: any): Promise<any> {
  return new Promise(resolve => setTimeout(() => resolve(v), t));
}

// BrowserStack sessions

const browserstack = new Browserstack(
  argv["browserstack-user"],
  argv["browserstack-key"]
);

// BrowserStack tunnel

const tunnel = new Tunnel({
  key: argv["browserstack-key"]
});

tunnel.start()
  .then(() => {
    console.log("BrowserStack Tunnel: started");

    return browserstack
      .createSession({
        os: "OS X",
        os_version: "Lion",
        browser: "Chrome",
        browser_version: "47",
        "browserstack.video": true,
        "browserstack.local": true
      })
      .then(session =>
        session.get("http://localhost:5000")
          .then(() => session))
      .then(v => timeout(5000, v))
      .then(session => {
        console.log("Terminating session");
        return session.quit();
      })
      .then(() => {
        console.log("done");
        return tunnel.stop();
      });
  })
  .catch(err => console.error(err));

process.on("SIGINT", () => {
  console.log("BrowserStack Tunnel: stopping");
  tunnel.stop()
    .then(() => process.exit());
});

// Test code static file host

const browser = run({
  port: argv["static-port"]
});

process.stdin
  .pipe(browser)
  .pipe(process.stdout);
