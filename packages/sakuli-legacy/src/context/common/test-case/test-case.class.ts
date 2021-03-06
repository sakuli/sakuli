import { cwd } from "process";
import {
  Project,
  TestCaseContext,
  TestExecutionContext,
  TestStepContext,
} from "@sakuli/core";
import nutConfig from "../nut-global-config.class";
import {
  ensure,
  ifPresent,
  Maybe,
  throwIfAbsent,
  throwOnRuntimeTypeMissmatch,
} from "@sakuli/commons";
import { isAbsolute, join } from "path";
import { TestCase } from "./test-case.interface";
import { TestStepCache } from "./steps-cache/test-step-cache.class";
import { takeErrorScreenShot } from "./take-error-screen-shot.function";
import { existsSync } from "fs";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";
import { releaseKeys } from "../release-keys.function";
import { getActiveKeys } from "../button-registry";
import { createKeyboardApi, createMouseApi } from "../actions";
import * as util from "util";

function validateArgumentTypes(
  caseId: string,
  warningTime: number,
  criticalTime: number,
  imagePaths: string[]
) {
  throwOnRuntimeTypeMissmatch(
    caseId,
    "String",
    `Parameter caseId is invalid, string expected. Value: ${caseId}`
  );
  throwOnRuntimeTypeMissmatch(
    warningTime,
    "Number",
    `Parameter warningTime is invalid, number expected. Value: ${warningTime}`
  );
  throwOnRuntimeTypeMissmatch(
    criticalTime,
    "Number",
    `Parameter criticalTime is invalid, number expected. Value: ${criticalTime}`
  );
  for (const imagePath of imagePaths) {
    throwOnRuntimeTypeMissmatch(
      imagePath,
      "String",
      `Parameter _imagePaths is invalid, string expected. Value: ${imagePath}`
    );
  }
}

export function createTestCaseClass(
  ctx: TestExecutionContext,
  project: Project,
  currentTestFolder: Maybe<string>,
  testStepCache = new TestStepCache()
) {
  const legacyProps = project.objectFactory(LegacyProjectProperties);

  const screenShotDestPath = ensure(
    legacyProps.screenshotDir,
    currentTestFolder
  );

  async function updateFromTestStepCache(ctc: TestCaseContext) {
    const cachedSteps = await testStepCache.read();
    const currentSteps = ctc.getChildren();
    if (currentSteps.length <= cachedSteps.length) {
      const stepToUpdate = cachedSteps[currentSteps.length - 1];
      ctx.updateCurrentTestStep(stepToUpdate);
    }
  }

  async function takeErrorScreenshot() {
    try {
      const screenShotPath = await takeErrorScreenShot(
        ctx,
        legacyProps.screenshotStorage,
        screenShotDestPath
      );
      if (existsSync(screenShotPath)) {
        ctx.logger.info(`Saved error screenshot at '${screenShotPath}'`);
        ctx.updateCurrentTestStep({
          screenshot: screenShotPath,
        });
      }
    } catch (exception) {
      ctx.logger.warn(
        `Failed to store error screenshot under path ${screenShotDestPath}. Reason: ${exception}`
      );
    }
  }

  /**
   * Runtime type guard to ensure the given object is an Error.
   * @param error The object to be checked
   * @private
   */
  function validateError<E>(error: E) {
    if (!util.types.isNativeError(error)) {
      const invalidObjectErrorMessage =
        "handleException has been called with a parameter that is not of type Error.";

      let objectRepresentation;
      switch (typeof error) {
        case "function":
          objectRepresentation = error.toString();
          break;
        case "undefined":
          objectRepresentation = "undefined";
          break;
        case "symbol":
          objectRepresentation = (error as Symbol).toString();
          break;
        case "bigint":
        case "boolean":
        case "number":
        case "string":
        case "object":
          objectRepresentation = JSON.stringify(error);
          break;
      }

      ctx.logger.error(
        `${invalidObjectErrorMessage} Object was:`,
        objectRepresentation
      );
      throw Error(invalidObjectErrorMessage);
    }
  }

  /**
   * Runtime resilience functionality in case some promise rejects a string instead of an object fulfilling the Error
   * interface of Typescript.
   * @param originalError The error to be checked for conversion
   * @private
   */
  function convertToErrorIfFeasible(originalError: Error | string) {
    if (typeof originalError === "string") {
      ctx.logger.warn(
        "handleException has been called with a parameter that is of type 'string'. Converting message to Error..."
      );
      return Error(originalError);
    }
    return originalError;
  }

  return class SakuliTestCase implements TestCase {
    constructor(
      readonly caseId: string = "Testcase",
      readonly warningTime: number = 0,
      readonly criticalTime: number = 0,
      public _imagePaths: string[] = []
    ) {
      validateArgumentTypes(caseId, warningTime, criticalTime, _imagePaths);

      ctx.startTestCase({ id: caseId, warningTime, criticalTime });
      ctx.startTestStep({});
      nutConfig.imagePaths = [cwd()];
      const testFolder = throwIfAbsent(
        currentTestFolder,
        new Error("No testcase folder provided")
      );
      nutConfig.addImagePath(testFolder);
      this.addImagePaths(..._imagePaths);
    }

    addImagePaths(...paths: string[]) {
      for (let path of paths) {
        if (isAbsolute(path)) {
          nutConfig.addImagePath(path);
        } else {
          ifPresent(currentTestFolder, (testFolder) =>
            nutConfig.addImagePath(join(testFolder, path))
          );
        }
      }
    }

    /**
     * @inheritDoc
     */
    startStep(stepName: string, warning: number = 0, critical: number = 0) {
      const testStep = {
        id: stepName,
        warningTime: warning,
        criticalTime: critical,
      };

      const currentTestStep = ctx.getCurrentTestStep();
      if (currentTestStep?.id) {
        ctx.endTestStep();
        ctx.startTestStep(testStep);
      } else {
        ctx.updateCurrentTestStep(testStep);
      }
    }

    /**
     * @inheritDoc
     */
    endOfStep(
      stepName: string,
      warning: number = 0,
      critical: number = 0,
      forward: boolean = false
    ) {
      let currentTestStep = ctx.getCurrentTestStep();
      if (!currentTestStep?.id) {
        currentTestStep = ctx.updateCurrentTestStep({
          id: stepName,
          warningTime: warning,
          criticalTime: critical,
        });
      }
      if (currentTestStep?.id === stepName) {
        ctx.endTestStep();
        ctx.startTestStep();
      } else {
        throw Error(
          `Inconsistent test steps: Current test step is '${currentTestStep?.id}' but you tried to end '${stepName}'.`
        );
      }
    }

    /**
     * @inheritDoc
     */
    async handleException<E extends Error>(originalError: E) {
      await releaseKeys(
        getActiveKeys(),
        createMouseApi(legacyProps),
        createKeyboardApi(legacyProps)
      );

      const error = convertToErrorIfFeasible(originalError);
      validateError(error);

      ctx.logger.error(
        `Error in testcase ${this.caseId}: ${error.message}`,
        error.stack
      );
      ctx.updateCurrentTestStep({
        error: error,
      });

      if (legacyProps.errorScreenshot) {
        await takeErrorScreenshot();
      }

      await ifPresent(
        ctx.getCurrentTestCase(),
        (ctc: TestCaseContext) => updateFromTestStepCache(ctc),
        () => Promise.resolve()
      );
    }

    /**
     * @inheritDoc
     */
    getLastUrl(): string {
      throw Error("Not Implemented");
    }

    /**
     * @inheritDoc
     */
    async saveResult(forward: boolean = false) {
      ctx.endTestStep();
      ctx.endTestCase();
      ifPresent(
        ctx.getCurrentTestCase(),
        (ctc) => {
          ifPresent(ctx.getCurrentTestStep(), async (cts) => {
            if (!cts.error) {
              try {
                await testStepCache.write(
                  ctc.getChildren() as TestStepContext[]
                );
              } catch (e) {
                ctx.logger.warn("Failed to update steps cache. Reason:", e);
              }
            }
          });
        },
        () => Promise.resolve()
      );
      await releaseKeys(
        getActiveKeys(),
        createMouseApi(legacyProps),
        createKeyboardApi(legacyProps)
      );
    }

    /**
     * @inheritDoc
     */
    getID() {
      return this.caseId;
    }

    /**
     * @inheritDoc
     */
    getTestCaseFolderPath() {
      return throwIfAbsent(
        currentTestFolder,
        new Error("No test path configured.")
      );
    }

    /**
     * @inheritDoc
     */
    getTestSuiteFolderPath() {
      return project.rootDir;
    }

    /**
     * @inheritDoc
     */
    async throwException(message: string, screenshot: boolean) {
      if (screenshot) {
        let screenShotMessage = "";
        try {
          const screenShotOutputPath = await takeErrorScreenShot(
            ctx,
            legacyProps.screenshotStorage,
            screenShotDestPath
          );
          screenShotMessage = existsSync(screenShotOutputPath)
            ? ` Screenshot saved to '${screenShotOutputPath}'`
            : "";
        } catch (e) {
          ctx.logger.warn(
            `Failed to store error screenshot under path ${screenShotDestPath}. Reason: ${e}`
          );
        }
        throw Error(`${message}${screenShotMessage}`);
      }
      throw Error(message);
    }
  };
}
