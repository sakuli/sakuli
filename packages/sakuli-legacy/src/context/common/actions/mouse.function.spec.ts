import { Button as NutButton, mouse, MouseClass as Mouse, Point } from "@nut-tree/nut-js";
import { createMouseApi } from "./mouse.function";
import { SakuliRegion } from "./__mocks__/sakuli-region.class";
import { MouseButton } from "../button.class";
import { mockPartial } from "sneer";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";

beforeEach(() => {
  jest.resetAllMocks();
});

describe("mouseApi", () => {
  const mouseApi = createMouseApi(mockPartial<LegacyProjectProperties>({}));

  it("should call mouse once on click", async () => {
    // GIVEN
    mouse.leftClick = jest.fn();

    // WHEN
    await mouseApi.click();

    // THEN
    expect(mouse.leftClick).toHaveBeenCalledTimes(1);
  });

  it("should call mouse twice on doubleClick", async () => {
    // GIVEN
    mouse.leftClick = jest.fn();

    // WHEN
    await mouseApi.doubleClick();

    // THEN
    expect(mouse.leftClick).toHaveBeenCalledTimes(2);
  });

  it("should call mouse once on rightClick", async () => {
    // GIVEN
    mouse.rightClick = jest.fn();

    // WHEN
    await mouseApi.rightClick();

    // THEN
    expect(mouse.rightClick).toHaveBeenCalledTimes(1);
  });

  it.each([
    [MouseButton.LEFT, NutButton.LEFT],
    [MouseButton.MIDDLE, NutButton.MIDDLE],
    [MouseButton.RIGHT, NutButton.RIGHT],
  ] as Array<[MouseButton, NutButton]>)(
    "should press and release",
    async (actual: MouseButton, expected: NutButton) => {
      // GIVEN
      mouse.pressButton = jest.fn();
      mouse.releaseButton = jest.fn();

      // WHEN
      await mouseApi.pressButton(actual);
      await mouseApi.releaseButton(actual);

      // THEN
      expect(mouse.pressButton).toHaveBeenCalledTimes(1);
      expect(mouse.pressButton).toHaveBeenCalledWith(expected);
      expect(mouse.releaseButton).toHaveBeenCalledTimes(1);
      expect(mouse.releaseButton).toHaveBeenCalledWith(expected);
    }
  );

  it("should call mouse once on scrollUp", async () => {
    // GIVEN
    mouse.scrollUp = jest.fn();

    // WHEN
    await mouseApi.scrollUp(50);

    // THEN
    expect(mouse.scrollUp).toHaveBeenCalledTimes(1);
  });

  it("should call mouse once on scrollDown", async () => {
    // GIVEN
    mouse.scrollDown = jest.fn();

    // WHEN
    await mouseApi.scrollDown(50);

    // THEN
    expect(mouse.scrollDown).toHaveBeenCalledTimes(1);
  });

  it("should call mouse once on scrollLeft", async () => {
    // GIVEN
    mouse.scrollLeft = jest.fn();

    // WHEN
    await mouseApi.scrollLeft(50);

    // THEN
    expect(mouse.scrollLeft).toHaveBeenCalledTimes(1);
  });

  it("should call mouse once on scrollRight", async () => {
    // GIVEN
    mouse.scrollRight = jest.fn();

    // WHEN
    await mouseApi.scrollRight(50);

    // THEN
    expect(mouse.scrollRight).toHaveBeenCalledTimes(1);
  });

  it("should drag to the center of a target area", async () => {
    // GIVEN
    const source = new SakuliRegion(0, 0, 100, 100);
    const target = new Point(50, 50);
    let capturedArgument: Promise<Point[]> = Promise.resolve([]);
    mouse.drag = jest.fn(
      (param: Promise<Point[]>): Promise<Mouse> => {
        capturedArgument = param;
        return Promise.resolve(mouse);
      }
    );

    // WHEN
    await mouseApi.dragAndDrop(source);

    // THEN
    expect((await capturedArgument).pop()).toEqual(target);
    expect(mouse.drag).toBeCalledTimes(1);
  });

  it("should move to the center of a target area", async () => {
    // GIVEN
    const source = new SakuliRegion(0, 0, 100, 100);
    const target = new Point(50, 50);
    let capturedArgument: Promise<Point[]> = Promise.resolve([]);
    mouse.move = jest.fn(
      (param: Promise<Point[]>): Promise<Mouse> => {
        capturedArgument = param;
        return Promise.resolve(mouse);
      }
    );

    // WHEN
    await mouseApi.move(source);

    // THEN
    expect((await capturedArgument).pop()).toEqual(target);
    expect(mouse.move).toBeCalledTimes(1);
  });

  it("should pass mouse action delay to nut-js ", async () => {
    // GIVEN
    const mouseActionDelay = getRandomInt(1000);

    // WHEN
    createMouseApi(
      mockPartial<LegacyProjectProperties>({
        mouseActionDelay: mouseActionDelay,
      })
    );

    // THEN
    expect(mouse.config.autoDelayMs).toBe(mouseActionDelay);
  });

  it("should pass mouse speed to nut-js ", async () => {
    // GIVEN
    const mouseSpeed = getRandomInt(1000);

    // WHEN
    createMouseApi(
      mockPartial<LegacyProjectProperties>({
        mouseSpeed: mouseSpeed,
      })
    );

    // THEN
    expect(mouse.config.mouseSpeed).toBe(mouseSpeed);
  });

  function getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }
});
