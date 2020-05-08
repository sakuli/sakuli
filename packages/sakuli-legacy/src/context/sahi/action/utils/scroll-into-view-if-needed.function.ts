import { WebElement } from "selenium-webdriver";
import { TestExecutionContext } from "@sakuli/core";

/**
 * scrollIntoViewIfNeeded will scroll a given {@link WebElement} into view to perform further actions on it.
 * This is necessary to avoid errors due to elements not being in the current viewport.
 *
 * scrollIntoViewIfNeeded solves this problem by executing a script which calls scrollIntoView on a given element.
 * Additionally, it will register a timeout (isScrollingTimeout) to handle
 *
 * - no scrolling at all, so the script will resolve after an initial delay
 * - continuous scrolling, which will continuously update the timeout as long as we're still scrolling
 *
 * The reasoning for this behaviour is the fact that scrollIntoView resolves immediately,
 * without taking into account the time the browser take to actually scroll the viewport.
 * By adding an eventlistener to the browser's 'scroll' event, we're manually waiting for scrolling to end via said timeout
 *
 * @param element The {@link WebElement} to scroll into view
 * @param ctx The current {@link TestExecutionContext}
 */
export async function scrollIntoViewIfNeeded(
  element: WebElement,
  ctx: TestExecutionContext
): Promise<boolean> {
  if (!element) {
    ctx.logger.debug("scroll into view failed: element was null or undefined");
    return false;
  }
  ctx.logger.trace(
    `scroll into view started with element: ${JSON.stringify(element)}`
  );
  try {
    const returnValue = await element.getDriver().executeAsyncScript<boolean>(
      `
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
    `,
      element
    );
    ctx.logger.trace(
      `scroll into view finished for element: ${JSON.stringify(
        element
      )} with value ${returnValue}`
    );
    return returnValue;
  } catch (e) {
    ctx.logger.trace(
      `Caught ${e} when trying to scroll element: ${JSON.stringify(
        element
      )} into view`
    );
    return false;
  }
}
