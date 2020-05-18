import { CliArgsSource } from "./cli-args-source.class";
import { PropertyMap } from "../../model/property-map.interface";

describe.skip("CliArgsSource", () => {
  let cliArgs: CliArgsSource;
  let map: PropertyMap;
  beforeEach(async () => {
    cliArgs = new CliArgsSource([
      "--option.test",
      "option-test",
      "--option",
      "option",
      "--option.test.foo",
      "option-test-foo",
    ]);
    map = await cliArgs.createPropertyMap();
  });

  it.each([
    ["option.test", "option-test"],
    ["option", "option"],
    ["option.test.foo", "option-test-foo"],
  ])(
    "should find key %s with value %s",
    async (key: string, expectedValue: string) => {
      expect(map.get(key)).toEqual(expectedValue);
    }
  );
});
