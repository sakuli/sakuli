import { TestExecutionContext } from "@sakuli/core";

declare const sakuliContext: TestExecutionContext;

export class TestCase {
    constructor(
        readonly caseId?: string,
        readonly warningTime: number = 0,
        readonly criticalTime: number = 0,
        readonly imagePaths: string[] = []
    ) {
        sakuliContext.startTestCase({id: caseId});
        sakuliContext.startTestStep({});
    }

    addImagePaths(...paths: string[]) {
        this.imagePaths.concat(paths);
    }

    endOfStep(
        stepName: string,
        warning: number = 0,
        critical: number = 0,
        forward: boolean = false
    ) {
        sakuliContext.updateCurrentTestStep({
            id: stepName,
            warningTime: warning,
            criticalTime: critical
        });
        sakuliContext.endTestStep();
        sakuliContext.startTestStep();
    }

    handleException<E extends Error>(e: E) {

    }

    getLastUrl(): string {
        throw Error('Not Implemented')
    }

    saveResult() {
        sakuliContext.endTestStep();
        sakuliContext.endTestCase();
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