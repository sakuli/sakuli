import {cwd} from "process";
import {Project, TestExecutionContext} from "@sakuli/core";
import {mockPartial} from "sneer";
import {createTestCaseClass} from "./test-case.class";

import nutConfig from "../nut-global-config.class";
import {SimpleLogger} from "@sakuli/commons";
import {join} from "path";
import {ScreenApi} from "../actions/screen.function";

beforeEach(() => {
    jest.resetAllMocks();
});

jest.mock("../actions/screen.function");
ScreenApi.takeScreenshot = jest.fn();

describe("TestCase", () => {

    const testExecutionContext = mockPartial<TestExecutionContext>({
        startTestStep: jest.fn(),
        endTestStep: jest.fn(),
        startTestCase: jest.fn(),
        endTestCase: jest.fn(),
        startTestSuite: jest.fn(),
        getCurrentTestCase: jest.fn(),
        updateCurrentTestCase: jest.fn(),
        updateCurrentTestStep: jest.fn(),
        startExecution: jest.fn(),
        endExecution: jest.fn(),
        getCurrentTestAction: jest.fn(),
        getCurrentTestSuite: jest.fn(),
        logger: mockPartial<SimpleLogger>({
            info: jest.fn()
        })
    });

    const project: Project = mockPartial<Project>({});

    describe("image path", () => {
        it("should throw on missing testcasefolder", () => {
            // GIVEN
            const SUT = createTestCaseClass(testExecutionContext, project, null);
            // WHEN

            // THEN
            expect(() => new SUT("testId", 0, 0)).toThrowError("No testcase folder provided");
        });

        it("should use the CWD and the testcase folder for image search by default", () => {
            // GIVEN
            const testFolder = "testCaseFolder";
            const SUT = createTestCaseClass(testExecutionContext, project, testFolder);

            // WHEN
            new SUT("testId", 0, 0);

            // THEN
            expect(nutConfig.imagePaths.length).toBe(2);
            expect(nutConfig.imagePaths).toContain(cwd());
            expect(nutConfig.imagePaths).toContain(testFolder);
        });

        it("should treat relative path relative to testcase folder", () => {
            // GIVEN
            const testFolder = "testCaseFolder";
            const additionalRelativePath = "test1";
            const SUT = createTestCaseClass(testExecutionContext, project, testFolder);

            // WHEN
            new SUT("testId", 0, 0, [additionalRelativePath]);

            // THEN
            expect(nutConfig.imagePaths.length).toBe(3);
            expect(nutConfig.imagePaths).toContain(cwd());
            expect(nutConfig.imagePaths).toContain(testFolder);
            expect(nutConfig.imagePaths).toContain(join(testFolder, additionalRelativePath));
        });

        it("should not modify absolute path", () => {
            // GIVEN
            const testFolder = "testCaseFolder";
            const additionalAbsolutePath = "/test1";
            const SUT = createTestCaseClass(testExecutionContext, project, testFolder);

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
            const testFolder = "testCaseFolder";
            const SUT = createTestCaseClass(testExecutionContext, project, testFolder);
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
                warningTime: warningTime
            });
            expect(testExecutionContext.endTestStep).toBeCalledTimes(1);
            expect(testExecutionContext.startTestStep).toBeCalledTimes(2);
        })
    });

    describe("saveResult", () => {
        it("should stop and start a teststep", () => {
            // GIVEN
            const testFolder = "testCaseFolder";
            const SUT = createTestCaseClass(testExecutionContext, project, testFolder);
            const tc = new SUT("testId", 0, 0);

            // WHEN
            tc.saveResult();

            // THEN
            expect(testExecutionContext.endTestStep).toBeCalledTimes(1);
            expect(testExecutionContext.startTestStep).toBeCalledTimes(1);
        })
    });

    describe("handleException", () => {
        it("should take a screenshot and update the testcase update ", async () => {
            // GIVEN
            const testFolder = "testCaseFolder";
            const SUT = createTestCaseClass(testExecutionContext, project, testFolder);
            const tc = new SUT("testId", 0, 0);
            const testError = new Error("testError");

            // WHEN
            await tc.handleException(testError);

            // THEN
            expect(testExecutionContext.updateCurrentTestCase).toBeCalledTimes(1);
            expect(testExecutionContext.updateCurrentTestCase).toBeCalledWith({
                error: testError
            });
        })
    });
});
