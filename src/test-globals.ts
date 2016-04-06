/// <reference path="./.d.test.ts" />
import { Promise } from "es6-promise";
// TS hack to allow us to add promise to the global
// http://stackoverflow.com/a/12703866/916334
(<any>global).Promise = Promise;
