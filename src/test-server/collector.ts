/// <reference path="../.d.test.ts" />
"use strict";

import http = require("http");
import urllib = require("url");

export default function collector(
  opts: { port: number },
  collect: (id: number) => void
): void {
  http.createServer((req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (req.method === "OPTIONS") {
      res.writeHead(200, {
        "Access-Control-Allow-Headers": req.headers["access-control-request-headers"],
        "Access-Control-Allow-Methods": req.headers["access-control-request-method"]
      });
      res.end();
      return;
    }

    const url = urllib.parse(req.url, true);
    collect(url.query.id);
    res.writeHead(204);
    res.end();
  }).listen(opts.port);
}
