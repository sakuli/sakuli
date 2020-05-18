import { WebElement } from "selenium-webdriver";
import { getSiblings } from "./get-siblings.function";
import { isEqual } from "./is-equal.function";

export async function getSiblingIndex(element: WebElement): Promise<number> {
  const siblings = await getSiblings(element);
  let index = 0;
  for (const e of siblings) {
    if (await isEqual(e, element)) {
      return index;
    }
    index++;
  }
  return NaN;
}
