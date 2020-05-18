import { DecoratedClassDefaultsSource } from "./decorated-class-defaults-source.class";
import { DecoratedTestClass } from "../../__mocks__";

describe("DecoratedClassDefaultsSource", () => {
  it("should create a map", async () => {
    const source = new DecoratedClassDefaultsSource(DecoratedTestClass);
    const map = await source.createPropertyMap();
    expect(map.get("never.read.this.prop")).toBe("default");
    expect(map.has("my.little.list")).toBeFalsy();
  });
});
