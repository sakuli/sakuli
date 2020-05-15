import { Project } from "./project.class";
import { Maybe, Property, PropertyMap } from "@sakuli/commons";

describe("Project", () => {
  class TestProperties {
    @Property("testsuite.id") testSuiteId: Maybe<string>;
    @Property("forwarder.target") forwarderTarget: Maybe<string>;
    @Property("cascaded") cascaded: Maybe<string>;
  }

  let staticSakuliProperties = new Map([
    ["testsuite.id", "sakuli"],
    ["cascaded", "casc-1"],
  ]);
  let staticOtherProperties = new Map([
    ["forwarder.target", "${testsuite.id}"],
    ["cascaded", "casc-2"],
  ]);
  let projectUnderTest: Project;

  beforeEach(async () => {
    projectUnderTest = new Project("");
    await projectUnderTest.installPropertySource({
      createPropertyMap(): Promise<PropertyMap> {
        return Promise.resolve(staticSakuliProperties);
      },
    });
    await projectUnderTest.installPropertySource({
      createPropertyMap(): Promise<PropertyMap> {
        return Promise.resolve(staticOtherProperties);
      },
    });
  });
  it("should utilize templated values", () => {
    expect(projectUnderTest.get("forwarder.target")).toBe("sakuli");
  });

  it("should read from source1", () => {
    expect(projectUnderTest.get("testsuite.id")).toBe("sakuli");
  });

  it("should create a valid object from objectFactory", () => {
    const testProps = projectUnderTest.objectFactory(TestProperties);
    expect(testProps.forwarderTarget).toBe("sakuli");
    expect(testProps.testSuiteId).toBe("sakuli");
    expect(testProps.cascaded).toBe("casc-2");
  });
  it("should cascade values from installed sources", () => {
    expect(projectUnderTest.get("cascaded")).toBe("casc-2");
  });
});
