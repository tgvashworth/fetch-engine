"use strict";

const forbiddenHeaderNames = [
  "accept-charset",
  "accept-encoding",
  "access-control-request-headers",
  "access-control-request-method",
  "connection",
  "content-length",
  "cookie",
  "cookie2",
  "date",
  "dnt",
  "expect",
  "host",
  "keep-alive",
  "origin",
  "referer",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
  "via",
];

const forbiddenResponseHeaderNames = [
  "set-cookie", "set-cookie2",
];

const simpleHeaderNames = [
   "accept", "accept-language", "content-language", "content-type",
];

const simpleHeaderMIMETypes = [
  "application/x-www-form-urlencoded", "multipart/form-data", "text/plain",
];

export function getNormalizedHeaderName(name: string): string {
  return name
    // Remove whitespaces (horizontal tab, new line, carriage return, space )
    .trim()
    // By spec, header names are always normalized to lowercase.
    .toLowerCase();
}
export function isForbiddenHeaderName(name: string): boolean {
  return forbiddenHeaderNames
    .some((v) => v === getNormalizedHeaderName(name));
}

export function isForbiddenResponseHeaderName(name: string): boolean {
  return forbiddenResponseHeaderNames
    .some((v) => v === getNormalizedHeaderName(name));
}

export function isSimpleHeader(name: string, value?: string): boolean {
  const isSimpleHeaderName = simpleHeaderNames
    .map(this.getNormalizedHeaderName)
    .some((v) => v === getNormalizedHeaderName(name));
  // If the simple headername is a Content-Type
  if (isSimpleHeaderName && value &&
    getNormalizedHeaderName(name) === "content-type") {
    return simpleHeaderMIMETypes.some((v) => v === value);
  }
  return isSimpleHeaderName;
}
