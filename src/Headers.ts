/// <reference path="./.d.ts"/>
"use strict";

import {
  isForbiddenHeaderName,
  isForbiddenResponseHeaderName,
  isSimpleHeader,
  getNormalizedHeaderName,
} from "./utils/HeadersUtils";

export interface Header {
  name: string;
  value: string;
}

export interface HeadersList extends Array<Header> {};

export enum Guard {
  Immutable,
  Request,
  RequestNoCors,
  Response,
  None,
};

export class Headers implements FetchHeaders {
  protected guard: Guard = Guard.None;
  private headers: HeadersList = [];

  constructor(headers?: any) {
    if (headers instanceof Array) {
      headers.forEach((header) => {
        this.append(header[0], header[1]);
      });
    } else {
      // If we passed in headers, get the full set to append here.
      if (headers instanceof Headers) {
        headers = headers.getHeaders();
      }
      for (let name in headers) {
        if (headers.hasOwnProperty(name)) {
          this.append(name, headers[name]);
        }
      }
    }
  }

  append(name: string, value: string): void {
    name = getNormalizedHeaderName(name);

    if (this.guard === Guard.Immutable) {
      throw new TypeError();
    }

    if (this.guard === Guard.Request &&
      isForbiddenHeaderName(name)) {
        return;
    }

    if (this.guard === Guard.RequestNoCors &&
      !isSimpleHeader(name, value)) {
        return;
    }

    if (this.guard === Guard.Response &&
      isForbiddenResponseHeaderName(name)) {
        return;
    }

    this.headers.push({
      name: name,
      value: value
    });
  }

  delete(name: string): void {
    name = getNormalizedHeaderName(name);

    if (this.guard === Guard.Immutable) {
      throw new TypeError();
    }

    if (this.guard === Guard.Request &&
      isForbiddenHeaderName(name)) {
        return;
    }

    if (this.guard === Guard.RequestNoCors &&
      !isSimpleHeader(name)) {
        return;
    }

    if (this.guard === Guard.Response &&
      isForbiddenResponseHeaderName(name)) {
        return;
    }

    this.headers = this.headers.filter((header) => {
      return header.name !== name;
    });
  }

  get(name: string): string {
    return this.headers
      .filter((header) => {
        return header.name === getNormalizedHeaderName(name);
      })
      .map((header) => {
        return header.value;
      })[0];
  }

  getAll(name: string): Array<string> {
    return this.headers
      .filter((header) => {
        return header.name === getNormalizedHeaderName(name);
      })
      .map((header) => {
        return header.value;
      });
  }

  // I put this here until we make this implement iterator.
  getHeaders(): {} {
    return this.headers.reduce(
      (obj, header) => {
        obj[header.name] = header.value;
        return obj;
      },
      {}
    );
  }

  has(name: string): boolean {
    return this.headers.some((header) => {
      return header.name === getNormalizedHeaderName(name);
    });
  }

  set(name: string, value: string): void {
    name = getNormalizedHeaderName(name);

    if (this.guard === Guard.Immutable) {
      throw new TypeError();
    }

    if (this.guard === Guard.Request &&
      isForbiddenHeaderName(name)) {
        return;
    }

    if (this.guard === Guard.RequestNoCors &&
      !isSimpleHeader(name, value)) {
        return;
    }

    if (this.guard === Guard.Response &&
      isForbiddenResponseHeaderName(name)) {
        return;
    }

    let set = false;

    for (var i = 0; i < this.headers.length; ++i) {
      if (this.headers[i].name === name) {
        if (!set) {
          this.headers[i].value = value;
          set = true;
        } else {
          delete this.headers[i];
        }
      }
    }

    // If there was nothing to set, append a new header.
    if (!set) {
      this.append(name, value);
    }
  }
}

export class ImmutableHeaders extends Headers {
  protected guard: Guard = Guard.Immutable;
}

export class RequestHeaders extends Headers {
  protected guard: Guard = Guard.Request;
}

export class RequestNoCorsHeaders extends Headers {
  protected guard: Guard = Guard.RequestNoCors;
}

export class ResponseHeaders extends Headers {
  protected guard: Guard = Guard.Response;
}
