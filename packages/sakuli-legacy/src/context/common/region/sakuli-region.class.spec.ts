import { createRegionClass } from "./sakuli-region.class";
import { createTestExecutionContextMock } from "../../__mocks__";
import { mockPartial } from "sneer";
import { Project } from "@sakuli/core";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";
import * as actions from "../actions";
import { MouseButton } from "../button.class";
import nutConfig from "../nut-global-config.class";
import { join } from "path";
import { Key } from "..";
import {
  registerKeyboardPressKeys,
  registerKeyboardReleaseKeys,
} from "../button-registry";

jest.mock("../actions");
jest.mock("../button-registry");

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
  const keyboardApi = actions.createKeyboardApi(new LegacyProjectProperties());

  let runAsActionSpy = jest.spyOn(actions, "runAsAction");

  const resourceDirectory = join(__dirname, "__mocks__");

  beforeAll(() => {
    nutConfig.imagePaths.push(resourceDirectory);
  });

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
      expect.any(Function)
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
      expect.any(Function)
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
      expect.any(Function)
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
      expect.any(Function)
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
      expect.any(Function)
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
      expect.any(Function)
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
      expect.any(Function)
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
      expect.any(Function)
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

  describe("screen content", () => {
    describe("find", () => {
      it("should throw on invalid image", async () => {
        //GIVEN
        const imageFileToSearch = "file.png";

        //WHEN
        const SUT = sakuliRegion.find;

        //THEN
        await expect(SUT(imageFileToSearch)).rejects.toThrow(
          `Failed to locate ${imageFileToSearch} in directories [${nutConfig.imagePaths}]`
        );
      });
      it("should call ScreenApi.find", async () => {
        //GIVEN
        const imageFileToSearch = "sakuli.png";
        const expectedRegion = new sakuliRegionClass(0, 0, 100, 100);

        //WHEN
        const result = await sakuliRegion.find(imageFileToSearch);

        //THEN
        expect(runAsActionSpy).toBeCalledWith(
          testExecutionContextMock,
          "find",
          expect.any(Function)
        );
        expect(actions.ScreenApi.find).toBeCalledTimes(1);
        expect(actions.ScreenApi.find).toBeCalledWith(
          imageFileToSearch,
          resourceDirectory,
          nutConfig.confidence,
          expect.any(sakuliRegionClass)
        );
        expect(result).toEqual(expectedRegion);
      });
    });
    describe("exists", () => {
      it("should throw on invalid image", async () => {
        //GIVEN
        const imageFileToSearch = "file.png";

        //WHEN
        const SUT = sakuliRegion.exists;

        //THEN
        await expect(SUT(imageFileToSearch)).rejects.toThrow(
          `Failed to locate ${imageFileToSearch} in directories [${nutConfig.imagePaths}]`
        );
      });
      it("should call ScreenApi.waitForImage with default timeout 0", async () => {
        //GIVEN
        const imageFileToSearch = "sakuli.png";
        const expectedRegion = new sakuliRegionClass(0, 0, 100, 100);

        //WHEN
        const result = await sakuliRegion.exists(imageFileToSearch);

        //THEN
        expect(runAsActionSpy).toBeCalledWith(
          testExecutionContextMock,
          "exists",
          expect.any(Function)
        );
        expect(actions.ScreenApi.waitForImage).toBeCalledTimes(1);
        expect(actions.ScreenApi.waitForImage).toBeCalledWith(
          imageFileToSearch,
          resourceDirectory,
          nutConfig.confidence,
          0,
          expect.any(sakuliRegionClass)
        );
        expect(result).toEqual(expectedRegion);
      });
      it("should call ScreenApi.waitForImage with configured timeout", async () => {
        //GIVEN
        const imageFileToSearch = "sakuli.png";
        const expectedRegion = new sakuliRegionClass(0, 0, 100, 100);
        const timeoutInSeconds = 3;

        //WHEN
        const result = await sakuliRegion.exists(
          imageFileToSearch,
          timeoutInSeconds
        );

        //THEN
        expect(runAsActionSpy).toBeCalledWith(
          testExecutionContextMock,
          "exists",
          expect.any(Function)
        );
        expect(actions.ScreenApi.waitForImage).toBeCalledTimes(1);
        expect(actions.ScreenApi.waitForImage).toBeCalledWith(
          imageFileToSearch,
          resourceDirectory,
          nutConfig.confidence,
          timeoutInSeconds * 1000,
          expect.any(sakuliRegionClass)
        );
        expect(result).toEqual(expectedRegion);
      });
    });
    describe("waitForImage", () => {
      it("should throw on invalid image", async () => {
        //GIVEN
        const imageFileToSearch = "file.png";

        //WHEN
        const SUT = sakuliRegion.waitForImage;

        //THEN
        await expect(SUT(imageFileToSearch, 5000)).rejects.toThrow(
          `Failed to locate ${imageFileToSearch} in directories [${nutConfig.imagePaths}]`
        );
      });
      it("should call ScreenApi.waitForImage", async () => {
        //GIVEN
        const imageFileToSearch = "sakuli.png";
        const expectedRegion = new sakuliRegionClass(0, 0, 100, 100);
        const timeoutInSeconds = 5;

        //WHEN
        const result = await sakuliRegion.waitForImage(
          imageFileToSearch,
          timeoutInSeconds
        );

        //THEN
        expect(runAsActionSpy).toBeCalledWith(
          testExecutionContextMock,
          "waitForImage",
          expect.any(Function)
        );
        expect(actions.ScreenApi.waitForImage).toBeCalledTimes(1);
        expect(actions.ScreenApi.waitForImage).toBeCalledWith(
          imageFileToSearch,
          resourceDirectory,
          nutConfig.confidence,
          timeoutInSeconds * 1000,
          expect.any(sakuliRegionClass)
        );
        expect(result).toEqual(expectedRegion);
      });
    });
    describe("highlight", () => {
      it("should highlight a specified region", async () => {
        //GIVEN
        const highlightDuration = 3;

        //WHEN
        const result = await sakuliRegion.highlight(highlightDuration);

        //THEN
        expect(runAsActionSpy).toBeCalledWith(
          testExecutionContextMock,
          "highlight",
          expect.any(Function)
        );
        expect(actions.ScreenApi.highlight).toBeCalledTimes(1);
        expect(actions.ScreenApi.highlight).toBeCalledWith(
          sakuliRegion,
          highlightDuration
        );
        expect(result).toEqual(sakuliRegion);
      });
    });
  });

  it("should let you update x coordinate", async () => {
    // GIVEN
    const newX = 42;

    // WHEN
    const result = await sakuliRegion.setX(newX);

    // THEN
    await expect(result.getX()).resolves.toBe(newX);
  });

  it("should let you update y coordinate", async () => {
    // GIVEN
    const newY = 23;

    // WHEN
    const result = await sakuliRegion.setY(newY);

    // THEN
    await expect(result.getY()).resolves.toBe(newY);
  });

  it("should let you update height", async () => {
    // GIVEN
    const newH = 123;

    // WHEN
    const result = await sakuliRegion.setH(newH);

    // THEN
    await expect(result.getH()).resolves.toBe(newH);
  });

  it("should let you update width", async () => {
    // GIVEN
    const newW = 815;

    // WHEN
    const result = await sakuliRegion.setW(newW);

    // THEN
    await expect(result.getW()).resolves.toBe(newW);
  });

  describe("takeScreenShot", () => {
    it("should take a screenshot with a given filename", async () => {
      // GIVEN
      const filename = "test_screenshot";

      // WHEN
      await sakuliRegion.takeScreenshot(filename);

      // THEN
      expect(runAsActionSpy).toBeCalledWith(
        testExecutionContextMock,
        "takeScreenshot",
        expect.any(Function)
      );
      expect(actions.ScreenApi.takeScreenshot).toBeCalledTimes(1);
      expect(actions.ScreenApi.takeScreenshot).toBeCalledWith(filename);
    });

    it("should take a screenshot and append a timestamp to the filename", async () => {
      // GIVEN
      const filename = "test_screenshot";

      // WHEN
      await sakuliRegion.takeScreenshotWithTimestamp(filename);

      // THEN
      expect(runAsActionSpy).toBeCalledWith(
        testExecutionContextMock,
        "takeScreenshotWithTimestamp",
        expect.any(Function)
      );
      expect(actions.ScreenApi.takeScreenshotWithTimestamp).toBeCalledTimes(1);
      expect(actions.ScreenApi.takeScreenshotWithTimestamp).toBeCalledWith(
        filename
      );
    });
  });

  describe("extractText", () => {
    it("should throw on not implemented method 'extractText'", async () => {
      //GIVEN

      //WHEN
      const SUT = sakuliRegion.extractText;

      //THEN
      await expect(SUT()).rejects.toThrowError("Not Implemented");
    });
  });

  describe("resizing / moving", () => {
    describe("move", () => {
      it("should move a region by an offset in x direction", async () => {
        //GIVEN

        //WHEN
        const SUT = sakuliRegion.extractText;

        //THEN
        await expect(SUT()).rejects.toThrowError("Not Implemented");
      });
      it("should move a region by an offset in y direction", async () => {
        //GIVEN

        //WHEN
        const SUT = sakuliRegion.extractText;

        //THEN
        await expect(SUT()).rejects.toThrowError("Not Implemented");
      });
      it("should move a region by an offset in x and y direction", async () => {
        //GIVEN

        //WHEN
        const SUT = sakuliRegion.extractText;

        //THEN
        await expect(SUT()).rejects.toThrowError("Not Implemented");
      });
    });
  });

  describe("resize", () => {
    describe("grow", () => {
      it("should grow a region to all sides by given range", async () => {
        //GIVEN
        const initialX = 30;
        const initialY = 300;
        const initialW = 84;
        const initialH = 98;
        const growRange = 100;

        const initialRegion = new sakuliRegionClass(
          initialX,
          initialY,
          initialW,
          initialH
        );

        //WHEN
        const SUT = await initialRegion.grow(growRange);

        //THEN
        expect(await SUT.getX()).toBe(initialX - growRange);
        expect(await SUT.getY()).toBe(initialY - growRange);
        expect(await SUT.getW()).toBe(initialW + 2 * growRange);
        expect(await SUT.getH()).toBe(initialH + 2 * growRange);
      });
    });
    describe("above", () => {
      it("should return a region above a given region with specified height", async () => {
        //GIVEN
        const initialX = 30;
        const initialY = 300;
        const initialW = 84;
        const initialH = 98;
        const aboveHeight = 100;

        const initialRegion = new sakuliRegionClass(
          initialX,
          initialY,
          initialW,
          initialH
        );

        //WHEN
        const SUT = await initialRegion.above(aboveHeight);

        //THEN
        expect(await SUT.getX()).toBe(initialX);
        expect(await SUT.getY()).toBe(initialY - aboveHeight);
        expect(await SUT.getW()).toBe(initialW);
        expect(await SUT.getH()).toBe(aboveHeight);
      });
    });
    describe("below", () => {
      it("should return a region below a given region with specified height", async () => {
        //GIVEN
        const initialX = 20;
        const initialY = 67;
        const initialW = 100;
        const initialH = 100;
        const belowHeight = 50;

        const initialRegion = new sakuliRegionClass(
          initialX,
          initialY,
          initialW,
          initialH
        );

        //WHEN
        const SUT = await initialRegion.below(belowHeight);

        //THEN
        expect(await SUT.getX()).toBe(initialX);
        expect(await SUT.getY()).toBe(initialY + initialH);
        expect(await SUT.getW()).toBe(initialW);
        expect(await SUT.getH()).toBe(belowHeight);
      });
    });
    describe("left", () => {
      it("should return a region left of a given region with specified width", async () => {
        //GIVEN
        const initialX = 0;
        const initialY = 0;
        const initialW = 100;
        const initialH = 100;
        const leftWidth = 85;

        const initialRegion = new sakuliRegionClass(
          initialX,
          initialY,
          initialW,
          initialH
        );

        //WHEN
        const SUT = await initialRegion.left(leftWidth);

        //THEN
        expect(await SUT.getX()).toBe(initialX - leftWidth);
        expect(await SUT.getY()).toBe(initialY);
        expect(await SUT.getW()).toBe(leftWidth);
        expect(await SUT.getH()).toBe(initialH);
      });
    });
    describe("right", () => {
      it("should return a region right of a given region with specified width", async () => {
        //GIVEN
        const initialX = 0;
        const initialY = 0;
        const initialW = 100;
        const initialH = 100;
        const rightWidth = 350;

        const initialRegion = new sakuliRegionClass(
          initialX,
          initialY,
          initialW,
          initialH
        );

        //WHEN
        const SUT = await initialRegion.right(350);

        //THEN
        expect(await SUT.getX()).toBe(initialX + initialW);
        expect(await SUT.getY()).toBe(initialY);
        expect(await SUT.getW()).toBe(rightWidth);
        expect(await SUT.getH()).toBe(initialH);
      });
    });
  });

  describe("keys", () => {
    it("should invoke keyboardApi and button registry on keyDown", async () => {
      //GIVEN
      const keysToPress = [Key.CTRL, Key.P];

      //WHEN
      const resultRegion = await sakuliRegion.keyDown(keysToPress);

      //THEN
      expect(runAsActionSpy).toBeCalledWith(
        testExecutionContextMock,
        "keyDown",
        expect.any(Function)
      );
      expect(keyboardApi.pressKey).toBeCalledWith(keysToPress);
      expect(registerKeyboardPressKeys).toBeCalledWith(keysToPress);
      expect(resultRegion).toEqual(sakuliRegion);
    });

    it("should invoke keyboardApi and button registry on keyUp", async () => {
      //GIVEN
      const keysToPress = [Key.ALT, Key.P];

      //WHEN
      const resultRegion = await sakuliRegion.keyUp(keysToPress);

      //THEN
      expect(runAsActionSpy).toBeCalledWith(
        testExecutionContextMock,
        "keyUp",
        expect.any(Function)
      );
      expect(keyboardApi.releaseKey).toBeCalledWith(keysToPress);
      expect(registerKeyboardReleaseKeys).toBeCalledWith(keysToPress);
      expect(resultRegion).toEqual(sakuliRegion);
    });
  });
});
