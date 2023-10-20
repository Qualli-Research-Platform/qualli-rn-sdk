"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var logger = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (__DEV__) {
        // eslint-disable-next-line no-console
        console.log.apply(console, args);
    }
};
exports.default = logger;
