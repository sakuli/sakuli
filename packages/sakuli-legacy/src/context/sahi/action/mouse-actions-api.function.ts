import {ActionSequence, Button, By, ILocation, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {AccessorUtil} from "../accessor";
import {TestExecutionContext} from "@sakuli/core";
import {SahiElementQueryOrWebElement} from "../sahi-element.interface";
import {stripIndents} from "common-tags";
import {getSeleniumKeysFromComboString} from "./sahi-selenium-key-map.const";
import {positionalInfo} from "../relations/positional-info.function";
import {runActionsWithComboKeys} from "./run-actions-with-combo.keys.function";

export function mouseActionApi(
    webDriver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
) {

    function pressComboKeys(actions: ActionSequence, e: WebElement, combo: string) {
        const keys = getSeleniumKeysFromComboString(combo);
        keys.forEach(k => {
            actions.keyDown(k);
        });
        return actions;
    }

    function releaseComboKeys(actions: ActionSequence, e: WebElement, combo: string) {
        const keys = getSeleniumKeysFromComboString(combo);
        keys.forEach(k => {
            actions.keyUp(k);
        });
        return actions;
    }

    async function _xy() {
        throw Error('Not yet implemented due to api incompability');
    }

    /**
     * _click simulates a user's click on the given element.
     *
     * @example
     * <code>
     * _click(_button("Click Me"));
     * _click(_button("Click Me"), "CTRL"); // clicks with CTRL key pressed
     * _click(_button("Click Me"), "CTRL|SHIFT"); // clicks with CTRL and SHIFT keys pressed
     *
     * // With _xy
     * _click(_xy(_button("Click Me"),4,5)); // Click at coordinates 4,5 pixels inside the button
     * </code>
     *
     * @param query query to the Element to click on
     * @param combo Any combo key: can be "CTRL", "SHIFT", "ALT" or "META";
     Can also be two or more keys together like "CTRL|SHIFT"
     This argument is applicable only for Browser mode
     * @private
     */
    async function _click(query: SahiElementQueryOrWebElement, combo: string = ""): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        return runActionsWithComboKeys(
            webDriver.actions(),
            e,
            combo,
            a => a.click(e)
        ).perform();
    }

    async function _mouseDown(query: SahiElementQueryOrWebElement, isRight: boolean = false, combo: string = ''): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        const mouseButton = isRight ? Button.RIGHT : Button.LEFT;
        return runActionsWithComboKeys(
            webDriver.actions(),
            e, combo,
            a => a.mouseDown(e, mouseButton)
        ).perform();
    }

    async function _mouseUp(query: SahiElementQueryOrWebElement, isRight: boolean = false, combo: string = ''): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        const mouseButton = isRight ? Button.RIGHT : Button.LEFT;
        return runActionsWithComboKeys(
            webDriver.actions(),
            e, combo,
            a => a.mouseUp(e, mouseButton)
        ).perform();
    }

    async function _rightClick(query: SahiElementQueryOrWebElement, combo: string = ''): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        return runActionsWithComboKeys(
            webDriver.actions(),
            e, combo,
            a => a.mouseDown(e, Button.RIGHT).mouseUp(e, Button.RIGHT)
        ).perform();
    }

    async function _mouseOver(query: SahiElementQueryOrWebElement, combo: string = '') {
        const e = await accessorUtil.fetchElement(query);
        return runActionsWithComboKeys(
            webDriver.actions(),
            e, combo,
            a => a.mouseMove(e)
        ).perform();
    }

    async function _check(query: SahiElementQueryOrWebElement) {
        const e = await accessorUtil.fetchElement(query);
        const tagName = await e.getTagName();
        const type = await e.getAttribute("type");
        if (tagName.toLocaleLowerCase() === 'input' && (type === "checkbox" || type === "radio")) {
            if (!(await e.getAttribute("checked"))) {
                await e.click();
            }
        }
    }

    async function _uncheck(query: SahiElementQueryOrWebElement) {
        const e = await accessorUtil.fetchElement(query);
        const tagName = await e.getTagName();
        const type = await e.getAttribute("type");
        if (tagName.toLocaleLowerCase() === 'input' && type === "checkbox") {
            if ((await e.getAttribute("checked"))) {
                await e.click();
            }
        }
    }

    async function _dragDrop(eSource: SahiElementQueryOrWebElement, eTarget: SahiElementQueryOrWebElement): Promise<void> {

        const [src, target] = await Promise.all([
            accessorUtil.fetchElement(eSource),
            accessorUtil.fetchElement(eTarget)
        ]);
        return webDriver.actions()
            .dragAndDrop(src, target).perform();
    }

    async function _dragDropXY(q: SahiElementQueryOrWebElement, x: number, y: number, $isRelative: boolean = false): Promise<void> {
        const e = await accessorUtil.fetchElement(q);
        let location: ILocation = {x, y};
        if ($isRelative) {
            const pi = await positionalInfo(e);
            location = {x: x + pi.location.x, y: y + pi.location.y};
        }

        return webDriver.actions().dragAndDrop(e, location).perform();
    }

    async function _setSelected(query: SahiElementQueryOrWebElement, optionToSelect: string | number | string[] | number[], isMultiple: boolean = false): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        const options = await e.findElements(By.css('option'));
        const valuesOrIndices = typeof optionToSelect === 'string' || typeof optionToSelect === 'number' ? [optionToSelect] : optionToSelect;
        const isNumberArray = (arr: (number | string)[]): arr is number[] => arr.every(n => typeof n === 'number');
        for (const [i, option] of options.entries()) {
            if (!isMultiple) {
                await setElementSelect(option, false)
            }
            if (isNumberArray(valuesOrIndices)) {
                if (valuesOrIndices.includes(i)) {
                    //await setElementSelect(option, true);
                    await option.click()
                }
            } else {
                const value = await option.getAttribute('value');
                const text = await option.getText();
                if (valuesOrIndices.includes(value) || valuesOrIndices.includes(text)) {
                    //await setElementSelect(option, true);
                    await option.click();
                }
            }
        }
    }

    async function setElementSelect(e: WebElement, selected: boolean = true) {
        await webDriver.executeAsyncScript(stripIndents`
            const e = arguments[0];
            const selected = arguments[1];
            const done = arguments[arguments.length - 1];
            if(selected) {
                e.setAttribute('selected', true)
            } else {
                e.removeAttribute('selected');
            }
            done(e.innerText);
        `, e, selected);
    }

    return ({
        _xy,
        _click,
        _rightClick,
        _mouseDown,
        _mouseUp,
        _mouseOver,
        _check,
        _uncheck,
        _setSelected,
        _dragDrop,
        _dragDropXY,
    })
}