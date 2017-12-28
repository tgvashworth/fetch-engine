import fetch from "./fetch/fetch-node";
import makeFetchEngine from "./fetchEngine";
const fetchEngine = makeFetchEngine(fetch);
export default fetchEngine;
