import {WebElement} from "selenium-webdriver";
import {throwIfAbsent} from "@sakuli/commons";
import {getParent} from "./get-parent.function";
import {isChildOf} from "./is-child-of.function";

export async function getNearestCommonParent(a: WebElement, b: WebElement): Promise<WebElement> {
    const aParent = throwIfAbsent(await getParent(a));
    if(await isChildOf(b, aParent)) {
        return aParent
    } else {
        return getNearestCommonParent(b, aParent);
    }
}