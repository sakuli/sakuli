jest.mock("../button-registry");
jest.mock("../actions/screen.function");
jest.mock("../release-keys.function");

import { cwd } from "process";
import { Project, TestExecutionContext } from "@sakuli/core";
import { mockPartial } from "sneer";
import { createTestCaseClass } from "./test-case.class";

import nutConfig from "../nut-global-config.class";
import { SimpleLogger, Type } from "@sakuli/commons";
import { join } from "path";
import { ScreenApi } from "../actions";
import { TestCase } from "./test-case.interface";
import { TestStepCache } from "./steps-cache/test-step-cache.class";
import { TestStep } from "./__mocks__/test-step.function";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";
import { tmpdir } from "os";
import { MouseButton } from "../button.class";
import { Key } from "..";
import { getActiveKeys } from "../button-registry";
import { releaseKeys } from "../release-keys.function";

beforeEach(() => {
  jest.clearAllMocks();
});
ScreenApi.takeScreenshot = jest.fn(() => Promise.resolve(__filename));
ScreenApi.takeScreenshotWithTimestamp = jest.fn(() =>
  Promise.resolve(__filename)
);

describe("TestCase", () => {
  let testExecutionContext: TestExecutionContext;
  let project: Project;
  const testFolder = "testCaseFolder";
  let SUT: Type<TestCase>;
  beforeEach(() => {
    testExecutionContext = mockPartial<TestExecutionContext>({
      startTestStep: jest.fn(),
      endTestStep: jest.fn(),
      startTestCase: jest.fn(),
      endTestCase: jest.fn(),
      startTestSuite: jest.fn(),
      getCurrentTestCase: jest.fn(),
      getCurrentTestStep: jest.fn(),
      updateCurrentTestCase: jest.fn(),
      updateCurrentTestStep: jest.fn(),
      startExecution: jest.fn(),
      endExecution: jest.fn(),
      getCurrentTestAction: jest.fn(),
      getCurrentTestSuite: jest.fn(),
      logger: mockPartial<SimpleLogger>({
        info: jest.fn(),
        debug: jest.fn(),
        error: jest.fn(),
      }),
    });

    project = mockPartial<Project>({
      objectFactory: jest.fn().mockReturnValue(new LegacyProjectProperties()),
    });

    SUT = createTestCaseClass(testExecutionContext, project, testFolder);
  });

  describe("initialisation", () => {
    it("should pass constructor params to testExecutionContext", () => {
      // GIVEN
      const testCaseId = "testCase";
      const warningTime = 100;
      const criticalTime = 200;

      // WHEN
      new SUT(testCaseId, warningTime, criticalTime);

      // THEN
      expect(testExecutionContext.startTestCase).toBeCalledWith({
        id: testCaseId,
        warningTime,
        criticalTime,
      });
    });
  });

  describe("image path", () => {
    it("should throw on missing testcasefolder", () => {
      // GIVEN
      const BrokenSUT = createTestCaseClass(
        testExecutionContext,
        project,
        null
      );
      // WHEN

      // THEN
      expect(() => new BrokenSUT("testId", 0, 0)).toThrowError(
        "No testcase folder provided"
      );
    });

    it("should use the CWD and the testcase folder for image search by default", () => {
      // WHEN
      new SUT("testId", 0, 0);

      // THEN
      expect(nutConfig.imagePaths.length).toBe(2);
      expect(nutConfig.imagePaths).toContain(cwd());
      expect(nutConfig.imagePaths).toContain(testFolder);
    });

    it("should treat relative path relative to testcase folder", () => {
      // GIVEN
      const additionalRelativePath = "test1";

      // WHEN
      new SUT("testId", 0, 0, [additionalRelativePath]);

      // THEN
      expect(nutConfig.imagePaths.length).toBe(3);
      expect(nutConfig.imagePaths).toContain(cwd());
      expect(nutConfig.imagePaths).toContain(testFolder);
      expect(nutConfig.imagePaths).toContain(
        join(testFolder, additionalRelativePath)
      );
    });

    it("should not modify absolute path", () => {
      // GIVEN
      const additionalAbsolutePath = "/test1";

      // WHEN
      new SUT("testId", 0, 0, [additionalAbsolutePath]);

      // THEN
      expect(nutConfig.imagePaths.length).toBe(3);
      expect(nutConfig.imagePaths).toContain(cwd());
      expect(nutConfig.imagePaths).toContain(testFolder);
      expect(nutConfig.imagePaths).toContain(additionalAbsolutePath);
    });
  });

  describe("steps", () => {
    it("should properly update, stop and start", () => {
      // GIVEN
      const tc = new SUT("testId", 0, 0);

      const testStepName = "testStep1";
      const warningTime = 5;
      const criticalTime = 10;

      // WHEN
      tc.endOfStep(testStepName, warningTime, criticalTime);

      // THEN
      expect(testExecutionContext.updateCurrentTestStep).toBeCalledTimes(1);
      expect(testExecutionContext.updateCurrentTestStep).toBeCalledWith({
        id: testStepName,
        criticalTime: criticalTime,
        warningTime: warningTime,
      });
      expect(testExecutionContext.endTestStep).toBeCalledTimes(1);
      expect(testExecutionContext.startTestStep).toBeCalledTimes(2);
    });
  });

  describe("saveResult", () => {
    it("should stop and start a teststep", () => {
      // GIVEN
      const tc = new SUT("testId", 0, 0);

      // WHEN
      tc.saveResult();

      // THEN
      expect(testExecutionContext.endTestStep).toBeCalledTimes(1);
      expect(testExecutionContext.startTestStep).toBeCalledTimes(1);
    });

    it("should release all pressed keys", () => {
      // GIVEN
      const tc = new SUT("testId", 0, 0);

      const expectedButtonRegistry = {
        keyboard: [Key.ALT, Key.SHIFT],
        mouse: [MouseButton.RIGHT, MouseButton.LEFT],
      };
      (getActiveKeys as jest.Mock).mockImplementation(
        () => expectedButtonRegistry
      );

      // WHEN
      tc.saveResult();

      // THEN
      expect(releaseKeys).toBeCalledWith(
        expectedButtonRegistry,
        expect.anything(),
        expect.anything()
      );
    });
  });

  describe("handleException", () => {
    it("should log error message", async () => {
      // GIVEN
      const legacyProps = new LegacyProjectProperties();
      legacyProps.errorScreenshot = false;
      project = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue(legacyProps),
      });
      const tc = new SUT("testId", 0, 0);
      const testError = new Error("testError");

      // WHEN
      await tc.handleException(testError);

      expect(testExecutionContext.logger.error).toHaveBeenCalledWith(
        expect.stringContaining(testError.message),
        testError.stack
      );
    });

    it("should skip screenshots when disabled via props", async () => {
      // GIVEN
      const legacyProps = new LegacyProjectProperties();
      legacyProps.errorScreenshot = false;
      project = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue(legacyProps),
      });
      const skipScreenshotSUT = createTestCaseClass(
        testExecutionContext,
        project,
        testFolder
      );
      const tc = new skipScreenshotSUT("testId", 0, 0);
      const testError = new Error("testError");

      // WHEN
      await tc.handleException(testError);

      // THEN
      expect(ScreenApi.takeScreenshotWithTimestamp).not.toBeCalled();
      expect(testExecutionContext.updateCurrentTestStep).toBeCalledTimes(1);
      expect(testExecutionContext.updateCurrentTestStep).toBeCalledWith({
        error: testError,
      });
    });

    it("should take a screenshot, update the testcase and save the error screenshot hierarchical when not explicitly specified", async () => {
      // GIVEN
      const legacyProps = new LegacyProjectProperties();
      legacyProps.screenshotDir = tmpdir();
      project = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue(legacyProps),
      });
      const takeScreenshotSUT = createTestCaseClass(
        testExecutionContext,
        project,
        testFolder
      );
      const tc = new takeScreenshotSUT("testId", 0, 0);
      const testError = new Error("testError");

      // WHEN
      await tc.handleException(testError);

      // THEN
      expect(ScreenApi.takeScreenshotWithTimestamp).toBeCalledWith(
        `${tmpdir()}/UNKNOWN_TESTSUITE_testcase_1/error_UNKNOWN_TESTSUITE_testcase_1`
      );
      expect(testExecutionContext.updateCurrentTestStep).toBeCalledTimes(2);
      expect(testExecutionContext.updateCurrentTestStep).toBeCalledWith({
        error: testError,
      });
    });

    it("should take a screenshot and save it hierarchical when explicitly specified in props", async () => {
      // GIVEN
      const legacyProps = new LegacyProjectProperties();
      legacyProps.screenshotDir = tmpdir();
      legacyProps.screenshotStorage = "hierarchical";
      project = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue(legacyProps),
      });
      const takeScreenshotSUT = createTestCaseClass(
        testExecutionContext,
        project,
        testFolder
      );
      const tc = new takeScreenshotSUT("testId", 0, 0);
      const testError = new Error("testError");

      // WHEN
      await tc.handleException(testError);

      // THEN
      expect(ScreenApi.takeScreenshotWithTimestamp).toBeCalledWith(
        `${tmpdir()}/UNKNOWN_TESTSUITE_testcase_1/error_UNKNOWN_TESTSUITE_testcase_1`
      );
    });

    it("should take a screenshot and save it flat when explicitly specified in props", async () => {
      // GIVEN
      const legacyProps = new LegacyProjectProperties();
      legacyProps.screenshotDir = tmpdir();
      legacyProps.screenshotStorage = "flat";
      project = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue(legacyProps),
      });
      const takeScreenshotSUT = createTestCaseClass(
        testExecutionContext,
        project,
        testFolder
      );
      const tc = new takeScreenshotSUT("testId", 0, 0);
      const testError = new Error("testError");

      // WHEN
      await tc.handleException(testError);

      // THEN
      expect(ScreenApi.takeScreenshotWithTimestamp).toBeCalledWith(
        `${tmpdir()}/error_UNKNOWN_TESTSUITE_testcase_1`
      );
    });

    it("should release all pressed keys", async () => {
      // GIVEN
      const legacyProps = new LegacyProjectProperties();
      project = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue(legacyProps),
      });
      const takeScreenshotSUT = createTestCaseClass(
        testExecutionContext,
        project,
        testFolder
      );
      const tc = new takeScreenshotSUT("testId", 0, 0);
      const testError = new Error("testError");
      const expectedButtonRegistry = {
        keyboard: [Key.ALT, Key.SHIFT],
        mouse: [MouseButton.RIGHT, MouseButton.LEFT],
      };
      (getActiveKeys as jest.Mock).mockImplementation(
        () => expectedButtonRegistry
      );

      // WHEN
      await tc.handleException(testError);

      // THEN
      expect(releaseKeys).toBeCalledWith(
        expectedButtonRegistry,
        expect.anything(),
        expect.anything()
      );
    });
  });

  describe("caching", () => {
    let CachingSUT: Type<TestCase>;
    const cacheData = {
      exists: true,
      steps: [
        TestStep("step-1", 100, 200),
        TestStep("step-2", 100, 200),
        TestStep("step-3", 100, 200),
      ],
    };
    let cacheMock: TestStepCache;
    let tc: TestCase;
    beforeEach(() => {
      const legacyProps = new LegacyProjectProperties();
      legacyProps.screenshotDir = tmpdir();
      project = mockPartial<Project>({
        objectFactory: jest.fn().mockReturnValue(legacyProps),
      });
      cacheMock = mockPartial<TestStepCache>({
        exists: jest.fn().mockResolvedValue(cacheData.exists),
        read: jest.fn().mockResolvedValue(cacheData.steps),
        write: jest.fn().mockResolvedValue(void 0),
      });
      CachingSUT = createTestCaseClass(
        testExecutionContext,
        project,
        testFolder,
        cacheMock
      );
      tc = new CachingSUT();
    });

    it("should update last step from cache", async () => {
      (<jest.Mock>testExecutionContext.getCurrentTestCase).mockReturnValue({
        getChildren: () => [TestStep("step-1", 100, 200), TestStep("", 0, 0)],
      });

      // WHEN
      await tc.handleException(Error("Dummy"));

      // THEN
      expect(testExecutionContext.updateCurrentTestStep).toHaveBeenCalledWith(
        expect.objectContaining({
          kind: "step",
          id: "step-2",
          warningTime: 100,
          criticalTime: 200,
        })
      );
    });

    it("should write the cache on successful testcase", () => {
      const steps = [
        TestStep("step-1", 100, 200),
        TestStep("step-2", 100, 200),
      ];

      (<jest.Mock>testExecutionContext.getCurrentTestStep).mockReturnValue({
        error: undefined,
      });
      (<jest.Mock>testExecutionContext.getCurrentTestCase).mockReturnValue({
        getChildren: () => steps,
      });
      tc.saveResult();
      expect(cacheMock.write).toHaveBeenCalledWith(steps);
    });

    it("should not write the cache on error testcase", () => {
      const steps = [
        TestStep("step-1", 100, 200),
        TestStep("step-2", 100, 200),
      ];

      (<jest.Mock>testExecutionContext.getCurrentTestStep).mockReturnValue({
        error: Error("Dummy error"),
      });
      (<jest.Mock>testExecutionContext.getCurrentTestCase).mockReturnValue({
        getChildren: () => steps,
      });
      tc.saveResult();
      expect(cacheMock.write).not.toHaveBeenCalled();
    });
  });
});
