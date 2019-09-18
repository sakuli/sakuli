/**
 *
 * Util wrap sideeffects around a function
 *
 * @example
 * ```typescript
 * const unsafe = (i: number): number => {
 *   if(i === 42) {
 *     return i;
 *   }
 *   throw Error('Not the meaning of life');
 * }
 *
 * const safe = wrap(unsafe, (orig, i) => {
 *   try {
 *     return orig(i)
 *   } catch(e) {
 *     return NaN;
 *   }
 * })
 *
 * console.log(safe(43)); // prints: NaN
 * console.log(unsafe(43)); // throws an error
 * ```
 *
 * @param original - The function which should be wrapped
 * @param wrapper - The actual code that is executed around a function
 */
export function wrap<ARGS extends any[], R>(original: (...args: ARGS) => R, wrapper: (original: (...args: ARGS) => R, ...args: ARGS) => R): (...args: ARGS) => R {
    return (...args) => {
        return wrapper(original, ...args);
    }
}

