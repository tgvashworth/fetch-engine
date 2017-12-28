import fetch from "./fetch/fetch-browser";
import makeFetchEngine from "./fetchEngine";
import FetchGroup from "./FetchGroup";

const fetchEngine = makeFetchEngine(fetch);
export default fetchEngine;
export { FetchGroup };
