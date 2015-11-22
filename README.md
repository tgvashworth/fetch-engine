# fetch-engine

A smart request-making library that makes sure your native web app is a good citizen of your distributed system.

Current status: _Design_

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
  - cancel (eg. deduping)
  - add to request (eg. auth)
- do-fetch
  - timeouts
- post-fetch
  - retry (eg. on 503)
  - track performance

## Notes

- To support some of these use cases, there needs to be a place to add metadata to the request (for example, to record when the request was initiated).
