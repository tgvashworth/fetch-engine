import {
  FetchNext,
  FetchRetry,
  IFetchEnginePlugin,
  IFetchFetchingArgs,
  IFetchGroupOptions,
} from "./d";
import composeContinuation from "./utils/composeContinuation";
import composeEvery from "./utils/composeEvery";
import composePromise from "./utils/composePromise";
import composeVoid from "./utils/composeVoid";
import getBoundImplementations from "./utils/getBoundImplementations";

export default class FetchGroup implements IFetchEnginePlugin {
  /* tslint:disable:variable-name */
  // Filters
  private _testRequest: (req: Request) => boolean;
  private _testResponse: (req: Response) => boolean;
  // Plugins
  private _shouldFetch: (req: Request) => boolean;
  private _getRequest: (req: Request) => Promise<Request>;
  private _willFetch: (req: Request) => void;
  private _fetch: (
    req: Request,
    fetch: Window["fetch"],
  ) => Promise<Response>;
  private _fetching: (args: IFetchFetchingArgs) => void;
  private _getResponse: (req: Response, retry: FetchRetry) => Promise<Response>;
  private _didFetch: (req: Response) => void;
  /* tslint:enable:variable-name */
  constructor(opts: IFetchGroupOptions = {}) {
    const { plugins = [], filters = [] }: IFetchGroupOptions = opts;

    // Filters
    this._testRequest =
      composeEvery(getBoundImplementations("testRequest", filters));
    this._testResponse =
      composeEvery(getBoundImplementations("testResponse", filters));

    // Plugin methods
    this._shouldFetch =
      composeEvery(getBoundImplementations("shouldFetch", plugins));
    this._getRequest =
      composePromise(getBoundImplementations("getRequest", plugins));
    this._willFetch =
      composeVoid(getBoundImplementations("willFetch", plugins));
    this._fetch =
      composeContinuation<Request, Promise<Response>>(
        getBoundImplementations("fetch", plugins),
      );
    this._fetching =
      composeVoid(getBoundImplementations("fetching", plugins));
    this._getResponse =
      composePromise(getBoundImplementations("getResponse", plugins));
    this._didFetch =
      composeVoid(getBoundImplementations("didFetch", plugins));
  }
  // Plugins
  public shouldFetch(req: Request): boolean {
    return this._testRequest(req) && this._shouldFetch(req);
  }
  public getRequest(req: Request): Promise<Request> {
    if (this._testRequest(req)) {
      return this._getRequest(req);
    }
    return Promise.resolve(req);
  }
  public willFetch(req: Request): void {
    if (this._testRequest(req)) {
      return this._willFetch(req);
    }
  }
  public fetch(request: Request, fetch: FetchNext): Promise<Response> {
    return this._fetch(request, fetch);
  }
  public fetching(args: IFetchFetchingArgs): void {
    const { request } = args;
    if (this._testRequest(request)) {
      return this._fetching(args);
    }
  }
  public getResponse(res: Response, maybeRetry?: FetchRetry): Promise<Response> {
    // If no retry is supplied by the engine then we should just continue
    // with the same response.
    const retry = (
      typeof maybeRetry === "function" ?
        maybeRetry :
        () => Promise.resolve(res)
    );
    if (this._testResponse(res)) {
      return this._getResponse(res, retry);
    }
    return Promise.resolve(res);
  }
  public didFetch(res: Response): void {
    if (this._testResponse(res)) {
      return this._didFetch(res);
    }
  }
}
