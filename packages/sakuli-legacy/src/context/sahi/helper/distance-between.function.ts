import { WebElement } from "selenium-webdriver";
import { getNearestCommonParent } from "./get-nearest-common-parent.function";
import { distanceToParent } from "./distance-to-parent.function";
import { isSibling } from "./is-sibling.function";
import { isChildOf } from "./is-child-of.function";

export async function distanceBetween(
  a: WebElement,
  b: WebElement
): Promise<number> {
  if (await isSibling(a, b)) {
    return 0;
  }
  if (await isChildOf(a, b)) {
    return distanceToParent(a, b);
  }
  if (await isChildOf(b, a)) {
    return distanceToParent(b, a);
  }
  const ncp = await getNearestCommonParent(a, b);
  const [da, db] = await Promise.all([
    distanceToParent(a, ncp),
    distanceToParent(b, ncp),
  ]);
  return da + db;
}
