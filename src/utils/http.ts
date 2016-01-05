/// <reference path="../.d.ts"/>
"use strict";

const methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
const redirectStatuses = [301, 302, 303, 307, 308];

export function normalizeMethod(method): string {
  let upcased = method.toUpperCase();
  return (methods.indexOf(upcased) > -1) ? upcased : method;
}

export function isValidRedirectStatus(status): Boolean {
  return redirectStatuses.some(v => v === status);
}
