import { FetchEngine, FetchPreset } from 'fetch-engine';

class PathPrefixFilter {
  constructor(prefix) {
    this.prefix = prefix;
  }
  testRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith(prefix);
  }
}

class CORSAuthPlugin {
  getRequest(request) {
    return new Request(request, {
      mode: 'cors',
      credentials: 'include',
      headers: Object.assign(request.headers, {
        'X-Csrf-Token': getCsrfToken()
      })
    });
  }
}

class RateLimitPlugin {
  shouldFetch(request) {
    return !isRateLimited(request);
  }
}

class TimeoutPlugin {
  constructor(time=1000) {
    this.time = time;
  }
  fetch({ cancel }) {
    setTimeout(cancel, this.time);
  }
}

class MetricsPlugin {
  willFetch(request) {
    trackRequest(request);
  }
  didFetch(response) {
    trackResponse(response);
  }
}

let fetch = new FetchEngine({
  plugins: [
    new TimeoutPlugin(5000),
    new CORSAuthPlugin(),
    new FetchPreset({
      filters: [ new PathPrefixFilter('/1.1/') ],
      plugins: [ new RateLimitPlugin() ]
    }),
    new MetricsPlugin()
  ]
});
