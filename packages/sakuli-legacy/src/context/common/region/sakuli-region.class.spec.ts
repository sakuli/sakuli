import { createRegionClass } from "./sakuli-region.class";
import { createTestExecutionContextMock } from "../../__mocks__";
import { mockPartial } from "sneer";
import { Project } from "@sakuli/core";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";
import * as actions from "../actions";
import { MouseButton } from "../button.class";
import any = jasmine.any;
import { Region } from "./region.interface";

jest.mock("../actions");

describe("sakuli region class", () => {
  const testExecutionContextMock = createTestExecutionContextMock();
  const sakuliRegionClass = createRegionClass(
    testExecutionContextMock,
    mockPartial<Project>({
      objectFactory: jest.fn().mockReturnValue(new LegacyProjectProperties()),
    })
  );
  const sakuliRegion = new sakuliRegionClass();

  const mouseApi = actions.createMouseApi(new LegacyProjectProperties());
  actions.ScreenApi.highlight = jest.fn(
    (regionToHighlight: Region) =>
      new Promise<Region>((res) => res(regionToHighlight))
  );

  let runAsActionSpy = jest.spyOn(actions, "runAsAction");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should forward clicks to mouse api", async () => {
    //WHEN
    const region = await sakuliRegion.click();

    //THEN
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "click",
      any(Function)
    );
    expect(mouseApi.move).toBeCalledWith(sakuliRegion);
    expect(mouseApi.click).toBeCalled();
    expect(region).toBeInstanceOf(sakuliRegionClass);
  });

  it("should forward double clicks to mouse api", async () => {
    //WHEN
    const region = await sakuliRegion.doubleClick();

    //THEN
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "doubleClick",
      any(Function)
    );
    expect(mouseApi.move).toBeCalledWith(sakuliRegion);
    expect(mouseApi.doubleClick).toBeCalled();
    expect(region).toBeInstanceOf(sakuliRegionClass);
  });

  it("should forward right clicks to mouse api", async () => {
    //WHEN
    const region = await sakuliRegion.rightClick();

    //THEN
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "rightClick",
      any(Function)
    );
    expect(mouseApi.move).toBeCalledWith(sakuliRegion);
    expect(mouseApi.rightClick).toBeCalled();
    expect(region).toBeInstanceOf(sakuliRegionClass);
  });

  it("should press given mouse button on mouseDown", async () => {
    //GIVEN
    const button = MouseButton.MIDDLE;

    //WHEN
    const region = await sakuliRegion.mouseDown(button);

    //THEN
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "mouseDown",
      any(Function)
    );
    expect(mouseApi.pressButton).toBeCalledWith(button);
    expect(region).toBeInstanceOf(sakuliRegionClass);
  });

  it("should release given mouse button on mouseUp", async () => {
    //GIVEN
    const button = MouseButton.LEFT;

    //WHEN
    const region = await sakuliRegion.mouseUp(button);

    //THEN
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "mouseUp",
      any(Function)
    );
    expect(mouseApi.releaseButton).toBeCalledWith(button);
    expect(region).toBeInstanceOf(sakuliRegionClass);
  });

  it("should drag and drop to target region", async () => {
    //WHEN
    const region = await sakuliRegion.dragAndDropTo(sakuliRegion);

    //THEN
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "dragAndDropTo",
      any(Function)
    );
    expect(mouseApi.dragAndDrop).toBeCalledWith(sakuliRegion);
    expect(region).toBeInstanceOf(sakuliRegionClass);
  });

  it("should scroll down on mouseWheelDown", async () => {
    //GIVEN
    const numberOfSteps = 42;

    //WHEN
    const region = await sakuliRegion.mouseWheelDown(numberOfSteps);

    //THEN
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "mouseWheelDown",
      any(Function)
    );
    expect(mouseApi.scrollDown).toBeCalledWith(numberOfSteps);
    expect(region).toBeInstanceOf(sakuliRegionClass);
  });

  it("should scroll up on mouseWheelUp", async () => {
    //GIVEN
    const numberOfSteps = 42;

    //WHEN
    const region = await sakuliRegion.mouseWheelUp(numberOfSteps);

    //THEN
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "mouseWheelUp",
      any(Function)
    );
    expect(mouseApi.scrollUp).toBeCalledWith(numberOfSteps);
    expect(region).toBeInstanceOf(sakuliRegionClass);
  });

  it("should move to specified destination", async () => {
    //GIVEN
    const destination = new sakuliRegionClass(42, 84, 21, 168);

    //WHEN
    await sakuliRegion.moveTo(destination);

    //THEN
    expect(mouseApi.move).toBeCalledWith(destination);
  });

  it("should highlight a specified region", async () => {
    //GIVEN
    const highlightDuration = 3;

    //WHEN
    const result = await sakuliRegion.highlight(highlightDuration);

    //THEN
    expect(runAsActionSpy).toBeCalledWith(
      testExecutionContextMock,
      "highlight",
      any(Function)
    );
    expect(actions.ScreenApi.highlight).toBeCalledTimes(1);
    expect(actions.ScreenApi.highlight).toBeCalledWith(
      sakuliRegion,
      highlightDuration
    );
    expect(result).toEqual(sakuliRegion);
  });
});
