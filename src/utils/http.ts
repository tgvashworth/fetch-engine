/// <reference path="../.d.ts"/>
"use strict";

const methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];

export function normalizeMethod(method): string {
  let upcased = method.toUpperCase();
  return (methods.indexOf(upcased) > -1) ? upcased : method;
}
