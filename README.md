# fetch-engine

A smart request-making library that makes sure your Javascript client is a good citizen of your distributed system.

Current status: _Design_

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

## Hooks

This outlines the places where plugins might be able to hook into of a `fetch` call, and what they could do:

- pre-fetch
  - dedupe
  - add authentication data
  - throttle
- fetch
  - timeouts
- post-fetch
  - retry (eg. on 503)
  - track performance

## Notes

- To support some of these use cases, there needs to be a place to add metadata to the request (for example, to record when the request was initiated).

[tweetdeck]: https://teetdeck.twitter.com
[finagle]: http://twitter.github.io/finagle
[finagle-timeouts]: http://twitter.github.io/finagle/guide/Clients.html#timeouts-expiration
[finagle-retries]: http://twitter.github.io/finagle/guide/Clients.html#retries
