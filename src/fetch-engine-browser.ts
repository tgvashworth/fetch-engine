import fetch from "./fetch/fetch-browser";
import makeFetchEngine from "./fetchEngine";
import FetchGroup from "./FetchGroup";
import makeFetchGroup from "./makeFetchGroup";

export default makeFetchEngine(fetch);
export { FetchGroup, makeFetchGroup };
