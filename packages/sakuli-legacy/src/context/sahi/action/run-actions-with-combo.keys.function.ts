import {ActionSequence, WebElement} from "selenium-webdriver";
import {getSeleniumKeysFromComboString} from "./sahi-selenium-key-map.const";

export function runActionsWithComboKeys(
    actions: ActionSequence,
    e: WebElement,
    combo: string = '',
    whileKeysDown: (a: ActionSequence) => void = () => {
    }) {
    const keys = getSeleniumKeysFromComboString(combo);
    keys.forEach(k => actions.keyDown(k));
    whileKeysDown(actions);
    keys.forEach(k => actions.keyUp(k));
    return actions;
}