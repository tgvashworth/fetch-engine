# fetch-engine

[![Build Status](https://travis-ci.org/tgvashworth/fetch-engine.svg?branch=master)](https://travis-ci.org/tgvashworth/fetch-engine) [![Stories in Ready](https://badge.waffle.io/tgvashworth/fetch-engine.svg?label=ready&title=Ready)](http://waffle.io/tgvashworth/fetch-engine)

A smart request-making library that makes sure your Javascript client is a good citizen of your distributed system.

## install

To get `fetch-engine`, install it with yarn:

```
yarn install --save fetch-engine
```

## Getting started

`fetch-engine` is designed for use in a web browser, and you'll need a build tool like `webpack` or `browerify` to include it in your project:

```js
import fetchEngine from 'fetch-engine';
```

The default export, `fetchEngine`, is a function. When called, it returns an implementation of the [fetch API][fetch-api] — a request-making function that you might call `fetch`:

```js
const fetch = fetchEngine();
```

The magic of `fetch-engine` is that you can pass plugins and filters that augment the network requests to do things like:

- retry on network-failure
- log request time per URL
- throttle requests to a rate-limited API endpoint
- respect common HTTP error codes (eg. 503 retry with exponential backoff to a limit)
- deduplicate identical in-flight requests

Here's a simple example that logs every request using the `willFetch` lifecycle method:

```js
class LoggerPlugin {
  willFetch(request) {
    console.log(request.method, request.url);
  }
}

const fetch = fetchEngine({
  plugins: [
    new LoggerPlugin()
  ]
});
```

## Using `fetch-engine`

`fetch-engine` allows you to combine plugins in groups or sequences to add behaviour to the [Fetch API][fetch-api]. The basic building block is the plugin.

### Plugins

Plugins can intercept and modify HTTP requests and responses. They're simple objects, so this is a valid plugin:

```js
const logger = {
  willFetch(request) {
    console.log(request.method, request.url);
  }
};
```

But to be able to store state in the plugins, or to give them a proper name for debugging, you can create a simple class and use `new`:

```js
class Logger {
  willFetch(request) {
    console.log(request.method, request.url);
  }
}
```

That `willFetch` method is one of many `lifecyle` methods you can attach behaviour to.

The full list, in the order they run:

- `shouldFetch`
- `getRequest`
- `willFetch`
- `fetch`
- `fetching`
- `getResponse`
- `didFetch`

#### `shouldFetch`

`shouldFetch` allows plugins to prevent or allow a request by returning a boolean, or a `Promise` for a boolean. It's passed the candidate `Request` object.

```js
class RateLimitPlugin {
  isRateLimited(request) {
    /* ... */
    return false;
  }
  shouldFetch(request) {
    return !this.isRateLimited(request);
  }
}
```

#### `getRequest`

`getRequest` allows plugins to add data to `Request`, or produce an entirely new `Request`. After this method has run, the subsequent lifecycle methods will use the new or changed `Request`. `getRequest` should return a `Request` or a `Promise` for one.

```js
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
```

#### `willFetch`

`willFetch` allows a plugin to react to a `Request` just before it is made, but not affect it, becuase the return value is be ignored.

```js
class RequestMetricsPlugin {
  willFetch(request) {
    trackRequest(request);
  }
}
```

#### `fetch`

`fetch` takes two arguments: the input `request` and a `next` method that takes no arguments, but causes the request to be passed to the next plugin and eventually hit the network.

The `fetch` method allows plugins to intercept the Request that's about to be made and return a `Response` without hitting the network.

It should return (a `Promise` for) a `Response`.

```js
class CachePlugin {
  fetch(request, next) {
    if (this.isCached(request)) {
      return this.getFromCache(request);
    }
    return next();
  }
  isCached(request) {
    // ...
  }
  getFromCache(request) {
    // ...
  }
}
```

#### `fetching`

Allows plugins to react to the completion of the `fetch` but not affect it, or `cancel` the request.

It's passed an object of the form `{ request, promise, cancel }` and the return value is ignored.

```js
class TimeoutPlugin {
  constructor(time=1000) {
    this.time = time;
  }
  fetching({ cancel }) {
    setTimeout(cancel, this.time);
  }
}
```

####  `getResponse`

Allows plugins to add data to `Response`, produce an entirely new `Response`, or retry the whole fetch.

It's passed the current `Response` object, a `retry` function, and should return a `Promise` for a `Response`.

```js
class SuperResponseWrapperPlugin {
  getResponse(response, retry) {
    return new SuperResponse(response);
  }
}
```

Use the `retry` function to start the whole request again:

```js
// Note: your retry plugin needs to be smarter than this as this implementation
//       could cause a retry-storm or self-DDoS.
class RetryPlugin {
  getResponse(response, retry) {
    if (response.status === 503) {
      return retry();
    } else {
      return response;
    }
  }
}
```

Or to try a different request:

```js
// Note: your retry plugin needs to be smarter than this as this implementation
//       could cause a retry-storm or self-DDoS.
class RetryPlugin {
  getResponse(response, retry) {
    if (response.status === 503) {
      return retry(new Request("/somewhere-else"));
    } else {
      return response;
    }
  }
}
```

#### `didFetch`

Allows a plugin to react to a response arriving, without affecting it.

Passed the current `Response` object. Return value would be ignored.

```js
class ResponseMetricsPlugin {
  didFetch(response) {
    trackResponse(response);
  }
}
```

### Groups

Groups of plugins can be created using something called a `FetchGroup`. A group lets you pull together functionality in a way that can be reused as plugin:

```js
import fetchEngine, { FetchGroup } from 'fetch-engine';

const combinedMetricsGroup = new FetchGroup({
  plugins: [
    new RequestMetricsPlugin(),
    new ResponseMetricsPlugin()
  ]
});
```

`FetchGroup` instances are plugins too, so you can pass them to `fetchEngine` like any other plugin:

```js
const fetch = fetchEngine({
  plugins: [
    combinedMetricsGroup
  ]
});
```

<!-- TODO make fetchGroup({ ... }) factory -->

### Filters

Filters are used to decide whether to apply a set of plugins. They combine with plugins as part of a `FetchGroup`, deciding whether the plugins will run. If the filter says no, the request is passed to the next plugin for processing.

In the example below, the `RateLimitPlugin` will only be applied to requests that match the `testRequest` method of the `PathPrefixFilter`.

```js
class PathPrefixFilter {
  constructor(prefix) {
    this.prefix = prefix;
  }
  testRequest(request) {
    const url = new URL(request.url);
    return url.pathname.startsWith(this.prefix);
  }
}

const rateLimitGroup = new FetchGroup({
  filters: [ new PathPrefixFilter('/1.1/') ],
  plugins: [ new RateLimitPlugin() ]
});
```

Filters can intercept requests and responses, to decide which portion of the plugin methods run. Filters can implement `testRequest` and `testResponse`. They should return `true`, `false` or a promise for `true` or `false`.

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

This project aims to make it easy to build JavaScript clients that are good citizens of distributed systems.

## Example

```js
import fetchEngine, { FetchGroup } from 'fetch-engine';

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
  fetching({ cancel }) {
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

class CachePlugin {
  fetch(request, next) {
    if (this.isCached(request)) {
      return this.get(request);
    }
    return next();
  }
  isCached(request) {
    // ...
  }
  get(request) {
    // ...
  }
}

const fetch = fetchEngine({
  plugins: [
    new CachePlugin(),
    new TimeoutPlugin(5000),
    new CORSAuthPlugin(),
    new FetchGroup({
      filters: [ new PathPrefixFilter('/1.1/') ],
      plugins: [ new RateLimitPlugin() ]
    }),
    new MetricsPlugin()
  ]
});
```

## Developing Fetch Engine

- Clone the repo: `git clone https://github.com/tgvashworth/fetch-engine.git`
- `cd fetch-engine`
- `yarn`
- To run the tests, you need a [Sauce Labs](https://saucelabs.com) account. Follow the [zuul documentation](https://github.com/defunctzombie/zuul/wiki/Cloud-testing) instructions.
- `yarn test` to check it's all working

`fetch-engine` uses [TypeScript](https://www.typescriptlang.org/). To help you write great code, I'd recommend that you get a plugin for your editor or use an IDE like [VS Code](https://code.visualstudio.com/).

Every commit should pass `yarn test`. We use [ghooks](https://github.com/gtramontina/ghooks) to enforce this.

### Compiling & running tests locally

There is a `tsc` watch task you can run to build files as they change:

```
$ yarn watch
```

Your editor may do this for you.

To run browser tests locally, run:

```
$ yarn run zuul
```

Follow the instructions it gives you.

## Goals of the project

These were the original goals of the project:

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

[tweetdeck]: https://teetdeck.twitter.com
[finagle]: http://twitter.github.io/finagle
[finagle-timeouts]: http://twitter.github.io/finagle/guide/Clients.html#timeouts-expiration
[finagle-retries]: http://twitter.github.io/finagle/guide/Clients.html#retries
[fetch-api]: https://developer.mozilla.org/en/docs/Web/API/Fetch_API
