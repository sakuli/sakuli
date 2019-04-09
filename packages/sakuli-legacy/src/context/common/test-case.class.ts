import {Project, TestExecutionContext} from "@sakuli/core";
import nutConfig from "./nut-global-config.class";
import {ScreenApi} from "./actions/screen.function";
import {ifPresent} from "@sakuli/commons";

type TestMetaData = {
    suiteName: string,
    caseName: string
};

const getTestMetaData = (ctx: TestExecutionContext): TestMetaData => {
    const suiteName = ifPresent(ctx.getCurrentTestSuite(), suite => ifPresent(suite.id, id => id, () => "UNKNOWN_TESTSUITE"), () => "UNKNOWN_TESTSUITE");
    const caseName = ifPresent(ctx.getCurrentTestCase(), testCase => ifPresent(testCase.id, id => id, () => "UNKNOWN_TESTCASE"), () => "UNKNOWN_TESTCASE");

    return ({
        suiteName,
        caseName
    });
};

export function createTestCaseClass(ctx: TestExecutionContext, project: Project) {
    return class TestCase {
        constructor(
            readonly caseId?: string,
            readonly warningTime: number = 0,
            readonly criticalTime: number = 0,
            public _imagePaths: string[] = []
        ) {
            ctx.logger.info(`Start Testcase ${caseId}`);
            ctx.startTestCase({id: caseId});
            ctx.startTestStep({});
            nutConfig.addImagePath(..._imagePaths);
        }

        addImagePaths(...paths: string[]) {
            nutConfig.addImagePath(...paths);
        }

        endOfStep(
            stepName: string,
            warning: number = 0,
            critical: number = 0,
            forward: boolean = false
        ) {
            ctx.updateCurrentTestStep({
                id: stepName,
                warningTime: warning,
                criticalTime: critical
            });
            ctx.endTestStep();
            ctx.startTestStep();
        }

        async handleException<E extends Error>(e: E) {
            ctx.logger.info(`Error: ${e.message}`);
            const { suiteName, caseName } = getTestMetaData(ctx);
            await ScreenApi.takeScreenshotWithTimestamp(`error_${suiteName}_${caseName}`);
            ctx.updateCurrentTestCase({
                error: e,
            });
        }

        getLastUrl(): string {
            throw Error('Not Implemented');
        }

        saveResult(forward: boolean = false) {
            ctx.endTestStep();
            ctx.endTestCase();
        }

        getID() {
            return this.caseId;
        }

        getTestCaseFolderPath() {
        }

        getTestSuiteFolderPath() {
            return project.rootDir;
        }

        async throwExecption(message: string, screenshot: boolean) {
            if (screenshot) {
                const { suiteName, caseName } = getTestMetaData(ctx);
                await ScreenApi.takeScreenshotWithTimestamp(`error_${suiteName}_${caseName}`);
            }
            throw Error(message);
        }
    }
}