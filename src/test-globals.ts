/* tslint:disable */
/// <reference path="./.d.test.ts" />
import es6Promise = require("es6-promise");
// TS hack to allow us to add promise to the global
// http://stackoverflow.com/a/12703866/916334
(<any>global).Promise = es6Promise.Promise;

require("./test-server/collector-client");
