import {By, WebElement} from "selenium-webdriver";

export async function getParent(element: WebElement) {
    try {
        const el = await element.findElement(By.xpath('..'));
        // Trying to access the Element this throws an error in geckodriver
        // if the element is not a valid html element (chrome driver will throw
        // immediately in findElement method
        await el.getTagName();
        return el;
    } catch (e) {
        return null;
    }
}