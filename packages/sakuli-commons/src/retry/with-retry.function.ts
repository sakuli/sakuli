
/**
 * Utility Type-Alias for variadic functions that returns a promise.
 *
 * A variadic function is a function of type `VF<ARGS extends any[], R> = (...args: ARGS) => R`
 * A generic type parameter which extends `any[]` and is applied to a spreaded args parameter i useful
 * for TypeScript to dynamically infer the arguments of a function.
 * That is very useful to create higher order functions.
 *
 * @example
 * ```typescript
 * type VF<ARGS extends any[], R> = (...args: ARGS) => R;
 * const withExclamationMark = <ARGS extends any[], R>(fn: VF<ARGS, R>): VF<ARGS, R> => {
 *     return (...args: ARGS) => {
 *         const result = fn(...args);
 *         console.log('!');
 *         return result;
 *     }
 * }
 * const saySomething = (something: string) => console.log(something);
 *
 * const saySomethingImportant = withExclamationMark(saySomething);
 *
 * console.log('Say something:');
 * saySomething('not important'); // prints: not important
 *
 * console.log('Say something important:');
 * saySomethingImportant('Very important'); // prints: Very important\n!
 *
 * saySomethingImportant(5); // TS-Error: Argument of type '5' is not assignable to parameter of type 'string'.
 * ```
 *
 */
export type VariadicAsyncFunction<ARGS extends any[], R> = (...args: ARGS) => Promise<R>;
export type VariadicAsyncFunctionWrapper<ARGS extends any[], OR, R = OR> = (original: VariadicAsyncFunction<ARGS, OR>, ...args: ARGS) => Promise<R>;

/**
 *
 * @param retries - number of attempts until it fails (1 = 1 attempt --> no real retry at all)
 * @param bailOn - when the result of this function rejects, the retrying will be aborted
 */
export const withRetry = <ARGS extends any[], R>(retries: number, bailOn: (e: Error, original: VariadicAsyncFunction<ARGS, R>, ...args: ARGS) => Promise<void> = () => Promise.resolve()): VariadicAsyncFunctionWrapper<ARGS, R> => {
    return async (original: VariadicAsyncFunction<ARGS, R>, ...args: ARGS): Promise<R> => {
        while(retries--) {
            try {
                return await original(...args);
            } catch(e) {
               await bailOn(e, original, ...args)
            }
        }
        throw Error('no more retries');
    }
}
