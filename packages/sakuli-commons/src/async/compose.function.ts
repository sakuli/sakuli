/**
 * Creates a pipeline of functions.
 * @param func first function
 * @param funcs additional functions
 */

export type FN<T, R> = (v: T) => R;

export function compose<T, R>(f1: FN<T, R>): FN<T, R>;
export function compose<T, R, I>(f1: FN<T, I>, f2: FN<I, R>): FN<T, R>;
export function compose<T, R, I, I2>(f1: FN<T, I>, f2: FN<I, I2>, f3: FN<I2, R>): FN<T, R>;
export function compose<T, R, I, I2, I3>(f1: FN<T, I>, f2: FN<I, I2>, f3: FN<I2, I3>, f4: FN<I3, R>): FN<T, R>;
export function compose<T, R, I, I2, I3, I4>(f1: FN<T, I>, f2: FN<I, I2>, f3: FN<I2, I3>, f4: FN<I3, I4>, f5: FN<I4, R>): FN<T, R>;
export function compose<T, R, I, I2, I3, I4, I5>(f1: FN<T, I>, f2: FN<I, I2>, f3: FN<I2, I3>, f4: FN<I3, I4>, f5: FN<I4, I5>, f6: FN<I5, R>): FN<T, R>;
export function compose<T, R, I, I2, I3, I4, I5, I6>(f1: FN<T, I>, f2: FN<I, I2>, f3: FN<I2, I3>, f4: FN<I3, I4>, f5: FN<I4, I5>, f6: FN<I5, I6>, f7: FN<I6, R>): FN<T, R>;
export function compose<T, R>(f1: FN<T, R>, ...fns: FN<any, any>[]): FN<T, R> {
    return (v: T) => [f1, ...fns].reduce((g, f: FN<any, any>) => f(g), v);
}