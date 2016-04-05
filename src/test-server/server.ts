/// <reference path="../.d.test.ts" />
"use strict";
import run = require("browser-run");

import Browserstack from "./browserstack";
import Tunnel from "./tunnel";
import collector from "./collector";
import { browsers } from "./config";
import { Result, Complete, Incomplete } from "./Result";

// BrowserStack sessions

const browserstack = new Browserstack(
  process.env.BROWSERSTACK_USERNAME,
  process.env.BROWSERSTACK_KEY,
  {
    capabilities: {
      "browserstack.video": true,
      "browserstack.local": true,
      build: Date.now().toString()
    }
  }
);

// BrowserStack tunnel

const tunnel = new Tunnel({
  key: process.env.BROWSERSTACK_KEY
});

const idToSession = {};

function runBrowser(browser, id): Promise<Result> {
  return browserstack.createSession(browser.capabilities)
    .then(session => {
      const pDone = new Promise<Result>((resolve, reject) => {
        idToSession[id] = {
          session,
          resolve: (result: any): void => resolve(new Complete(id, result))
        };
        setTimeout(
          () => resolve(new Incomplete(id, new Error("Timeout"))),
          1000 * 60 * 2
        );
      });
      return session.get(`http://localhost:5000/#${id}`)
        .then(() => pDone);
    });
}

tunnel.start()
  .then(() => Promise.all(browsers.map(runBrowser)))
  .then(
    (results: Result[]) => {
      exit(results.some(res => res.constructor === Incomplete) ? 1 : 0);
    },
    err => {
      console.error(err);
      exit(1);
    }
  );

process.on("SIGINT", () => exit(1));

function exit(code: number = 0): Promise<void> {
  console.error("Tunnel: stopping");
  return tunnel.stop()
    .then(() => {
      console.error("Tunnel: stopped");
      process.exit(code);
    });
}

// Collector

collector({ port: 5001 }, function (id: number): void {
  if (idToSession[id]) {
    idToSession[id].session.quit().then(() => {
      idToSession[id].resolve();
    });
  }
});

// Test code static file host

const browser = run({
  port: 5000
});

process.stdin
  .pipe(browser)
  .pipe(process.stdout);
