import { By, WebElement } from "selenium-webdriver";

export async function getSiblings(element: WebElement): Promise<WebElement[]> {
  return element.findElements(By.xpath("../*"));
}
