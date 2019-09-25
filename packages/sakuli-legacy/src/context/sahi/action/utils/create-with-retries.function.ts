import { ThenableWebDriver, WebElement, error as SeleniumErrors } from "selenium-webdriver";
import { AccessorUtil } from "../../accessor";
import { ifPresent } from "@sakuli/commons/dist";
import { isSahiElementQuery, SahiElementQueryOrWebElement } from "../../sahi-element.interface"
import { TestExecutionContext } from "@sakuli/core";

export function createWithRetries(
    ctx: TestExecutionContext
) {
    return function withRetries<ARGS extends any[], R>(
        retries: number,
        func: (...args: ARGS) => Promise<R>,
    ): (...args: ARGS) => Promise<R> {
        return (async (...args: ARGS) => {
            const initialTries = retries;
            while (retries) {
                try {
                    return await func(...args);
                } catch (e) {
                    if (e instanceof SeleniumErrors.StaleElementReferenceError) {
                        --retries;
                        ctx.logger.debug(`StaleElement: ${initialTries - retries} - ${e.stack}`)
                    } else {
                        throw Error(`A non StaleElementReferenceError is thrown during retrying;  \n${e}`)
                    }
                }
            }
            throw Error(`Failed on an action after ${initialTries} attempts.`)
        });
    }


}
