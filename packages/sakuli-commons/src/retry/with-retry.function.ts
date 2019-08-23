

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
