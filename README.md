# fetch-engine

[![Build Status](https://travis-ci.org/phuu/fetch-engine.svg?branch=master)](https://travis-ci.org/phuu/fetch-engine) [![Stories in Ready](https://badge.waffle.io/phuu/fetch-engine.svg?label=ready&title=Ready)](http://waffle.io/phuu/fetch-engine)

A smart request-making library that makes sure your Javascript client is a good citizen of your distributed system.

Current status: _Implementation_ (not ready for use, but please contribute)

## Rationale

The idea for this project comes from [TweetDeck][tweetdeck], a very 'chatty' native web app. The client-side is an oft-forgetten but important component of a distributed system, capable of bringing down servers with large amounts of traffic.

To mitigate the risk that TweetDeck contributes to a system failure we have developed a fairly complex networking layer. In various places, often ad-hoc, we do some of the following:

- use a OAuth1-signing server to authenticate to our requests
- de-duplicate in-flight requests
- poll rate-limited API endpoints as fast as the limits allow
- retry requests if they fail due to lack of network connection
- retry, with exponential back-off, requests that return an error from the server
- add authentication data in different ways based on app-configuration
- track network request performance
- timeout requests
- fall-back from a stream connection to polling

However, these behaviours can require some manual work. Not all are used for all network requests, even if they should be. In particular, retry + exponential backoff with timeouts are a general good practice that we don't always apply. They can prevent cascading failures, or compounding of issues as they arise.

In many places on the server-side, this is assumed behaviour and done automatically. For example, [Twitter's Finagle][finagle] comes with [timeouts][finagle-timeouts], [retries][finagle-retries] and other features out-of-the-box.

This project aims to make it easy to build good-citizen JavaScript network clients.

## Goals

- Highly configurable
- Do nothing by default
- Support plug-ins to add functionality
- Provide useful plugins to solve common problems:
  - respect common HTTP error codes (eg. 503 retry with exponential backoff to a limit)
  - throttle requests to a rate-limited API endpoint
  - deduplicate identical in-flight requests
  - retry on network-failure
- Instrumentable for performance and behaviour monitoring
- Work in IE9+ (stretch-goal, IE6+)
- Node-compatible
- Drop-in replacement for `fetch`

## API Design

Taken from #1.

There'd be two main constructors that come with `fetch-engine`: `FetchEngine` and `FetchGroup`. What they'd do is documented below:

### `FetchEngine`

```js
const fetch = new FetchEngine({
  plugins: [ ... ]
});
```

- on creation, compose each plugin method into one method
- on fetch(...), run methods in order:
  - `shouldFetch`
    - if `false`, bail with CancelledError
  - `getRequest`
    - produces a (`Promise` for a) `Request`
  - `willFetch`
    - side-effects, ignore return value
  - (internal-only) `fetch`
    - make the `Request` with an inner `fetch` implementation
  - `fetch`
    - allow plugins to `cancel`
  - `getResponse`
    - produce a (`Promise` for a) `Response`
  - `didFetch`
    - side-effects only, ignore return value

### `FetchGroup`

```js
const preset = new FetchGroup({
  filters: [ ... ],
  plugins: [ ... ]
});
```

- compose filter + plugin methods into functions, then act like a plugin
- gates each method based on filter responses

## Plugins

The plugin API would be as below. They're just simple objects with methods. All are optional.

#### `shouldFetch`

Passed the current `Request` object.

Allows a plugin to prevent a request from being made.

Return a (`Promise` for a) Boolean. If `false`, the request is `Cancelled`.

#### `getRequest`

Passed the current `Request` object.

Allows plugins to add data to `Request`, or produce an entirely new `Request`.

Should return a (`Promise` for a) `Request`.

#### `willFetch`

Passed the current `Request` object.

Allows a plugin to react to a request being made, but not affect it.

Return value would be ignored.

#### `fetch`

Passed an object of the form `{ promise, cancel }`.

Allows plugins to react to the completion of the `fetch` but not affect it, or `cancel` the request.

Return value is ignored.

####  `getResponse`

Passed the current `Response` object.

Allows plugins to add data to `Response`, or produce an entirely new `Response`.

Should return a (`Promise` for a) `Response`.

#### `didFetch`

Passed the current `Response` object.

Allows a plugin to react to a response arriving being made, but not affect it.

Return value would be ignored.

## Filters

The filter API would be as below. Filters are used to gate the application of plugins within a `FetchGroup`. They're just simple objects with methods. All are optional.

#### `testRequest`

Passed the current `Request`.

Run before `shouldFetch`, `getRequest`, `willFetch` and `fetch`, which will not be applied if `testRequest` resolves to `false`.

Should return a (`Promise` for a) `Boolean`.

#### `testResponse`

Passed the current `Response`.

Run before `getResponse` and `didFetch`, which will not be applied if `testResponse` resolves to `false`.

Should return a (`Promise` for a) `Boolean`.

## Example

Here's an example without an implementation, just in case this is super unclear...

```js
import { FetchEngine, FetchGroup } from 'fetch-engine';

class PathPrefixFilter {
  constructor(prefix) {
    this.prefix = prefix;
  }
  testRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith(this.prefix);
  }
}

class CORSAuthPlugin {
  constructor(csrfToken) {
    this.csrfToken = csrfToken;
  }
  getRequest(request) {
    return new Request(request, {
      mode: 'cors',
      credentials: 'include',
      headers: Object.assign(request.headers, {
        'X-Csrf-Token': this.csrfToken
      })
    });
  }
}

class RateLimitPlugin {
  isRateLimited(request) {
    /* ... */
    return false;
  }
  shouldFetch(request) {
    return !this.isRateLimited(request);
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
    new FetchGroup({
      filters: [ new PathPrefixFilter('/1.1/') ],
      plugins: [ new RateLimitPlugin() ]
    }),
    new MetricsPlugin()
  ]
});

// The above could be a shorthand for the following:

let fetch = new FetchEngine(new FetchGroup({
  plugins: [
    new TimeoutPlugin(5000),
    new CORSAuthPlugin(),
    // ...
  ]
}));
```

## Notes

- To support some of these use cases, there needs to be a place to add metadata to the request (for example, to record when the request was initiated).

[tweetdeck]: https://teetdeck.twitter.com
[finagle]: http://twitter.github.io/finagle
[finagle-timeouts]: http://twitter.github.io/finagle/guide/Clients.html#timeouts-expiration
[finagle-retries]: http://twitter.github.io/finagle/guide/Clients.html#retries
