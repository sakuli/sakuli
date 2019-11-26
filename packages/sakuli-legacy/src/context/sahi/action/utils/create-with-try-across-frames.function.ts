import { ThenableWebDriver, By } from "selenium-webdriver";
import { TestExecutionContext } from "@sakuli/core";

export function createWithTryAcrossFrames(
    driver: ThenableWebDriver
) {
    return function withTryAcrossFrames<ARGS extends any[], R>(
        func: (...args: ARGS) => Promise<R>,
    ): (...args: ARGS) => Promise<R> {
        return (async (...args: ARGS) => {
            return await func(...args)
                .catch(async originError => {
                    const frames = await driver.findElements(By.css('frame, iframe'));
                    let latestError = originError;
                    for(let frame of frames) {
                        try {
                            await driver.switchTo().frame(frame);
                            return await func(...args);
                        } catch(currentError) {
                            latestError = currentError
                        } finally {
                            await driver.switchTo().defaultContent();
                        }
                    }
                    throw latestError;
                })
        });
    }
}
