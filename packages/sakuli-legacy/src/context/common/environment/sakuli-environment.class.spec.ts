import { createTestExecutionContextMock } from "../../__mocks__";
import { mockPartial } from "sneer";
import { Project } from "@sakuli/core";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";
import * as actions from "../actions";
import { createEnvironmentClass } from "./sakuli-environment.class";
import { ScreenApi } from "../actions";
import { createRegionClass } from "../region";

jest.mock("../actions");

describe("sakuli environment", () => {
  const testExecutionContextMock = createTestExecutionContextMock();
  const projectMock = mockPartial<Project>({
    objectFactory: jest.fn().mockReturnValue(new LegacyProjectProperties()),
  });
  const sakuliEnvironmentClass = createEnvironmentClass(
    testExecutionContextMock,
    projectMock
  );
  const sakuliRegionClass = createRegionClass(
    testExecutionContextMock,
    projectMock
  );
  const sakuliEnvironment = new sakuliEnvironmentClass();

  const mouseApi = actions.createMouseApi(new LegacyProjectProperties());

  let runAsActionSpy = jest.spyOn(actions, "runAsAction");

  it("should scroll down on mouseWheelDown", async () => {
    //GIVEN
    const numberOfSteps = 42;

    //WHEN
    const environment = await sakuliEnvironment.mouseWheelDown(numberOfSteps);

    //THEN
    expect(mouseApi.scrollDown).toBeCalledWith(numberOfSteps);
    expect(environment).toBeInstanceOf(sakuliEnvironmentClass);
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "mouseWheelDown",
      expect.any(Function)
    );
  });

  it("should scroll up on mouseWheelUp", async () => {
    //GIVEN
    const numberOfSteps = 42;

    //WHEN
    const environment = await sakuliEnvironment.mouseWheelUp(numberOfSteps);

    //THEN
    expect(mouseApi.scrollUp).toBeCalledWith(numberOfSteps);
    expect(environment).toBeInstanceOf(sakuliEnvironmentClass);
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "mouseWheelUp",
      expect.any(Function)
    );
  });

  it("should invoke ScreenApi on getRegionFromFocusedWindow", async () => {
    //GIVEN
    const expectedRegion = new sakuliRegionClass(10, 20, 30, 40);

    //WHEN
    const resultRegion = await sakuliEnvironment.getRegionFromFocusedWindow();

    //THEN
    expect(ScreenApi.getRegionFromFocusedWindow).toBeCalledTimes(1);
    expect(resultRegion).toEqual(expectedRegion);
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "getRegionFromFocusedWindow",
      expect.any(Function)
    );
  });
});
