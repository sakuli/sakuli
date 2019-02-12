import {By, WebElement} from "selenium-webdriver";

export async function getParent(element: WebElement) {
    try {
        return await element.findElement(By.xpath('..'));
    } catch (e) {
        return null;
    }
}