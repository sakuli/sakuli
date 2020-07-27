import {
  By,
  error as SeleniumErrors,
  ThenableWebDriver,
} from "selenium-webdriver";
import { TestExecutionContext } from "@sakuli/core";

export function createWithTryAcrossFrames(
  driver: ThenableWebDriver,
  ctx: TestExecutionContext
) {
  return function withTryAcrossFrames<ARGS extends any[], R>(
    func: (...args: ARGS) => Promise<R>
  ): (...args: ARGS) => Promise<R> {
    return async (...args: ARGS) => {
      return await func(...args).catch(async (originError) => {
        const frames = await driver.findElements(By.css("frame, iframe"));
        let latestError = originError;
        ctx.logger.debug(`Number of detected frames: ${frames.length}`);
        for (let [idx, frame] of frames.entries()) {
          ctx.logger.debug(`Querying frame Nr.: ${idx}`);
          try {
            await driver.switchTo().frame(frame);
            return await func(...args);
          } catch (currentError) {
            if (currentError instanceof SeleniumErrors.TimeoutError) {
              ctx.logger.debug(
                `Received TimoutError when searching for element in frame Nr.: ${idx}, not updating error history`
              );
            } else {
              ctx.logger.debug(
                `Received ${currentError} when searching for element in frame Nr.: ${idx}, updating error history`
              );
              latestError = currentError;
            }
          } finally {
            await driver.switchTo().defaultContent();
          }
        }
        throw latestError;
      });
    };
  };
}
