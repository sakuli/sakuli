export const toPromise = <T>(v: T) => Promise.resolve(v);

export type Operator<T, R = T> = (src: AsyncIterableIterator<T>) => AsyncIterableIterator<R>

export function filter<T>(predicate: (v: T) => boolean): Operator<T> {
    return async function* (src) {
        for await (const v of src) {
            if (predicate(v)) {
                yield v;
            }
        }
    }
}

export function switchFilter<T>(predicate: (v: T) => Promise<boolean>): Operator<T> {
    return async function* (src) {
        for await (const v of src) {
            if (await predicate(v)) {
                yield v;
            }
        }
    }
}

export function map<T, R>(mapper: (v:T) => R): Operator<T, R> {
    return async function* (src) {
        for await (const v of src) {
            yield mapper(v);
        }
    }
}

export function intersect<T>(
    src2: AsyncIterableIterator<T>,
    predicate: (a:T, b:T) => boolean = (a:T, b:T) => a === b
): Operator<T> {
    return async function* (src) {
        const arrB = await toArray(src2);
        for await(const v of src) {
            if(!!arrB.find(b => predicate(v, b))) {
                yield v;
            }
        }
    }
}

export function switchMap<T, R = T>(mapper: (v:T) => Promise<R>): Operator<T, R> {
    return async function* (src) {
        for await (const v of src) {
            yield await mapper(v);
        }
    }
}

export async function toArray<T>(it: AsyncIterableIterator<T>): Promise<T[]> {
    const values = [];
    for await(const v of it) {
        values.push(v);
    }
    return values;
}

export async function* fromPromises<T>(src: Promise<T>[]): AsyncIterableIterator<T> {
    for (let p of src) {
        yield await p;
    }
}

export async function* fromArray<T>(src: T[]): AsyncIterableIterator<T> {
    return fromPromises(src.map(e => Promise.resolve(e)));
}