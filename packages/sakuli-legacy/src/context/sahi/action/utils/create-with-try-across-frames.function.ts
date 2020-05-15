import { By, error as SeleniumErrors, ThenableWebDriver, } from "selenium-webdriver";
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
        for (let frame of frames) {
          try {
            await driver.switchTo().frame(frame);
            return await func(...args);
          } catch (currentError) {
            if (currentError instanceof SeleniumErrors.TimeoutError) {
              ctx.logger.trace(
                `Received TimoutError when searching for element in frame, not updating error history`
              );
            } else {
              ctx.logger.trace(
                `Received ${currentError} when searching for element in frame, updating error history`
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
