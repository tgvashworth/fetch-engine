import {
  FetchRetry,
  IFetchEnginePlugin,
  IFetchGroupOptions,
} from "./d";
import FetchGroup from "./FetchGroup";
import sideEffect from "./utils/sideEffect";

type PluginOrOpts = IFetchEnginePlugin & IFetchGroupOptions;

// makeFetchEngine takes an implementation of fetch so that we can make
// versions of the library for node and the browser.
export default function makeFetchEngine(
  innerFetch: Window["fetch"],
): (plugin?: PluginOrOpts) => Window["fetch"] {
  // Here is the actual implementation of the fetch-engine, where we've
  // closed over the 'inner' fetch implementation.
  return function fetchEngine(
    pluginOrOpts: PluginOrOpts = new FetchGroup(),
  ): Window["fetch"] {
    // Marshal the input to make sure it's a valid plugin that implements all the methods
    // that we assume to be in place below
    const plugin = (
      isPlugin(pluginOrOpts) ?
        pluginOrOpts :
        new FetchGroup(pluginOrOpts)
    );

    return function fetch(
      input: string | Request,
      init?: RequestInit,
    ): Promise<Response> {
      // Normalise the fetch API sugar into a Request
      const originalRequest = new Request(input, init);

      // In order to retry we have to close over the original input
      const retry: FetchRetry = (req?: Request) => {
        if (typeof req !== "undefined") {
          return fetch(req);
        } else {
          return fetch(originalRequest);
        }
      };

      const pReq = Promise.resolve(originalRequest);

      const pShouldFetch = pReq.then(sideEffect((request: Request) => {
        if (!plugin.shouldFetch(request)) {
          throw new Error("shouldFetch prevented the request from being made");
        }
      }));

      const pGetRequest = pShouldFetch.then(plugin.getRequest.bind(plugin));

      const pWillFetch = pGetRequest.then(sideEffect(plugin.willFetch.bind(plugin)));

      const pFetching = pWillFetch.then((request: Request): Promise<Response> => {
        return Promise.resolve(
          plugin.fetch(
            request,
            (): Promise<Response> => {
              // Business time.
              const pFetch = innerFetch(request);
              // Side effects!
              plugin.fetching({
                promise: pFetch,
                request,
                // cancel: TODO
              });
              return pFetch;
            },
          ),
        );
      });

      const pGetResponse = pFetching.then((res: Response) =>
        plugin.getResponse(res, retry),
      );

      const pDidFetch = pGetResponse.then(sideEffect<Response>(plugin.didFetch.bind(plugin)));

      return pDidFetch;
    };
  };
}

function isPlugin(o: PluginOrOpts = {}): o is IFetchEnginePlugin {
  return [
    "shouldFetch", "getRequest", "willFetch",
    "fetch", "fetching",
    "getResponse", "didFetch",
  ].every((k) => typeof o[k] === "function");
}
