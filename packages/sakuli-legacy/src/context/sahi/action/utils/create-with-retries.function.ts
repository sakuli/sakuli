import { error as SeleniumErrors } from "selenium-webdriver";
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
                        ctx.logger.trace(`StaleElement: ${initialTries - retries} - ${e.stack}`)
                    } else {
                        ctx.logger.trace(`A non StaleElementReferenceError is thrown during retrying: ${e}`);
                        throw e;
                    }
                }
            }
            throw Error(`Failed on an action after ${initialTries} attempts.`)
        });
    }


}
