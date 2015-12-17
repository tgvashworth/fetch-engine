/// <reference path="./.d.ts"/>
"use strict";
import fetch from "./fetch";
import FetchGroup from "./FetchGroup";
import sideEffect from "./sideEffect";

export default function fetchEngine(
  plugin: FetchEnginePlugin = new FetchGroup()
): Fetch {
  return function (originalRequest: FetchRequest): Promise<FetchResponse> {
    return Promise.resolve(originalRequest)
      .then(sideEffect((request: FetchRequest) => {
        if (!plugin.shouldFetch(request)) {
          throw new Error("shouldFetch prevented the request from being made");
        }
      }))
      .then(plugin.getRequest.bind(plugin))
      .then(sideEffect(plugin.willFetch.bind(plugin)))
      .then((request: FetchRequest): Promise<FetchResponse> => {
        const pFetch = fetch(request);
        // Side effects!
        plugin.fetch({
          promise: pFetch,
          request: request,
          // cancel: TODO
        });
        return pFetch;
      })
      .then(plugin.getResponse.bind(plugin))
      .then(sideEffect(plugin.didFetch.bind(plugin)));
  };
};
