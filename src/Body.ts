/// <reference path="./.d.ts"/>
"use strict";

export default class Body implements FetchBody {
  bodyUsed: boolean = false;
  private _bodyText: string;

  constructor(body) {
    if (typeof body === "string") {
      this._bodyText = body;
    } else if (Blob.prototype.isPrototypeOf(body)) {
      throw new Error("Not implemented");
    } else if (FormData.prototype.isPrototypeOf(body)) {
      throw new Error("Not implemented");
    } else if (!body) {
      this._bodyText = "";
    } else {
      throw new Error("unsupported BodyInit type");
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
