export interface DeferredValue<T> {
    resolve(result: T): void;
    reject(reason?: any): void;
    promise: Promise<T>
}

export function deferred<T>(): DeferredValue<T> {
    let resolve: (result: T) => void = res => {};
    let reject: (reason?: any) => void = reason => {};
    const promise = new Promise<T>((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return ({
       resolve, reject, promise
    })
}