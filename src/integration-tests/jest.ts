import * as url from "url";
import makeServer from "./server";

const servers = [];
// tslint:disable:no-var-requires
const jestUrl = require("../../package.json").jest.testEnvironmentOptions.url;
const parsedJestUrl = url.parse(jestUrl);

const SAME_ORIGIN_PORT = parseInt(parsedJestUrl.port, 10);
const CROSS_ORIGIN_PORT = SAME_ORIGIN_PORT + 1;

beforeAll(() => {
  servers.push(makeServer({ port: `${SAME_ORIGIN_PORT}` }));
  servers.push(makeServer({ port: `${CROSS_ORIGIN_PORT}` }));
  return Promise.all(servers.map((s) => s.start()));
});

afterAll(() => {
  return Promise.all(servers.map((s) => s.stop()));
});

const ORIGIN = `http://localhost:${SAME_ORIGIN_PORT}`;
const SAME_ORIGIN = `http://localhost:${SAME_ORIGIN_PORT}`;
const CROSS_ORIGIN = `http://localhost:${CROSS_ORIGIN_PORT}`;

export { ORIGIN, SAME_ORIGIN, CROSS_ORIGIN };
