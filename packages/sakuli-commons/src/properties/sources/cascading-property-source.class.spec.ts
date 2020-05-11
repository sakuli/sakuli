import { CascadingPropertyMap } from "./cascading-property-source.class";
import { PropertySource } from "../model";
import { createPropertySourceMock } from "../__mocks__";

describe(CascadingPropertyMap.name, () => {
  let cascadingMap: CascadingPropertyMap;
  let src1: PropertySource;
  let src2: PropertySource;
  beforeEach(async () => {
    cascadingMap = new CascadingPropertyMap();
    src1 = createPropertySourceMock({
      prop1: "foo",
      prop2: "bar",
    });
    src2 = createPropertySourceMock({
      prop2: "overridden",
    });
    await cascadingMap.installSource(src1);
    await cascadingMap.installSource(src2);
  });

  it("should call createPropertyMap for each source", () => {
    expect(src1.createPropertyMap).toHaveBeenCalled();
    expect(src2.createPropertyMap).toHaveBeenCalled();
  });

  it("should get value from second property source", () => {
    expect(cascadingMap.get("prop2")).toEqual("overridden");
  });
});
