import {TestExecutionContext} from "@sakuli/core";
import {ifPresent, Maybe, ensurePath} from "@sakuli/commons";
import {getTestMetaData} from "./get-test-meta-data.function";
import {join} from "path";
import {ScreenApi} from "../actions/screen.function";
import {cwd} from "process";

export const takeErrorScreenShot = async (ctx: TestExecutionContext, screenShotDestinationFolder: Maybe<string>) => {
    const {suiteName, caseName} = getTestMetaData(ctx);
    const folderName = `${suiteName}_${caseName}`;
    const errorString = `error_${folderName}`;
    const screenShotPath = ifPresent(screenShotDestinationFolder,
        (testFolder) => join(testFolder, folderName),
        () => join(cwd(), folderName));
    await ensurePath(screenShotPath);
    return ScreenApi.takeScreenshotWithTimestamp(join(screenShotPath, errorString));
};
