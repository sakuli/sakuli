import { Maybe } from ".";
import { ifPresent } from "./maybe";

export function invokeIfPresent<ARGS extends any[], R>(
  maybeFn: Maybe<(...args: ARGS) => R>,
  ...args: ARGS
): Maybe<R> {
  return ifPresent(
    maybeFn,
    (fn) => fn(...args),
    () => undefined
  );
}
