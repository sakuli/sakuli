import { WebElement } from "selenium-webdriver";
import { stripIndents } from "common-tags";

export async function highlightElement(element: WebElement, timeoutMs: number) {
  const elementRect = await element.getRect();
  if (elementRect) {
    await element.getDriver().executeAsyncScript(
      stripIndents`
            var rect = arguments[0];
            var timeout = arguments[1];
            var done = arguments[arguments.length -1];
            var element = document.createElement('div');

            element.style.border = '2px solid red';
            element.style.position = 'absolute';
            element.style.top = rect.y + 'px';
            element.style.left = rect.x + 'px';
            element.style.width = rect.width + 'px';
            element.style.height = rect.height + 'px';
            element.style.zIndex = 99999;
            element.style.background = 'transparent';

            document.body.appendChild(element);

            setTimeout(function() {
                document.body.removeChild(element);
                done();
            }, timeout);
        `,
      elementRect,
      timeoutMs
    );
  } else {
    await fallbackHighlightWithBorder(element, timeoutMs);
  }
}

export async function fallbackHighlightWithBorder(
  elementToHighlight: WebElement,
  timeoutMs: number
) {
  await elementToHighlight.getDriver().executeAsyncScript(
    stripIndents`
            var element = arguments[0];
            var timeout = arguments[1];
            var done = arguments[arguments.length -1];
            
            var oldStyle;
            try {
              oldStyle = window.getComputedStyle(element);
            } catch (e) {
              console.log("Caught error on getComputedStyle: " + e);
              done();
            }
            
            element.style.border = '2px solid red';

            setTimeout(function() {
                element.style.cssText = oldStyle.cssText;
                done();
            }, timeout);
        `,
    elementToHighlight,
    timeoutMs
  );
}
