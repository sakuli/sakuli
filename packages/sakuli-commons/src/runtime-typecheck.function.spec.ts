import { throwOnRuntimeTypeMissmatch } from "./runtime-typecheck.function";

describe("runtime typechecking", () => {
  describe("string typecheck", () => {
    it.each(<[string, any][]>[
      ["BigInt", BigInt(23)],
      ["Null", null],
      ["Undefined", undefined],
      ["number", 23],
      ["Number", Number(123)],
      ["Function", () => "foo"],
    ])(`should throw a TypeError on %s`, (_: string, value: any) => {
      // GIVEN
      const expectedError = `Not a string: ${value}`;

      // WHEN
      const SUT = () =>
        throwOnRuntimeTypeMissmatch(value, "String", expectedError);

      // THEN
      expect(SUT).toThrow(new TypeError(expectedError));
    });

    it.each(<[string, any][]>[
      ["String", String("valid String object")],
      ["string", "valid string literal"],
    ])(`should not throw on valid %s`, (_: string, value: any) => {
      // GIVEN

      // WHEN
      const SUT = () => throwOnRuntimeTypeMissmatch(value, "String", "");

      // THEN
      expect(SUT).not.toThrow();
    });
  });

  describe("number typecheck", () => {
    it.each(<[string, any][]>[
      ["BigInt", BigInt(23)],
      ["Null", null],
      ["Undefined", undefined],
      ["string", "foo"],
      ["String", String("string object")],
      ["Function", () => "foo"],
    ])(`should throw a TypeError on %s`, (_: string, value: any) => {
      // GIVEN
      const expectedError = `Not a string: ${value}`;

      // WHEN
      const SUT = () =>
        throwOnRuntimeTypeMissmatch(value, "Number", expectedError);

      // THEN
      expect(SUT).toThrow(new TypeError(expectedError));
    });

    it.each(<[string, any][]>[
      ["number", 123],
      ["Number", Number(42)],
    ])(`should not throw on valid %s`, (_: string, value: any) => {
      // GIVEN

      // WHEN
      const SUT = () => throwOnRuntimeTypeMissmatch(value, "Number", "");

      // THEN
      expect(SUT).not.toThrow();
    });
  });
});
