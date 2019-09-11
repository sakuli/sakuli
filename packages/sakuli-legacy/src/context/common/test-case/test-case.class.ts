import {cwd} from "process";
import {Project, TestExecutionContext, TestStepContext} from "@sakuli/core";
import nutConfig from "../nut-global-config.class";
import {ensure, ifPresent, Maybe, throwIfAbsent} from "@sakuli/commons";
import {isAbsolute, join} from "path";
import {TestCase} from "./test-case.interface";
import {TestStepCache} from "./steps-cache/test-step-cache.class";
import {takeErrorScreenShot} from "./take-error-screen-shot.function";
import {existsSync} from "fs";
import {LegacyProjectProperties} from "../../../loader/legacy-project-properties.class";

export function createTestCaseClass(ctx: TestExecutionContext,
                                    project: Project,
                                    currentTestFolder: Maybe<string>,
                                    testStepCache = new TestStepCache()
) {

    const legacyProps = project.objectFactory(LegacyProjectProperties);

    const screenShotDestPath = ensure(legacyProps.screenshotDir, currentTestFolder);
    return class SakuliTestCase implements TestCase {
        constructor(
            readonly caseId: string = 'Testcase',
            readonly warningTime: number = 0,
            readonly criticalTime: number = 0,
            public _imagePaths: string[] = []
        ) {
            ctx.logger.info(`Start Testcase ${caseId}`);
            ctx.startTestCase({id: caseId, warningTime, criticalTime});
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

        /**
         * @inheritDoc
         */
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


        /**
         * @inheritDoc
         */
        async handleException<E extends Error>(e: E) {
            ctx.updateCurrentTestStep({
                error: e,
            });
            if (legacyProps.errorScreenshot) {
                ctx.logger.debug(`screenShotDest: ${screenShotDestPath}`);
                const screenShotPath = await takeErrorScreenShot(ctx, screenShotDestPath);
                if (existsSync(screenShotPath)) {
                    ctx.logger.info(`Saved error screenshot at '${screenShotPath}'`);
                    ctx.updateCurrentTestStep({
                        screenshot: screenShotPath
                    });
                }
            }
            await ifPresent(ctx.getCurrentTestCase(), async ctc => {
                const cachedSteps = await testStepCache.read();
                const currentSteps = ctc.getChildren();
                if (currentSteps.length <= cachedSteps.length) {
                    const stepToUpdate = cachedSteps[currentSteps.length - 1];
                    ctx.updateCurrentTestStep(stepToUpdate);
                }
            }, () => Promise.resolve());
        }


        /**
         * @inheritDoc
         */
        getLastUrl(): string {
            throw Error('Not Implemented');
        }


        /**
         * @inheritDoc
         */
        async saveResult(forward: boolean = false) {
            ctx.endTestStep();
            ctx.endTestCase();
            await ifPresent(ctx.getCurrentTestCase(), async ctc => {
                await ifPresent(ctx.getCurrentTestStep(), async cts => {
                    if (!cts.error) {
                        try {
                            await testStepCache.write(ctc.getChildren() as TestStepContext[]);
                        } catch (e) {
                            ctx.logger.warn("Failed to update steps cache. Reason:", e);
                        }
                    }
                });
            }, () => Promise.resolve())
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
            return throwIfAbsent(currentTestFolder, new Error("No test path configured."));
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
                const screenShotOutputPath = await takeErrorScreenShot(ctx, screenShotDestPath);
                const screenShotMessage = (screenshot && existsSync(screenShotOutputPath)) ? ` Screenshot saved to '${screenShotOutputPath}'` : "";
                throw Error(`${message}${screenShotMessage}`);
            }
            throw Error(message);
        }
    }
}
