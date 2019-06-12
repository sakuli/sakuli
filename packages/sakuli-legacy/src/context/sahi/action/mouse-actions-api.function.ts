import {Button, By, ILocation, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {AccessorUtil} from "../accessor";
import {TestExecutionContext} from "@sakuli/core";
import {SahiElementQueryOrWebElement} from "../sahi-element.interface";
import {stripIndents} from "common-tags";
import {positionalInfo} from "../relations/positional-info.function";
import {runActionsWithComboKeys} from "./run-actions-with-combo.keys.function";
import 'selenium-webdriver/lib/input'
import {MouseActionApi} from "./mouse-action-api.interface";

export function mouseActionApi(
    webDriver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
): MouseActionApi {

    const toElement = (origin: WebElement) => ({origin, x: 0, y: 0});

    function _xy(): never {
        throw Error('Not yet implemented due to api incompability');
    }

    async function _click(query: SahiElementQueryOrWebElement, combo: string = ""): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        return runActionsWithComboKeys(
            webDriver.actions({bridge: true}),
            e,
            combo,
            a => a.move({origin: e}).press().release()
        ).perform();
    }

    async function _mouseDown(query: SahiElementQueryOrWebElement, isRight: boolean = false, combo: string = ''): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        const mouseButton = isRight ? Button.RIGHT : Button.LEFT;
        return runActionsWithComboKeys(
            webDriver.actions({bridge: true}),
            e, combo,
            a => a.move(toElement(e)).press(mouseButton)
        ).perform();
    }

    async function _mouseUp(query: SahiElementQueryOrWebElement, isRight: boolean = false, combo: string = ''): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        const mouseButton = isRight ? Button.RIGHT : Button.LEFT;
        return runActionsWithComboKeys(
            webDriver.actions({bridge: true}),
            e, combo,
            a => a.move(toElement(e)).release(mouseButton)
        ).perform();
    }

    async function _rightClick(query: SahiElementQueryOrWebElement, combo: string = ''): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        return runActionsWithComboKeys(
            webDriver.actions({bridge: true}),
            e, combo,
            a => a.contextClick(e)
        ).perform();
    }

    async function _mouseOver(query: SahiElementQueryOrWebElement, combo: string = '') {
        const e = await accessorUtil.fetchElement(query);
        return runActionsWithComboKeys(
            webDriver.actions({bridge: true}),
            e, combo,
            a => a.move({origin: e, x: 1, y: 1}).move(toElement(e))
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
        return webDriver.actions({bridge: true})
            .dragAndDrop(src, target).perform();

        /*
        return webDriver.actions({bridge: true})
            .move({origin: src, x: 1, y: 1})
            .press()
            .move({origin: target, x: 1, y: 1})
            .release()
            .perform()

         */
    }

    async function _dragDropXY(q: SahiElementQueryOrWebElement, x: number, y: number, $isRelative: boolean = false): Promise<void> {
        const e = await accessorUtil.fetchElement(q);
        let location: ILocation = {x, y};
        if ($isRelative) {
            const pi = await positionalInfo(e);
            location = {x: x + pi.location.x, y: y + pi.location.y};
        }
        ctx.logger.info(`Drag to: ${JSON.stringify(location)}`);
        return webDriver.actions({bridge: true}).dragAndDrop(e, location).perform();
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