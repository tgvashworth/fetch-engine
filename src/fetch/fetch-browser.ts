export default function fetch(request: Request): Promise<Response> {
  return window.fetch(request);
}
