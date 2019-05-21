import {cwd} from "process";
import {Project, TestExecutionContext} from "@sakuli/core";
import nutConfig from "./nut-global-config.class";
import {ScreenApi} from "./actions/screen.function";
import {ifPresent, Maybe, throwIfAbsent} from "@sakuli/commons";
import {isAbsolute, join} from "path";

type TestMetaData = {
    suiteName: string,
    caseName: string
};

const getTestMetaData = (ctx: TestExecutionContext): TestMetaData => {
    const suiteName = ifPresent(ctx.getCurrentTestSuite(), suite => ifPresent(suite.id, id => id, () => "UNKNOWN_TESTSUITE"), () => "UNKNOWN_TESTSUITE");
    let caseName = ifPresent(ctx.getCurrentTestCase(), testCase => testCase.id, () => null);
    caseName = ifPresent(caseName, () => caseName, () => {
        return ifPresent(ctx.getCurrentTestSuite(), ts => `testcase_${ts.testCases.length}`, () => "testcase_1");
    });

    return ({
        suiteName,
        caseName: caseName || "testcase_1"
    });
};

const takeErrorScreenShot = (ctx: TestExecutionContext, currentTestFolder: Maybe<string>) => {
    const {suiteName, caseName} = getTestMetaData(ctx);
    const errorString = `error_${suiteName}_${caseName}`;
    const screenShotPath = ifPresent(currentTestFolder,
        (testFolder) => join(testFolder, errorString),
        () => join(cwd(), errorString));
    return ScreenApi.takeScreenshotWithTimestamp(screenShotPath);
};

export function createTestCaseClass(ctx: TestExecutionContext, project: Project, currentTestFolder: Maybe<string>) {
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
            nutConfig.imagePaths = [cwd()];
            const testFolder = throwIfAbsent(currentTestFolder, new Error("No testcase folder provided"));
            nutConfig.addImagePath(testFolder);
            this.addImagePaths(..._imagePaths);
        }

        addImagePaths(...paths: string[]) {
            for (let path of paths) {
                if (isAbsolute(path)) {
                    nutConfig.addImagePath(path);
                } else {
                    ifPresent(currentTestFolder,
                        testFolder => nutConfig.addImagePath(join(testFolder, path))
                    );
                }
            }
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
            const screenShotPath = await takeErrorScreenShot(ctx, currentTestFolder);
            ctx.logger.info(`Saved error screenshot at '${screenShotPath}'`);
            ctx.updateCurrentTestCase({
                error: e,
                screenshot: screenShotPath
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
            return throwIfAbsent(currentTestFolder, new Error("No test path configured."));
        }

        getTestSuiteFolderPath() {
            return project.rootDir;
        }

        async throwExecption(message: string, screenshot: boolean) {
            if (screenshot) {
                const screenShotOutputPath = await takeErrorScreenShot(ctx, currentTestFolder);
                const screenShotMessage = screenshot ? ` Screenshot saved to '${screenShotOutputPath}'` : "";
                throw Error(`${message}${screenShotMessage}`);
            }
            throw Error(message);
        }
    }
}
