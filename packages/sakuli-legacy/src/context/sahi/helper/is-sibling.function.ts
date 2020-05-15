import { WebElement } from "selenium-webdriver";
import { isEqual } from "./is-equal.function";
import { getParent } from "./get-parent.function";
import { throwIfAbsent } from "@sakuli/commons";

export async function isSibling(
  a: WebElement,
  b: WebElement
): Promise<boolean> {
  try {
    const aParent = throwIfAbsent(await getParent(a));
    const bParent = throwIfAbsent(await getParent(b));
    return isEqual(aParent, bParent);
  } catch (e) {
    return false;
  }
}
