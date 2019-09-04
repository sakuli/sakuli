import {TestExecutionContext} from "@sakuli/core";
import {ifPresent, Maybe, ensurePath} from "@sakuli/commons";
import {getTestMetaData} from "./get-test-meta-data.function";
import {join} from "path";
import {ScreenApi} from "../actions/screen.function";
import {cwd} from "process";

export const takeErrorScreenShot = async (ctx: TestExecutionContext, screenShotDestinationFolder: Maybe<string>) => {
    const {suiteName, caseName} = getTestMetaData(ctx);
    const errorString = `error_${suiteName}_${caseName}`;
    const screenShotPath = ifPresent(screenShotDestinationFolder,
        (testFolder) => join(testFolder, errorString),
        () => join(cwd(), errorString));
    await ensurePath(screenShotPath);
    return ScreenApi.takeScreenshotWithTimestamp(screenShotPath);
};
