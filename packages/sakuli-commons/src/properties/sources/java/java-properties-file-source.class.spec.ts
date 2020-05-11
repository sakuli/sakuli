import { JavaPropertiesFileSource } from "./java-properties-file-source.class";
import { PropertyMap } from "../../model";
import { stripIndents } from "common-tags";

const MOCKED_FILES: Record<string, string> = {
  "props1.properties": stripIndents`
        property.foo=fooval
        property.bar=barval
        `,
  "props2.properties": stripIndents`
        property.bar=overridden
        property.baz=bazval
        `,
  "props3.properties": stripIndents`
        foo.bar.a=1
        foo.bar.b=2
    `,
};

jest.mock("fs", () => ({
  readFileSync: jest.fn((file: string) => Buffer.from(MOCKED_FILES[file])),
}));

describe(JavaPropertiesFileSource.name, () => {
  let propertyFileSource: JavaPropertiesFileSource;
  let map: PropertyMap;

  describe("multiple files", () => {
    beforeEach(async () => {
      propertyFileSource = new JavaPropertiesFileSource([
        "props1.properties",
        "props2.properties",
      ]);
      map = await propertyFileSource.createPropertyMap();
    });

    it.each([
      ["property.foo", "fooval"],
      ["property.bar", "overridden"],
      ["property.baz", "bazval"],
    ])(
      "should find property %s with value %s",
      (key: string, expectedValue: string) => {
        expect(map.get(key)).toEqual(expectedValue);
      }
    );
  });

  describe("complex values", () => {
    beforeEach(async () => {
      propertyFileSource = new JavaPropertiesFileSource(["props3.properties"]);
      map = await propertyFileSource.createPropertyMap();
    });
    it("should read a complex structure as object", async () => {
      expect(map.get("foo.bar")).toEqual({
        a: "1",
        b: "2",
      });
    });
  });
});
