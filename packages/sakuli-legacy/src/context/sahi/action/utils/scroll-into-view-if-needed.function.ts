import { WebElement } from "selenium-webdriver";

export async function scrollIntoViewIfNeeded(element: WebElement): Promise<void> {
    return element.getDriver().executeScript<void>(`
        return arguments[0].scrollIntoView({
            inline: "center",
            block: "center"
        });
    `, element).catch((): void => {});
}
