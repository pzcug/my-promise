type Executor<T> = (resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void) => void;

class MyPromise<T> {
    private state: 'pending' | 'fulfilled' | 'rejected' = 'pending';
    private value: T | undefined;
    private reason: any;
    private onFulfilledCallbacks: Array<(value: T) => void> = [];
    private onRejectedCallbacks: Array<(reason: any) => void> = [];

    constructor(executor: Executor<T>) {
        //PromiseA+ 2.1
        const resolve = (value: T | PromiseLike<T>) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value as T;
                //PromiseA+ 2.2.6.1
                this.onFulfilledCallbacks.forEach(callback => callback(this.value as T));
            }
        };

        const reject = (reason: any) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                //PromiseA+ 2.2.6.2
                this.onRejectedCallbacks.forEach(callback => callback(this.reason));
            }
        };

        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error);
        }
    }

    then(
        onFulfilled?: any,
        onRejected?: any
    ): MyPromise<T> {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : (value: any) => value
        onRejected = typeof onRejected === 'function' ? onRejected : (reason:any) => { throw reason }
        //PromiseA+ 2.2.7
        let promise2 = new MyPromise<T>((resolve, reject) => {
        if (this.state === 'fulfilled') {
            //PromiseA+ 2.2.2
            //PromiseA+ 2.2.4 --- setTimeout
            setTimeout(() => {
                try {
                    //PromiseA+ 2.2.7.1
                    let x = onFulfilled(this.value)
                    this.resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    //PromiseA+ 2.2.7.2
                    reject(e)
                }
            });
        } else if (this.state === 'rejected') {
            //PromiseA+ 2.2.3
            setTimeout(() => {
                try {
                    let x = onRejected(this.reason)
                    this.resolvePromise(promise2, x, resolve, reject)
                } catch (e) {
                    reject(e)
                }
            });
        } else if (this.state === 'pending') {
            this.onFulfilledCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        this.resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                })
            })
            this.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason);
                        this.resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e);
                    }
                });
            });
        }
        });
        return promise2;
    }
    private resolvePromise(promise2: MyPromise<T>, x: any, resolve: any, reject:any) {
        //PromiseA+ 2.3.1
        if (promise2 === x) {
            reject(new TypeError('TypeError'))
        }
        if (x && typeof x === 'object' || typeof x === 'function') {
            //PromiseA+2.3.3.3.3
            let used: boolean = false
            try {
                let then = x.then;
                if (typeof then === 'function') {
                    //PromiseA+2.3.3
                    then.call(x, (y: any) => {
                        //PromiseA+2.3.3.1
                        if (used) return
                        used = true
                        this.resolvePromise(promise2, y, resolve, reject)
                    }, (r: any) => {
                        //PromiseA+2.3.3.2
                        if (used) return
                        used = true
                        reject(r)
                    })

                }else{
                    //PromiseA+2.3.3.4
                    if (used) return
                    used = true
                    resolve(x)
                }
            } catch (e) {
                //PromiseA+ 2.3.3.2
                if (used) return
                used = true
                reject(e)
            }
        } else {
            //PromiseA+ 2.3.3.4
            resolve(x)
        }
    }
}

export default MyPromise;
