import { createTestExecutionContextMock } from "../../__mocks__";
import { mockPartial } from "sneer";
import { Project } from "@sakuli/core";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";
import * as runAsActionFunctionMock from "../actions/__mocks__/action.function";
import * as actions from "../actions";
import { ScreenApi } from "../actions";
import { createEnvironmentClass } from "./sakuli-environment.class";
import { createRegionClass } from "../region";
import { Key } from "..";
import {
  registerKeyboardPressKeys,
  registerKeyboardReleaseKeys,
} from "../button-registry";

jest.mock("../actions");
jest.mock("../button-registry");

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

  const keyboardApi = actions.createKeyboardApi(new LegacyProjectProperties());

  let runAsActionSpy = jest.spyOn(runAsActionFunctionMock, "runAsAction");

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

  it("should invoke keyboardApi and button registry on keyDown", async () => {
    //GIVEN
    const keysToPress = [Key.CTRL, Key.P];

    //WHEN
    const resultEnvironment = await sakuliEnvironment.keyDown(keysToPress);

    //THEN
    expect(keyboardApi.pressKey).toBeCalledWith(keysToPress);
    expect(registerKeyboardPressKeys).toBeCalledWith(keysToPress);
    expect(resultEnvironment).toEqual(sakuliEnvironment);
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "keyDown",
      expect.any(Function)
    );
  });

  it("should invoke keyboardApi and button registry on keyUp", async () => {
    //GIVEN
    const keysToPress = [Key.ALT, Key.P];

    //WHEN
    const resultEnvironment = await sakuliEnvironment.keyUp(keysToPress);

    //THEN
    expect(keyboardApi.releaseKey).toBeCalledWith(keysToPress);
    expect(registerKeyboardReleaseKeys).toBeCalledWith(keysToPress);
    expect(resultEnvironment).toEqual(sakuliEnvironment);
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "keyUp",
      expect.any(Function)
    );
  });

  it("should throw exception on execute if configured", async () => {
    //GIVEN
    (actions.execute as jest.Mock).mockImplementation(() => {
      return {
        getExitCode: jest.fn(() => 1),
        getOutput: jest.fn(() => "Am I a joke to you? T_T"),
      };
    });
    const shouldThrowError = true;

    //WHEN
    const command = async () =>
      await sakuliEnvironment.runCommand("", shouldThrowError);

    //THEN
    await expect(command).rejects.toThrowError(
      "Command execution failed with exit code '1'"
    );
  });
});
