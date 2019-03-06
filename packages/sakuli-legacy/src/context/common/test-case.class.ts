import {Sakuli, TestExecutionContext} from "@sakuli/core";

export function createTestCaseClass(ctx: TestExecutionContext) {
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
        }

        addImagePaths(...paths: string[]) {
            this._imagePaths = this._imagePaths.concat(paths);
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

        handleException<E extends Error>(e: E) {
            ctx.updateCurrentTestCase({error: e});
        }

        getLastUrl(): string {
            throw Error('Not Implemented');
        }

        saveResult() {
            ctx.endTestStep();
            ctx.endTestCase();
        }

        getID() {
            return this.caseId;
        }

        getTestCaseFolderPath() {
            throw Error('Not Implemented')
        }

        getTestSuiteFolderPath() {
            throw Error('Not Implemented')
        }

        throwExecption(message: string, screenshot: boolean) {
            throw Error('Not Implemented')
        }
    }
}