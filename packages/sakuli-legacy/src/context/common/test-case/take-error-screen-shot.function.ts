import {TestExecutionContext} from "@sakuli/core";
import {ensurePath, ifPresent, Maybe} from "@sakuli/commons";
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
    ctx.logger.debug(`Checking whether output folder ${screenShotPath} exists. Trying to create if not.`);
    await ensurePath(screenShotPath);
    return ScreenApi.takeScreenshotWithTimestamp(join(screenShotPath, errorString));
};
