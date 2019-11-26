import {Region, screen} from "@nut-tree/nut-js";
import {getTimestamp, ScreenApi} from "./screen.function";
import {createRegionClass} from "../region";
import {Project, TestExecutionContext} from "@sakuli/core";
import {SimpleLogger} from "@sakuli/commons";
import {FileType} from "@nut-tree/nut-js/dist/lib/file-type.enum";
import {cwd} from "process";
import {join} from "path";

let ctx: TestExecutionContext;
let project: Project;

const testFilename = "testfile.png";
const testPath = "/test/path";
const testConfidence = 0.99;
const testTimeout = 500;
const expectedRegion = new Region(0, 0, 100, 100);

beforeEach(() => {
    ctx = new TestExecutionContext(new SimpleLogger());
    project = new Project("");
});

describe("ScreenApi", () => {
    it("should call `screen.find` with suitable Region", async () => {
        // GIVEN
        const TestRegion = createRegionClass(ctx, project);
        const testRegion = new TestRegion(0, 0, 100, 100);
        screen.find = jest.fn(() => Promise.resolve(expectedRegion));

        // WHEN
        await ScreenApi.find(testFilename, testPath, testConfidence, testRegion);

        // THEN
        expect(screen.find).toBeCalledTimes(1);
        expect(screen.find).toBeCalledWith(testFilename, {
            confidence: testConfidence,
            searchRegion: expectedRegion
        });
    });

    it("should call `screen.waitFor` with suitable Region", async () => {
        // GIVEN
        const TestRegion = createRegionClass(ctx, project);
        const testRegion = new TestRegion(0, 0, 100, 100);
        screen.waitFor = jest.fn(() => Promise.resolve(expectedRegion));

        // WHEN
        await ScreenApi.waitForImage(testFilename, testPath, testConfidence, testTimeout, testRegion);

        // THEN
        expect(screen.waitFor).toBeCalledTimes(1);
        expect(screen.waitFor).toBeCalledWith(testFilename, testTimeout, {
            confidence: testConfidence,
            searchRegion: expectedRegion
        });
    });
});

describe("takeScreenshot*", () => {
    it("should call `screen.capture` with fallback `cwd()`", async () => {
        // GIVEN
        const screenShotFileName = "screenshot";
        const screenShotFileExt = ".png";
        screen.capture = jest.fn(() => Promise.resolve("filename"));

        // WHEN
        await ScreenApi.takeScreenshot(`${screenShotFileName}${screenShotFileExt}`);

        // THEN
        expect(screen.capture).toBeCalledTimes(1);
        expect(screen.capture).toBeCalledWith(screenShotFileName, FileType.PNG, cwd());
    });

    it("should call `screen.capture` with custom path", async () => {
        // GIVEN
        const screenShotPath = join("test", "path", "to");
        const screenShotFileName = "screenshot";
        const screenShotFileExt = ".png";
        screen.capture = jest.fn(() => Promise.resolve("filename"));

        // WHEN
        await ScreenApi.takeScreenshot(`${join(screenShotPath, screenShotFileName)}${screenShotFileExt}`);

        // THEN
        expect(screen.capture).toBeCalledTimes(1);
        expect(screen.capture).toBeCalledWith(screenShotFileName, FileType.PNG, screenShotPath);
    });

    it("should call `screen.capture` with timestamp and fallback `cwd()`", async () => {
        // GIVEN
        const screenShotFileName = "screenshot";
        const screenShotFileExt = ".png";
        screen.capture = jest.fn(() => Promise.resolve("filename"));

        // WHEN
        await ScreenApi.takeScreenshotWithTimestamp(`${screenShotFileName}${screenShotFileExt}`);

        // THEN
        expect(screen.capture).toBeCalledTimes(1);
        expect(screen.capture).toBeCalledWith(screenShotFileName, FileType.PNG, cwd(), expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_/), "");
    });

    it("should call `screen.capture` with timestamp and custom path", async () => {
        // GIVEN
        const screenShotPath = join("test", "path", "to");
        const screenShotFileName = "screenshot";
        const screenShotFileExt = ".png";
        screen.capture = jest.fn(() => Promise.resolve("filename"));

        // WHEN
        await ScreenApi.takeScreenshotWithTimestamp(`${join(screenShotPath, screenShotFileName)}${screenShotFileExt}`);

        // THEN
        expect(screen.capture).toBeCalledTimes(1);
        expect(screen.capture).toBeCalledWith(screenShotFileName, FileType.PNG, screenShotPath, expect.stringMatching(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}_/), "");
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
        expect(result).toBe("2019-07-09T18-01-15")
    });

    it("should output an ISO string for UTC", () => {
        // GIVEN
        const timestamp = 1562688075714;

        // WHEN
        const result = getTimestamp(timestamp);

        // THEN
        expect(result).not.toContain(":");
        expect(result).toBe("2019-07-09T16-01-15")
    });

    it("should output current UTC by default", () => {
        // GIVEN
        const timestamp = 1562688075714;
        Date.now = jest.fn(() => timestamp);

        // WHEN
        const result = getTimestamp();

        // THEN
        expect(result).not.toContain(":");
        expect(result).toBe("2019-07-09T16-01-15")
    });
});