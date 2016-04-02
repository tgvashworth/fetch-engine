"use strict";
var baseconf = require("./karma.base.conf");
module.exports = function (config) {
    config.set(Object.assign({}, baseconf, {
        browserStack: {
            username: process.env.BROWSERSTACK_USERNAME,
            accessKey: process.env.BROWSERSTACK_KEY
        },
        customLaunchers: {
            bs_edge_win: {
                base: "BrowserStack",
                browser: "edge",
                browser_version: "13",
                os: "Windows",
                os_version: "10"
            }
        },
        browsers: ["bs_edge_win"] // , "bs_safari_mac"]
    }));
};
