import {WebElement} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";

export async function scrollIntoViewIfNeeded(element: WebElement, ctx: TestExecutionContext): Promise<boolean> {
    if (!element) {
        ctx.logger.debug("scroll into view failed: element was null or undefined");
        return false;
    }
    ctx.logger.trace(`scroll into view started with element: ${JSON.stringify(element)}`);
    try {
        const returnValue = await element.getDriver().executeAsyncScript<boolean>(`
        const __done__ = arguments[arguments.length - 1];
        let isScrollingTimeout = setTimeout(() => resolve(false), 200);
        
        const scrollEventHandler = (event) => {
            window.clearTimeout(isScrollingTimeout);
            isScrollingTimeout = setTimeout(() => resolve(true), 150);
        };
        
        const resolve = (result) => {
            window.removeEventListener('scroll', scrollEventHandler, false);
            __done__(result);
        };
        
        window.addEventListener('scroll', scrollEventHandler, false);
        
        arguments[0].scrollIntoView({
            inline: "center",
            block: "center"
        });
    `, element);
        ctx.logger.trace(`scroll into view finished for element: ${JSON.stringify(element)} with value ${returnValue}`);
        return returnValue;
    } catch (e) {
        ctx.logger.trace(`Caught ${e} when trying to scroll element: ${JSON.stringify(element)} into view`);
        return false;
    }
}
