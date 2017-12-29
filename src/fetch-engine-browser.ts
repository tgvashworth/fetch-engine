import fetch from "./fetch/fetch-browser";
import makeFetchEngine from "./fetchEngine";
import FetchGroup from "./FetchGroup";

export default makeFetchEngine(fetch);
export { FetchGroup };
