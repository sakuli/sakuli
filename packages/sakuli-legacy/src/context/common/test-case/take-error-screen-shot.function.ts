import { TestExecutionContext } from "@sakuli/core";
import { ensurePath, ifPresent, Maybe } from "@sakuli/commons";
import { getTestMetaData } from "./get-test-meta-data.function";
import { join } from "path";
import { ScreenApi } from "../actions";
import { cwd } from "process";

export const takeErrorScreenShot = async (ctx: TestExecutionContext, screenshotStorage: string, screenShotDestinationFolder: Maybe<string>) => {
    const {suiteName, caseName} = getTestMetaData(ctx);
    const folderName = `${suiteName}_${caseName}`;
    const errorString = `error_${folderName}`;
    const screenShotPath = ifPresent(screenShotDestinationFolder,
        (testFolder) => getScreenShotPath(testFolder, folderName, screenshotStorage),
        () => getScreenShotPath(cwd(), folderName, screenshotStorage));
    ctx.logger.debug(`Checking whether output folder ${screenShotPath} exists. Trying to create if not.`);
    await ensurePath(screenShotPath);
    return ScreenApi.takeScreenshotWithTimestamp(join(screenShotPath, errorString));
};

const getScreenShotPath = (folderPath: string, folderName: string, screenshotStorage: string): string => {
    if(screenshotStorage === "flat") {
        return folderPath;
    }
    return join(folderPath, folderName);
};