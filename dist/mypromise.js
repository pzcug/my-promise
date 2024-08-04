"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MyPromise {
    constructor(executor) {
        this.state = 'pending';
        this.onFulfilledCallbacks = [];
        this.onRejectedCallbacks = [];
        //PromiseA+ 2.1
        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                //PromiseA+ 2.2.6.1
                this.onFulfilledCallbacks.forEach(callback => callback(this.value));
            }
        };
        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                //PromiseA+ 2.2.6.2
                this.onRejectedCallbacks.forEach(callback => callback(this.reason));
            }
        };
        try {
            executor(resolve, reject);
        }
        catch (error) {
            reject(error);
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value) => value;
        onRejected = typeof onRejected === 'function' ? onRejected : (reason) => { throw reason; };
        //PromiseA+ 2.2.7
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                //PromiseA+ 2.2.2
                //PromiseA+ 2.2.4 --- setTimeout
                setTimeout(() => {
                    try {
                        //PromiseA+ 2.2.7.1
                        let x = onFulfilled(this.value);
                        this.resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        //PromiseA+ 2.2.7.2
                        reject(e);
                    }
                });
            }
            else if (this.state === 'rejected') {
                //PromiseA+ 2.2.3
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        this.resolvePromise(promise2, x, resolve, reject);
                    }
                    catch (e) {
                        reject(e);
                    }
                });
            }
            else if (this.state === 'pending') {
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value);
                            this.resolvePromise(promise2, x, resolve, reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                });
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason);
                            this.resolvePromise(promise2, x, resolve, reject);
                        }
                        catch (e) {
                            reject(e);
                        }
                    });
                });
            }
        });
        return promise2;
    }
    resolvePromise(promise2, x, resolve, reject) {
        //PromiseA+ 2.3.1
        if (promise2 === x) {
            reject(new TypeError('TypeError'));
        }
        if (x && typeof x === 'object' || typeof x === 'function') {
            //PromiseA+2.3.3.3.3
            let used = false;
            try {
                let then = x.then;
                if (typeof then === 'function') {
                    //PromiseA+2.3.3
                    then.call(x, (y) => {
                        //PromiseA+2.3.3.1
                        if (used)
                            return;
                        used = true;
                        this.resolvePromise(promise2, y, resolve, reject);
                    }, (r) => {
                        //PromiseA+2.3.3.2
                        if (used)
                            return;
                        used = true;
                        reject(r);
                    });
                }
                else {
                    //PromiseA+2.3.3.4
                    if (used)
                        return;
                    used = true;
                    resolve(x);
                }
            }
            catch (e) {
                //PromiseA+ 2.3.3.2
                if (used)
                    return;
                used = true;
                reject(e);
            }
        }
        else {
            //PromiseA+ 2.3.3.4
            resolve(x);
        }
    }
}
exports.default = MyPromise;
