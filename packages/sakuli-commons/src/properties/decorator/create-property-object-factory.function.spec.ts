import { PropertyMap } from "../model";
import {
  createPropertyMapMock,
  DecoratedBooleanTestClass,
  DecoratedTestClass,
} from "../__mocks__";
import { createPropertyObjectFactory } from "./create-property-object-factory.function";

describe("createPropertyMap", () => {
  let propertyMap: PropertyMap;
  let propertyFactory: ReturnType<typeof createPropertyObjectFactory>;
  beforeEach(() => {
    propertyMap = createPropertyMapMock({
      "my.property.path": "foo",
      "property.alt": "foobar",
      "read.as.number": "3",
      "read.as.object": { a: "foo" },
      "read.as.object.string": "bar",
      "my.little.list": "a, b, c",
      "my.real.list": ["a", "b", "c"],
    });
    propertyFactory = createPropertyObjectFactory(propertyMap);
  });

  it("should create an object with all decorated props set", () => {
    const properties = propertyFactory(DecoratedTestClass);

    expect(properties).toEqual(
      expect.objectContaining({
        property: "foo",
        property2: "foobar",
        simpleProperty: "",
        neverMapped: "default",
        readAsNumber: 3,
        readAsObject: expect.objectContaining({ a: "foo" }),
        readAsObjectString: expect.objectContaining(new String("bar")),
        myLittleList: expect.arrayContaining(["a", "b", "c"]),
        myRealList: expect.arrayContaining(["a", "b", "c"]),
      })
    );
  });
});

describe("boolean properties", () => {
  it.each(<[string | number | null | undefined, boolean][]>[
    ["false", false],
    ["", false],
    [0, false],
    [undefined, false],
    [null, false],
    ["true", true],
    ["set", true],
    [1, true],
  ])(
    "should convert %p to correct value %p",
    (input: any, expected: boolean) => {
      const propertyMap = createPropertyMapMock({
        "boolean.prop": input,
      });
      const propertyFactory = createPropertyObjectFactory(propertyMap);
      const properties = propertyFactory(DecoratedBooleanTestClass);

      expect(properties).toEqual(
        expect.objectContaining({
          booleanProp: expected,
        })
      );
    }
  );
});
