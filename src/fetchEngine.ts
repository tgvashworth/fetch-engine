/// <reference path="./.d.ts"/>
"use strict";
import FetchGroup from "./FetchGroup";
import sideEffect from "./utils/sideEffect";
import Request from "./Request";

// makeFetchEngine takes an implementation of fetch so that we can make
// versions of the library for node and the browser.
export default function makeFetchEngine(
  innerFetch: Fetch
): (plugin?: FetchEnginePlugin | FetchGroupOptions) => Fetch {
  // Here is the actual implementation of the fetch-engine, where we've
  // closed over the 'inner' fetch implementation.
  return function fetchEngine(
    pluginOrOpts: FetchEnginePlugin | FetchGroupOptions = new FetchGroup()
  ): Fetch {
    // Marshal the input to make sure it's a valid plugin that implements all the methods
    // that we assume to be in place below
    const plugin = (
      isPlugin(pluginOrOpts) ?
        pluginOrOpts :
        new FetchGroup(pluginOrOpts)
    );

    return function fetch(
      input: string | FetchRequest,
      init: FetchRequestInit = {}
    ): Promise<FetchResponse> {
      // Normalise the fetch API sugary API into a Request
      const originalRequest = new Request(input, init);
      // Let's go!
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
}

function isPlugin(o: FetchEnginePlugin | FetchGroupOptions = {}): o is FetchEnginePlugin {
  return [
    "shouldFetch", "getRequest", "willFetch",
    "fetch", "fetching",
    "getResponse", "didFetch"
  ].every(k => typeof o[k] === "function");
}
