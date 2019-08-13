import {TestExecutionContext} from "@sakuli/core";
import {ifPresent, Maybe} from "@sakuli/commons";
import {getTestMetaData} from "./get-test-meta-data.function";
import {join} from "path";
import {ScreenApi} from "../actions/screen.function";
import {cwd} from "process";

export const takeErrorScreenShot = (ctx: TestExecutionContext, currentTestFolder: Maybe<string>) => {
    const {suiteName, caseName} = getTestMetaData(ctx);
    const errorString = `error_${suiteName}_${caseName}`;
    const screenShotPath = ifPresent(currentTestFolder,
        (testFolder) => join(testFolder, errorString),
        () => join(cwd(), errorString));
    return ScreenApi.takeScreenshotWithTimestamp(screenShotPath);
};
