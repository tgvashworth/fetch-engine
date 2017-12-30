import {
  IFetchGroupOptions,
} from "./d";
import FetchGroup from "./FetchGroup";

/*
 * makeFetchGroup is a utility for making reusable, possibly
 * stateful, FetchGroups.
 *
 * `makeFetchGroup` takes a function that, when called, should
 * return an object of `FetchGroup` options.
 *
 * It returns a constructor function.
 *
 * The first argument passed to the group constructor is forwared
 * to the inner function, allowing you to customise the configuration
 * of the group on an instance-by-instance basis.
 *
 * Example:

    const RateLimitGroup = makeFetchGroup(() => ({
      filters: [
        new MethodFilter("GET")
      ],
      plugins: [
        new RateLimitPlugin()
      ]
    }));

    const fetch = fetchEngine({
      plugins: [
        new RateLimitGroup()
      ]
    });

    const PathRateLimitGroup = makeFetchGroup((opts = {}) => ({
      filters: [
        new MethodFilter("GET"),
        new PathFilter(opts.path)
      ],
      plugins: [
        new RateLimitPlugin()
      ]
    }));

    const fetch = fetchEngine({
      plugins: [
        new PathRateLimitGroup({
          path: /^\/1\.1/
        })
      ]
    });

 */
export default function makeFetchGroup<T>(
  f: (T?) => IFetchGroupOptions,
): (T?) => void {
  return (t?) => new FetchGroup(f(t));
}
