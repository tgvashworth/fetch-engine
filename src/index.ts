/// <reference path="./.d.ts"/>
"use strict";

export class FetchGroup {
  public filters: Array<FetchEngineFilter>;
  public plugins: Array<FetchEnginePlugin>;
  constructor(opts: FetchGroupOptions) {
    const { filters = [], plugins = [] }: FetchGroupOptions = opts;
    this.filters = filters;
    this.plugins = plugins;
  }
}

export function fetchEngine(opts: FetchEngineOptions): Fetch {
  return window.fetch;
};
