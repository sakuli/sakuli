import { error, ThenableWebDriver } from "selenium-webdriver";
import { SahiElementQuery, isSahiElementQuery, sahiQueryToString } from "../sahi-element.interface";
import {Maybe, ifPresent} from '@sakuli/commons';
import { AccessorUtil } from "../accessor";

function findQuery(args: any[]): Maybe<SahiElementQuery> {
    return args.find(isSahiElementQuery);
}

export function tryToRecover(
    driver: ThenableWebDriver,
    accessorUtil: AccessorUtil
) {
    return async function <ARGS extends any[], R>(e: Error, original: (...args: ARGS) => Promise<R>, ...args: ARGS) {
        if(e instanceof error.StaleElementReferenceError) {
            return; // No bail the action will retry when retries left
        }
        if(e instanceof error.MoveTargetOutOfBoundsError) {
            console.log('Recover from MoveTargetOutOfBoundsError:');
            await ifPresent(findQuery(args), async q => {
                console.log('fetch query', sahiQueryToString(q));
                const e = await accessorUtil.fetchElement(q);
                console.log('found', e);
                await driver.executeScript(`arguments[0].scrollIntoView(true)`, e);
                console.log('scrolled');
                await original(...args)
                    .then(
                    () => console.log('it actually worked out :)'),
                     e => {
                        console.log('recover 1');
                        return driver.executeScript(`arguments[0].scrollIntoView(false)`, e).then(() => original(...args))
                    });

            }, () => {
                console.log('No query in args');
                return Promise.resolve()
            })
            return;
        }

        throw Error(`An irrecoverable, non StaleElementReferenceError is thrown during retrying;  \n${e}`)
    }

}
