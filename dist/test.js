"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_1 = __importDefault(require("./adapter"));
const promises_aplus_tests_1 = __importDefault(require("promises-aplus-tests"));
(0, promises_aplus_tests_1.default)(adapter_1.default, function (err) {
    if (err) {
        console.error(err);
    }
    else {
        console.log('All tests passed');
    }
});
