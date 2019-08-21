
export function wrap<ARGS extends any[], R>(original: (...args: ARGS) => R, wrapper: (original: (...args: ARGS) => R, ...args: ARGS) => R): (...args: ARGS) => R {
    return (...args) => {
        return wrapper(original, ...args);
    }
}

