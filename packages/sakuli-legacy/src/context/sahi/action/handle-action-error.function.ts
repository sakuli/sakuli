import { error, ThenableWebDriver } from "selenium-webdriver";
import { SahiElementQuery, isSahiElementQuery, sahiQueryToString } from "../sahi-element.interface";
import {Maybe, ifPresent} from '@sakuli/commons';
import { AccessorUtil } from "../accessor";

function findQuery(args: any[]): Maybe<SahiElementQuery> {
    return args.find(isSahiElementQuery);
}

/**
 * This function will get an Error and the original function that thrown this error
 *
 * If this function returns without any throwing any other error (or rethrow the passed error) the error can be assumed as "recovered"
 *
 * @param driver
 * @param accessorUtil
 */
export function tryToRecover(
    driver: ThenableWebDriver,
    accessorUtil: AccessorUtil
) {
    return async function <ARGS extends any[], R>(e: Error, original: (...args: ARGS) => Promise<R>, ...args: ARGS) {
        if(e instanceof error.StaleElementReferenceError) {
            return; // No bail the action will retry when retries left
        }
        if(e instanceof error.MoveTargetOutOfBoundsError) {
            await ifPresent(findQuery(args), async q => {
                const e = await accessorUtil.fetchElement(q);
                await driver.executeScript(`arguments[0].scrollIntoView(true)`, e);
                await original(...args)
                    .then(
                    () => Promise.resolve(),
                    e => {
                        return driver.executeScript(`arguments[0].scrollIntoView(false)`, e).then(() => original(...args))
                    });

            }, () => {
                return Promise.resolve()
            })
            return;
        }

        throw e;
    }

}
