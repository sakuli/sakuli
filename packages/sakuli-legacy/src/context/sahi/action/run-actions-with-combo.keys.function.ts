import {WebElement} from "selenium-webdriver";
import {getSeleniumKeysFromComboString} from "./sahi-selenium-key-map.const";
import {Actions} from 'selenium-webdriver/lib/input';

export function runActionsWithComboKeys(
    actions: Actions,
    e: WebElement,
    combo: string = '',
    whileKeysDown: (a: Actions) => void = () => {
    }) {
    const keys = getSeleniumKeysFromComboString(combo);
    keys.forEach(k => actions.keyDown(k));
    whileKeysDown(actions);
    keys.forEach(k => actions.keyUp(k));
    return actions;
}