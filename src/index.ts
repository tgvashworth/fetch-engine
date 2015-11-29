/// <reference path="./.d.ts"/>

export class FetchGroup {
  filters: Array<FetchEngineFilter>;
  plugins: Array<FetchEnginePlugin>;
  constructor(opts: FetchGroupOptions) {
    const { filters=[], plugins=[] } = opts;
    this.filters = filters;
    this.plugins = plugins;
  }
}

export const fetchEngine = (opts: FetchEngineOptions): Fetch => window.fetch;
