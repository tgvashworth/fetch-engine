// fetch-engine types

export type FetchNext = () => Promise<Response>;
export type FetchRetry = (req?: Request) => Promise<Response>;

export interface IFetchFetchingArgs {
  request: Request;
  promise: Promise<Response>;
  cancel?(): void;
}

export interface IFetchEnginePlugin {
  // pre-fetch
  shouldFetch?: (req: Request) => boolean;
  getRequest?: (req: Request) => Promise<Request>|Request;
  willFetch?: (req: Request) => void;
  // fetch
  fetch?: (req: Request, next: FetchNext) => Promise<Response>;
  fetching?: (args: IFetchFetchingArgs) => void;
  // post-fetch
  getResponse?: (req: Response, retry: FetchRetry) => Promise<Response>|Response;
  didFetch?: (req: Response) => void;
}

export interface IFetchEngineFilter {
  testRequest?: (req: Request) => boolean;
  testResponse?: (req: Response) => boolean;
}

export interface IFetchGroupOptions {
  plugins?: IFetchEnginePlugin[];
  filters?: IFetchEngineFilter[];
}
