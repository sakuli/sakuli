import {Project, TestExecutionContext} from "@sakuli/core";
import nutConfig from "./nut-global-config.class";
import {ScreenApi} from "./actions/screen.function";
import {ifPresent} from "@sakuli/commons";

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
            const suiteName = ifPresent(ctx.getCurrentTestSuite(), suite => suite.id, () => "UNKNOWN_TESTSUITE");
            const caseName = ifPresent(ctx.getCurrentTestCase(), testCase => testCase.id, () => "UNKNOWN_TESTCASE");
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
            throw Error('Not Implemented');
        }

        getTestSuiteFolderPath() {
            return project.rootDir;
        }

        throwExecption(message: string, screenshot: boolean) {
            throw Error(message);
        }
    }
}