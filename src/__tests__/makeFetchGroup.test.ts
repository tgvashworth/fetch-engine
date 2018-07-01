// tslint:disable:no-var-requires max-classes-per-file
import "whatwg-fetch";
import makeFetchGroup from "../makeFetchGroup";

it(
  "groups can be created lazily",
  () => {
    expect.assertions(3);
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
    expect(a.shouldFetch(new Request("/"))).toEqual(true);
    expect(a.plugins[0].called).toEqual(true);
    expect(b.plugins[0].called).toEqual(false);
  },
);

it(
  "lazy groups support configuration",
  () => {
    expect.assertions(2);
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
    expect(a.plugins[0].enabled).toEqual(true);
    expect(b.plugins[0].enabled).toEqual(false);
  },
);
