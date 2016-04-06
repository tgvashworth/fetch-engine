/// <reference path="../.d.test.ts" />
"use strict";

import BrowserStackTunnel = require("browserstacktunnel-wrapper");

export default class Tunnel {
  private tunnel: BrowserStackTunnel;
  constructor(opts?) {
    this.tunnel = new BrowserStackTunnel(opts);
  }

  start(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tunnel.start(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  stop(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.tunnel.stop(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}
