export interface NewableTestCase {
  new (
    caseId?: string,
    warningTime?: number,
    criticalTime?: number,
    _imagePath?: string[]
  ): TestCase;
}

export interface TestCase {
  readonly caseId?: string;
  readonly warningTime: number;
  readonly criticalTime: number;
  _imagePaths: string[];

  addImagePaths(...paths: string[]): void;

  /**
   * Starts a new test step.
   * startStep can be used to end the current test step and start a new one by calling startStep again.
   *
   * @param stepName - Name of the test step to start
   * @param warning - warning threshold of the test step. Exceeding warning threshold changes the state transmitted to monitoring systems.
   * @param critical - critical threshold of the test step. Exceeding critical threshold changes the state transmitted to monitoring systems.
   */
  startStep(stepName: string, warning?: number, critical?: number): void;

  /**
   * @deprecated
   * Updates the current current test step with the provided parameters, finishes that step and immediately starts a new test step.
   *
   * If endOfStep is used in combination with startStep, the provided stepName must match the current test step name.
   * Otherwise and error will be thrown because of the inconsistency in test step names.
   *
   * @param stepName
   * @param warning
   * @param critical
   * @param forward - deprecated: The logic is handled by the dedicated forwarder
   */
  endOfStep(
    stepName: string,
    warning?: number,
    critical?: number,
    forward?: boolean
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
