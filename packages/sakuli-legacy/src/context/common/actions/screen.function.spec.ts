import * as nutjs from "@nut-tree/nut-js";
import { getTimestamp, ScreenApi } from "./screen.function";
import { createRegionClass } from "../region";
import { Project, TestExecutionContext } from "@sakuli/core";
import { SimpleLogger } from "@sakuli/commons";
import { FileType } from "@nut-tree/nut-js/dist/lib/file-type.enum";
import { cwd } from "process";
import { join } from "path";
import { toNutRegion } from "./converter.function";
import { mockPartial } from "sneer";

let ctx: TestExecutionContext;
let project: Project;

const testFilename = "testfile.png";
const testPath = "/test/path";
const testConfidence = 0.99;
const testTimeout = 500;
const expectedRegion = new nutjs.Region(0, 0, 100, 100);

beforeEach(() => {
  ctx = new TestExecutionContext(new SimpleLogger());
  project = new Project("");
  jest.resetAllMocks();
});

describe("ScreenApi", () => {
  it("should call `screen.find` with suitable Region", async () => {
    // GIVEN
    const TestRegion = createRegionClass(ctx, project);
    const testRegion = new TestRegion(0, 0, 100, 100);
    nutjs.screen.find = jest.fn(() => Promise.resolve(expectedRegion));
    (nutjs.imageResource as jest.Mock) = jest.fn((path) => Promise.resolve(path))

    // WHEN
    await ScreenApi.find(testFilename, testPath, testConfidence, testRegion);

    // THEN
    expect(nutjs.imageResource).toHaveBeenCalledWith(testFilename);
    expect(nutjs.screen.find).toBeCalledTimes(1);
    expect(nutjs.screen.find).toBeCalledWith(testFilename, {
      confidence: testConfidence,
      searchRegion: expectedRegion,
    });
  });

  it("should call `screen.waitFor` with suitable Region", async () => {
    // GIVEN
    const TestRegion = createRegionClass(ctx, project);
    const testRegion = new TestRegion(0, 0, 100, 100);
    const defaultInterval = 500;
    nutjs.screen.waitFor = jest.fn(() => Promise.resolve(expectedRegion));
    (nutjs.imageResource as jest.Mock) = jest.fn((path) => Promise.resolve(path));

    // WHEN
    await ScreenApi.waitForImage(
      testFilename,
      testPath,
      testConfidence,
      testTimeout,
      testRegion
    );

    // THEN
    expect(nutjs.imageResource).toHaveBeenCalledWith(testFilename);
    expect(nutjs.screen.waitFor).toBeCalledTimes(1);
    expect(nutjs.screen.waitFor).toBeCalledWith(testFilename, testTimeout, defaultInterval, {
      confidence: testConfidence,
      searchRegion: expectedRegion,
    });
  });

  it("should call `screen.highlight` with suitable Region and timeout", async () => {
    // GIVEN
    const TestRegion = createRegionClass(ctx, project);
    const testRegion = new TestRegion(0, 0, 100, 100);
    const expectedRegion = await toNutRegion(testRegion);
    const testHighlightDuration = 5;
    nutjs.screen.highlight = jest.fn(() => Promise.resolve(expectedRegion));

    // WHEN
    await ScreenApi.highlight(testRegion, testHighlightDuration);

    // THEN
    expect(nutjs.screen.highlight).toBeCalledTimes(1);
    expect(nutjs.screen.highlight).toBeCalledWith(expectedRegion);
  });

  it("should call `getActiveWindow`", async () => {
    // GIVEN
    const mock = jest.spyOn(nutjs, "getActiveWindow");
    mock.mockResolvedValue(
      mockPartial<nutjs.Window>({
        get region(): Promise<nutjs.Region> {
          return Promise.resolve(expectedRegion);
        },
      })
    );

    // WHEN
    const regionResult = await ScreenApi.getRegionFromFocusedWindow();

    // THEN
    expect(nutjs.getActiveWindow).toBeCalledTimes(1);
    expect(regionResult as nutjs.Region).toEqual(expectedRegion);
  });

  it("should return passed region after calling highlight for method chaining", async () => {
    // GIVEN
    const TestRegion = createRegionClass(ctx, project);
    const testRegion = new TestRegion(0, 0, 100, 100);
    const testHighlightDuration = 5;
    nutjs.screen.highlight = jest.fn(() => Promise.resolve(expectedRegion));

    // WHEN
    const result = await ScreenApi.highlight(testRegion, testHighlightDuration);

    // THEN
    expect(result).toEqual(testRegion);
  });
});

describe("takeScreenshot*", () => {
  it("should call `screen.capture` with fallback `cwd()`", async () => {
    // GIVEN
    const screenShotFileName = "screenshot";
    const screenShotFileExt = ".png";
    nutjs.screen.capture = jest.fn(() => Promise.resolve("filename"));

    // WHEN
    await ScreenApi.takeScreenshot(`${screenShotFileName}${screenShotFileExt}`);

    // THEN
    expect(nutjs.screen.capture).toBeCalledTimes(1);
    expect(nutjs.screen.capture).toBeCalledWith(
      screenShotFileName,
      FileType.PNG,
      cwd()
    );
  });

  it("should call `screen.capture` with custom path", async () => {
    // GIVEN
    const screenShotPath = join("test", "path", "to");
    const screenShotFileName = "screenshot";
    const screenShotFileExt = ".png";
    nutjs.screen.capture = jest.fn(() => Promise.resolve("filename"));

    // WHEN
    await ScreenApi.takeScreenshot(
      `${join(screenShotPath, screenShotFileName)}${screenShotFileExt}`
    );

    // THEN
    expect(nutjs.screen.capture).toBeCalledTimes(1);
    expect(nutjs.screen.capture).toBeCalledWith(
      screenShotFileName,
      FileType.PNG,
      screenShotPath
    );
  });

  it("should call `screen.capture` with timestamp and fallback `cwd()`", async () => {
    // GIVEN
    const screenShotFileName = "screenshot";
    const screenShotFileExt = ".png";
    nutjs.screen.capture = jest.fn(() => Promise.resolve("filename"));

    // WHEN
    await ScreenApi.takeScreenshotWithTimestamp(
      `${screenShotFileName}${screenShotFileExt}`
    );

    // THEN
    expect(nutjs.screen.capture).toBeCalledTimes(1);
    expect(nutjs.screen.capture).toBeCalledWith(
      screenShotFileName,
      FileType.PNG,
      cwd(),
      expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_/),
      ""
    );
  });

  it("should call `screen.capture` with timestamp and custom path", async () => {
    // GIVEN
    const screenShotPath = join("test", "path", "to");
    const screenShotFileName = "screenshot";
    const screenShotFileExt = ".png";
    nutjs.screen.capture = jest.fn(() => Promise.resolve("filename"));

    // WHEN
    await ScreenApi.takeScreenshotWithTimestamp(
      `${join(screenShotPath, screenShotFileName)}${screenShotFileExt}`
    );

    // THEN
    expect(nutjs.screen.capture).toBeCalledTimes(1);
    expect(nutjs.screen.capture).toBeCalledWith(
      screenShotFileName,
      FileType.PNG,
      screenShotPath,
      expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_/),
      ""
    );
  });
});

describe("getTimestamp", () => {
  it("should output an ISO string for current timezone", () => {
    // GIVEN
    const timestamp = 1562688075714;
    const offset = -120 * 60_000;

    // WHEN
    const result = getTimestamp(timestamp, offset);

    // THEN
    expect(result).not.toContain(":");
    expect(result).toBe("2019-07-09T18-01-15");
  });

  it("should output an ISO string for UTC", () => {
    // GIVEN
    const timestamp = 1562688075714;

    // WHEN
    const result = getTimestamp(timestamp);

    // THEN
    expect(result).not.toContain(":");
    expect(result).toBe("2019-07-09T16-01-15");
  });

  it("should output current UTC by default", () => {
    // GIVEN
    const timestamp = 1562688075714;
    Date.now = jest.fn(() => timestamp);

    // WHEN
    const result = getTimestamp();

    // THEN
    expect(result).not.toContain(":");
    expect(result).toBe("2019-07-09T16-01-15");
  });
});
