import {WebElement} from "selenium-webdriver";

export async function isEqual(a: WebElement, b: WebElement) {
    return await a.getId() === await b.getId();
}