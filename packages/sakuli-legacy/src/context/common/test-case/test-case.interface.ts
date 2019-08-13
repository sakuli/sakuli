export interface TestCase {
    readonly caseId?: string;
    readonly warningTime: number;
    readonly criticalTime: number;
    _imagePaths: string[];

    addImagePaths(...paths: string[]): void;

    /**
     *
     * Updates the current current test step with the provided parameters and
     * finishes that step.
     *
     * Immediately starts a new TestStep.
     *
     * @param stepName
     * @param warning
     * @param critical
     * @param forward - deprecated: The logic is handled by the dedicated forwarder
     */
    endOfStep(
        stepName: string,
        warning: number,
        critical: number,
        forward: boolean
    ): void;

    /**
     * Creates an Errorscreenshot at the time the method is invoked
     * Then updates the current Testcase with the given Error
     *
     * If there are cached test-step information, the current test-step will be updated
     * because otherwise `endOfStep` (which usually updates that information)
     * will not be invoked after the error is thrown
     *
     * @param e - an Error object which is written to
     */
    handleException<E extends Error>(e: E): Promise<void>;

    getLastUrl(): string;

    /**
     *
     * Finishes the current TestStep and the the TestCase
     *
     * If no error occurred during the TestCase all TestSteps are written to the cache.
     *
     * @param forward - deprecated: The logic is handled by the dedicated forwarder
     */
    saveResult(forward?: boolean): void;

    getID(): string;

    getTestCaseFolderPath(): any;

    getTestSuiteFolderPath(): any;

    throwException(message: string, screenshot: boolean): Promise<void>;
}