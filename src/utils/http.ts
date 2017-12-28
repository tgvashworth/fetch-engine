const methods = ["DELETE", "GET", "HEAD", "OPTIONS", "POST", "PUT"];
const redirectStatuses = [301, 302, 303, 307, 308];

export function normalizeMethod(method): string {
  const upcased = method.toUpperCase();
  return (methods.indexOf(upcased) > -1) ? upcased : method;
}

export function isValidRedirectStatus(status): boolean {
  return redirectStatuses.some((v) => v === status);
}
