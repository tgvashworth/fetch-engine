/// <reference path="../.d.test.ts" />
"use strict";

import _ = require("lodash");
import Server = require("leadfoot/Server");

export default class BrowserStack {
  static hub: string = "https://hub.browserstack.com/wd/hub";
  private user: string;
  private key: string;
  private server: leadfoot.Server;
  constructor(user: string, key: string) {
    this.user = user;
    this.key = key;
    this.server = new Server(BrowserStack.hub);
  }

  createSession(
    capabilites: {}
  ): Promise<leadfoot.Session> {
    return this.server.createSession(
      <leadfoot.Capabilities>_.extend({}, capabilites, {
        browserName: "",
        "browserstack.user": this.user,
        "browserstack.key": this.key
      })
    );
  }
}
