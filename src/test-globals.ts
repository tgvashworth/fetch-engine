import { Promise } from "es6-promise";
// tslint:disable:no-var-requires
require("isomorphic-fetch");
// TS hack to allow us to add promise to the global
// http://stackoverflow.com/a/12703866/916334
(global as any).Promise = Promise;
