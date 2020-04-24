import {WebElement} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";

export async function scrollIntoViewIfNeeded(element: WebElement, ctx: TestExecutionContext): Promise<void> {
    if (!element) {
        ctx.logger.debug("scroll into view failed: element was null or undefined");
        return Promise.resolve();
    }
    ctx.logger.trace(`scroll into view started with element: ${JSON.stringify(element)}`);
    return element.getDriver().executeAsyncScript<void>(`
        const __done__ = arguments[arguments.length - 1];
        const skipNoScrollTimeout = setTimeout(__done__, 200);
        let isScrollingTimeout;
        window.addEventListener('scroll', (event) => {
            window.clearTimeout(skipNoScrollTimeout);
            window.clearTimeout(isScrollingTimeout);
            isScrollingTimeout = setTimeout(__done__, 200);
        }, false);
        arguments[0].scrollIntoView({
            inline: "center",
            block: "center"
        });
    `, element)
        .then(() => ctx.logger.trace(`scroll into view finished for element: ${JSON.stringify(element)}`))
        .catch((e) => ctx.logger.trace(`Caught ${e} when trying to scroll element: ${JSON.stringify(element)} into view`));
}
