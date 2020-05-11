import { PropertyMap } from "../../model";
import { EnvironmentSource } from "./env-source.class";

describe("EnvironmentSource", () => {
  let envArgs: EnvironmentSource;
  let map: PropertyMap;
  beforeEach(async () => {
    process.env.first_key = "foo";
    process.env.second_key = "bar";
    process.env.third_key = "baz";
    envArgs = new EnvironmentSource();
    map = await envArgs.createPropertyMap();
  });

  it.each([
    ["first_key", "foo"],
    ["second_key", "bar"],
    ["third_key", "baz"],
  ])(
    "should find key %s with value %s",
    async (key: string, expectedValue: string) => {
      expect(map.get(key)).toEqual(expectedValue);
    }
  );
});
