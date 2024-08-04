"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mypromise_1 = __importDefault(require("./mypromise"));
const adapter = {
    deferred() {
        let resolve;
        let reject;
        const promise = new mypromise_1.default((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return {
            promise,
            resolve: resolve,
            reject: reject,
        };
    }
};
exports.default = adapter;
