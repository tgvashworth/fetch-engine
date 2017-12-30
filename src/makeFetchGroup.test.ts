// tslint:disable:no-var-requires max-classes-per-file
require("isomorphic-fetch");
import * as test from "tape";
import makeFetchGroup from "./makeFetchGroup";

test("groups can be created lazily", (t) => {
  t.plan(3);
  class MockPlugin {
    public called: boolean = false;
    public shouldFetch(req) {
      this.called = true;
      return true;
    }
  }
  const GroupA = makeFetchGroup(() => ({
    plugins: [
      new MockPlugin(),
    ],
  }));
  const a = new GroupA();
  const b = new GroupA();
  t.equal(a.shouldFetch(new Request("/")), true);
  t.equal(a.plugins[0].called, true);
  t.equal(b.plugins[0].called, false);
});

test("lazy groups support configuration", (t) => {
  t.plan(2);
  class MockPlugin {
    public enabled: boolean = false;
    public shouldFetch: () => true;
    constructor(enabled: boolean) {
      this.enabled = enabled;
    }
  }
  const Group = makeFetchGroup((opts: { enabled: boolean }) => ({
    plugins: [
      new MockPlugin(opts.enabled),
    ],
  }));
  const a = new Group({ enabled: true });
  const b = new Group({ enabled: false });
  t.equal(a.plugins[0].enabled, true);
  t.equal(b.plugins[0].enabled, false);
});
