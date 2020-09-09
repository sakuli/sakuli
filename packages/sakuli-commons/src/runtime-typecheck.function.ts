/**
 * This function is useful for runtime typechecking
 *
 * Since the JS runtime does not care about types, it is possible for users to e.g. initialize objects in a wrong way,
 * causing errors during execution.
 * TypeScript can't help us here, so we have to provide our own typeguards during runtime.
 *
 * The reason why this function is implemented the way it is implemented and not just uses e.g. `typeof arg === 'string'` is the fact
 * that typeof will not handle everything as expected.
 * It's valid, although not common, to pass a `new String("foo")` object instead of just "foo" to a function, in which case typeof
 * would return 'object' instead of 'string'.
 *
 * The `typeRegex` used test the output of `Object.prototype.toString`, which would be `[object String]` in both cases (`new String("foo")` and `"foo"`)
 * So no matter whether a user passes a string literal or a String object, the typecheck will handle both cases.
 *
 * @param value The value to typecheck
 * @param type The expected runtime type, one of "Undefined" | "Object" | "Boolean" | "Number" | "BigInt" | "String" | "Symbol" | "Function"
 * @param message The TypeError message in case of a runtime type missmatch
 */
export const throwOnRuntimeTypeMissmatch = (
  value: any,
  type:
    | "Undefined"
    | "Object"
    | "Boolean"
    | "Number"
    | "BigInt"
    | "String"
    | "Symbol"
    | "Function",
  message: string
) => {
  const typeRegex = new RegExp(`^\\[object ${type}\\]$`);
  if (!typeRegex.test(Object.prototype.toString.call(value))) {
    throw new TypeError(message);
  }
};
