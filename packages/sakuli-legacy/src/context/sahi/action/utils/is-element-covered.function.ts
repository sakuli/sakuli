import { WebDriver, WebElement } from "selenium-webdriver";

export async function isElementCovered(
  elem: WebElement,
  driver: WebDriver
): Promise<boolean> {
  return driver.executeScript(
    `
    // get the outermost ancestor of the element. This will be either the document
    // or a shadow root.
    let owner = arguments[0]
    while(owner.parentNode) {
        owner = owner.parentNode;
    }
    
    let elemLocation = arguments[0].getBoundingClientRect();
    let x = elemLocation.left + (elemLocation.right - elemLocation.left) / 2;
    let y = elemLocation.top + (elemLocation.bottom - elemLocation.top) / 2;    
    
    let elemAtPoint = owner.elementFromPoint(x, y);
    
    return elemAtPoint !== arguments[0]
    `,
    elem
  );
}
