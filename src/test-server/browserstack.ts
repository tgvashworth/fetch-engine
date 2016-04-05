/// <reference path="../.d.test.ts" />
"use strict";

import _ = require("lodash");
import Server = require("leadfoot/Server");

export type BrowserStackOpts = {
  capabilities: {}
};

export default class BrowserStack {
  static hub: string = "https://hub.browserstack.com/wd/hub";
  private user: string;
  private key: string;
  private capabilities: {};
  private server: leadfoot.Server;
  constructor(user: string, key: string, opts?: BrowserStackOpts) {
    this.user = user;
    this.key = key;
    this.server = new Server(BrowserStack.hub);
    this.capabilities = opts.capabilities;
  }

  createSession(
    capabilites: {}
  ): Promise<leadfoot.Session> {
    return this.server.createSession(
      <leadfoot.Capabilities>_.extend(
        {},
        capabilites,
        this.capabilities,
        {
          browserName: "",
          "browserstack.user": this.user,
          "browserstack.key": this.key
        }
      )
    );
  }
}
