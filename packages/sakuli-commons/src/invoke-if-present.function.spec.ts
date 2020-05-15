import { Maybe } from "./maybe";
import { invokeIfPresent } from "./invoke-if-present.function";

describe("invokeIfPresent", () => {
  let fn: Maybe<(a: number, b: number) => number>;

  afterEach(() => {
    fn = undefined;
  });

  it("should invoke a present function", () => {
    fn = jest.fn().mockReturnValue(42);
    const result = invokeIfPresent(fn, 4, 2);
    expect(result).toBe(42);
    expect(fn).toHaveBeenCalledWith(4, 2);
  });

  it("should ignore a absent function", () => {
    const result = invokeIfPresent(fn, 4, 2);
    expect(result).toBeUndefined();
  });
});
