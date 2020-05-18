import { WebElement } from "selenium-webdriver";
import { ifPresent } from "@sakuli/commons";
import { getParent } from "./get-parent.function";
import { isEqual } from "./is-equal.function";

export async function isChildOf(
  child: WebElement,
  potentialParent: WebElement
): Promise<boolean> {
  return ifPresent(
    await getParent(child),
    async (parent) => {
      if (await isEqual(potentialParent, parent)) {
        return true;
      } else {
        return isChildOf(parent, potentialParent);
      }
    },
    () => Promise.resolve(false)
  );
}
