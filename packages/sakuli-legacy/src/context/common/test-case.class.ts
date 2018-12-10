import {Sakuli, TestExecutionContext} from "@sakuli/core";


export class TestCase {
    private readonly execution: TestExecutionContext;
    constructor(
        readonly caseId?: string,
        readonly warningTime: number = 0,
        readonly criticalTime: number = 0,
        private _imagePaths: string[] = []
    ) {
        this.execution = Sakuli().testExecutionContext;
        this.execution.startTestCase({id: caseId});
        this.execution.startTestStep({});
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
        this.execution.updateCurrentTestStep({
            id: stepName,
            warningTime: warning,
            criticalTime: critical
        });
        this.execution.endTestStep();
        this.execution.startTestStep();
    }

    handleException<E extends Error>(e: E) {
        console.warn('Error occurred: ', e);
        this.execution.updateCurrentTestStep({error: e});
    }

    getLastUrl(): string {
        throw Error('Not Implemented');

    }

    saveResult() {
        this.execution.endTestStep();
        this.execution.endTestCase();
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