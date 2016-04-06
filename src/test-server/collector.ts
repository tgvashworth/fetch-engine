/// <reference path="../.d.test.ts" />
"use strict";

import http = require("http");
import urllib = require("url");

export default function collector(
  opts: { port: number },
  collect: (id: number) => void
): void {
  http.createServer((req, res) => {
    const url = urllib.parse(req.url, true);
    console.log(`req from ${url.query.id}:`, req.method, req.url);
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
    if (req.method === "OPTIONS") {
      res.writeHead(200, {
        "Access-Control-Allow-Headers": req.headers["access-control-request-headers"],
        "Access-Control-Allow-Methods": req.headers["access-control-request-method"]
      });
      res.end();
      return;
    }

    res.writeHead(204);
    res.end();
    collect(url.query.id);
  }).listen(opts.port);
}
