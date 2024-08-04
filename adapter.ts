import MyPromise from './mypromise';

const adapter = {
    deferred() {
        let resolve: (value?: any) => void;
        let reject: (reason?: any) => void;
        const promise = new MyPromise((res, rej) => {
            resolve = res;
            reject = rej;
        });
        return {
            promise,
            resolve: resolve!,
            reject: reject!,
        };
    }
};

export default adapter;
