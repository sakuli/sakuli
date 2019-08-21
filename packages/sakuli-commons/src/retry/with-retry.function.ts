

export type VariadicAsyncFunction<ARGS extends any[], R> = (...args: ARGS) => Promise<R>;
export type VariadicAsyncFunctionWrapper<ARGS extends any[], OR, R = OR> = (original: VariadicAsyncFunction<ARGS, OR>, ...args: ARGS) => Promise<R>;

export const withRetry = <ARGS extends any[], R>(retries: number, handleError: VariadicAsyncFunctionWrapper<ARGS, R, void> = () => Promise.resolve()): VariadicAsyncFunctionWrapper<ARGS, R> => {
    return async (original: VariadicAsyncFunction<ARGS, R>, ...args: ARGS): Promise<R> => {
        while(retries--) {
            try {
                return await original(...args);
            } catch(e) {
                handleError(original, ...args);
            }
        }
        throw Error('no more retries');
    }
}
