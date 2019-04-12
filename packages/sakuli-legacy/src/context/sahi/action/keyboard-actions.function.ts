import {Key, ThenableWebDriver} from "selenium-webdriver";
import {AccessorUtil} from "../accessor";
import {TestExecutionContext} from "@sakuli/core";
import {SahiElementQueryOrWebElement} from "../sahi-element.interface";
import {stripIndents} from "common-tags";
import {CharInfo, charInfoToKey} from "./char-info.interface";
import {NativeEventDispatcher} from "./native-event-dispatcher.class";
import {getSeleniumKeysFromComboString} from "./sahi-selenium-key-map.const";

export function keyboardActionApi(
    webDriver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
) {


    async function _setValue(query: SahiElementQueryOrWebElement, value: string): Promise<void> {
        const element = await accessorUtil.fetchElement(query);
        try {
            for (let char of value.split('')) {
                await new Promise(res => setTimeout(res, 10));
                await element.sendKeys(char);
            }
            //await element.sendKeys(...value.split(''));
        } catch (e) {
            await webDriver.executeAsyncScript(stripIndents`
                const e = arguments[0];
                const value = arguments[1];
                const done = arguments[arguments.length -1];
                e.value = value;
                done(); 
            `, e, value);
        }
    }

    async function keyEvent(query: SahiElementQueryOrWebElement, charInfo: CharInfo, combo: string, eventName: string) {
        const e = await accessorUtil.fetchElement(query);
        const dispatcher = new NativeEventDispatcher(e);
        const keys = getSeleniumKeysFromComboString(combo);
        const value = charInfoToKey(charInfo);
        return dispatcher.dispatchKeyboardEvent(eventName, {
            key: value,
            altKey: keys.includes(Key.ALT),
            ctrlKey: keys.includes(Key.CONTROL),
            metaKey: keys.includes(Key.META),
            shiftKey: keys.includes(Key.SHIFT),
            code: `${value.charCodeAt(0)}`
        })
    }

    async function _keyDown(query: SahiElementQueryOrWebElement, charInfo: CharInfo, combo: string = "") {
        return keyEvent(query, charInfo, combo, 'keydown');
    }

    async function _keyUp(query: SahiElementQueryOrWebElement, charInfo: CharInfo) {
        return keyEvent(query, charInfo, '', 'keyup');
    }

    /**
     * @deprecated
     * This feature is no longer recommended. Though some browsers might still support it, it may have already been removed from the relevant web standards, may be in the process of being dropped, or may only be kept for compatibility purposes. Avoid using it, and update existing code if possible; see the compatibility table at the bottom of this page to guide your decision. Be aware that this feature may cease to work at any time.
     * @param query
     * @param charInfo
     * @param combo
     * @private
     */
    async function _keyPress(query: SahiElementQueryOrWebElement, charInfo: CharInfo, combo: string = "") {
        return keyEvent(query, charInfo, combo, 'keypress');
    }

    async function _type(query: SahiElementQueryOrWebElement, text: string) {
        const e = await accessorUtil.fetchElement(query);
        return e.sendKeys(...text.split(''));
    }

    return ({
        _setValue,
        _keyDown,
        _keyUp,
        _keyPress,
        _type
    })
}