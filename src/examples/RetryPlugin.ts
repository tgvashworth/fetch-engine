export default class RetryPlugin {
  public getResponse(response, retry) {
    if (response.status === 503) {
      return retry();
    } else {
      return response;
    }
  }
}
