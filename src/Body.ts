/// <reference path="./.d.ts"/>
"use strict";

export default class Body implements FetchBody {
  bodyUsed: boolean = false;
  rawBody: string;
  private _bodyText: string;

  constructor(body = null) {
    this._setBody(body);
  }

  protected _setBody(body = null): void {
    this.rawBody = body;
    if (typeof body === "string") {
      this._bodyText = body;
    } else if (typeof Blob !== "undefined" && Blob.prototype.isPrototypeOf(body)) {
      throw new Error("Not implemented");
    } else if (typeof FormData !== "undefined" && FormData.prototype.isPrototypeOf(body)) {
      throw new Error("Not implemented");
    }
  }

  text(): Promise<string> {
    if (this.bodyUsed) {
      return Promise.reject(new TypeError("Already read"));
    }
    this.bodyUsed = true;
    return Promise.resolve(this._bodyText);
  }

  json(): Promise<any> {
    return this.text().then(JSON.parse);
  }

  blob(): Promise<Blob> {
    throw new Error("Not implemented");
  }

  formData(): Promise<FormData> {
    throw new Error("Not implemented");
  }

  arrayBuffer(): Promise<ArrayBuffer> {
    throw new Error("Not implemented");
  }
}
