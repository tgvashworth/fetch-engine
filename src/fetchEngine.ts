/// <reference path="./.d.ts"/>
"use strict";
import innerFetch from "./fetch";
import FetchGroup from "./FetchGroup";
import sideEffect from "./utils/sideEffect";
import Request from "./Request";

export default function fetchEngine(
  plugin: FetchEnginePlugin = new FetchGroup()
): Fetch {
  return function fetch(
    input: string | FetchRequest,
    init: FetchRequestInit = {}
  ): Promise<FetchResponse> {
    const originalRequest = new Request(input, init);
    return Promise.resolve(originalRequest)
      .then(sideEffect((request: FetchRequest) => {
        if (!plugin.shouldFetch(request)) {
          throw new Error("shouldFetch prevented the request from being made");
        }
      }))
      .then(plugin.getRequest.bind(plugin))
      .then(sideEffect(plugin.willFetch.bind(plugin)))
      .then((request: FetchRequest): Promise<FetchResponse> => {
        return Promise.resolve(
          plugin.fetch(
            request,
            () => {
              const pFetch = innerFetch(request);
              // Side effects!
              plugin.fetching({
                promise: pFetch,
                request: request,
                // cancel: TODO
              });
              return pFetch;
            }
          )
        );
      })
      .then(plugin.getResponse.bind(plugin))
      .then(sideEffect(plugin.didFetch.bind(plugin)));
  };
};
