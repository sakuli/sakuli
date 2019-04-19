import {WebElement} from "selenium-webdriver";
import {isChildOf} from "./is-child-of.function";
import {throwIfAbsent} from "@sakuli/commons";
import {getParent} from "./get-parent.function";
import {isSibling} from "./is-sibling.function";

export async function distanceToParent(child: WebElement, parent: WebElement): Promise<number> {
    if(await isSibling(child,parent)) {
        return 0;
    }
    if(!(await isChildOf(child,parent))) {

        throw Error(`Element ${child.toString()} must be a child or sibling of ${parent.toString()}`)
    }
    const aParent = throwIfAbsent(await getParent(child));
    return 1 + await distanceToParent(aParent, parent);
}