import { Button, By, error, ILocation, ThenableWebDriver, WebElement } from "selenium-webdriver";
import { TestExecutionContext } from "@sakuli/core";
import { stripIndents } from "common-tags";


import 'selenium-webdriver/lib/input'
import { MouseActionApi } from "./mouse-action-api.interface";
import { SahiElementQueryOrWebElement } from "../../sahi-element.interface";
import { runActionsWithComboKeys } from "..";
import { AccessorUtil } from "../../accessor";
import { positionalInfo } from "../../relations";
import { isElementCovered, scrollIntoViewIfNeeded } from "../utils";
import { ClickOptions, isClickOptions } from ".";
import ElementClickInterceptedError = error.ElementClickInterceptedError;


export function mouseActionApi(
    webDriver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
): MouseActionApi {

    const toElement = (origin: WebElement) => ({origin, x: 0, y: 0});

    function _xy(): Promise<never> {
        throw Error('Not yet implemented due to api incompatibility');
    }

    async function _click(query: SahiElementQueryOrWebElement, combo: undefined | string | ClickOptions, options: undefined | ClickOptions): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        await scrollIntoViewIfNeeded(e, ctx);

        if(!combo && !options) {
            console.trace("Using selenium click");
            return e.click();
        } else {
            validateComboAndOptions(combo, options);
            if(isClickNotForced(combo, options)) {
                console.trace("Validate element for click");
                if(await isElementCovered(e, webDriver)) {
                    throw new ElementClickInterceptedError("Element is not clickable because another element obscures it");
                }
                console.trace("Element is clickable");
            }

            console.trace("Click with action sequence");
            if(!combo || isClickOptions(combo)) {
                return comboClickWithActionSequence("", e);
            } else {
                return comboClickWithActionSequence(combo, e);
            }
        }
    }

    async function _mouseDown(query: SahiElementQueryOrWebElement, isRight: boolean = false, combo: string = ''): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        const mouseButton = isRight ? Button.RIGHT : Button.LEFT;
        await scrollIntoViewIfNeeded(e, ctx);
        return runActionsWithComboKeys(
            webDriver.actions({bridge: true}),
            combo,
            a => a.move(toElement(e)).press(mouseButton)
        ).perform();
    }

    async function _mouseUp(query: SahiElementQueryOrWebElement, isRight: boolean = false, combo: string = ''): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        const mouseButton = isRight ? Button.RIGHT : Button.LEFT;
        await scrollIntoViewIfNeeded(e, ctx);
        return runActionsWithComboKeys(
            webDriver.actions({bridge: true}),
            combo,
            a => a.move(toElement(e)).release(mouseButton)
        ).perform();
    }

    async function _rightClick(query: SahiElementQueryOrWebElement, combo: string = ''): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        await scrollIntoViewIfNeeded(e, ctx);
        return runActionsWithComboKeys(
            webDriver.actions({bridge: true}),
            combo,
            a => a.contextClick(e)
        ).perform();
    }

    async function _mouseOver(query: SahiElementQueryOrWebElement, combo: string = '') {
        const e = await accessorUtil.fetchElement(query);
        await scrollIntoViewIfNeeded(e, ctx);
        return runActionsWithComboKeys(
            webDriver.actions({bridge: true}),
            combo,
            a => a.move({origin: e, x: 1, y: 1}).move(toElement(e))
        ).perform();
    }

    async function _check(query: SahiElementQueryOrWebElement) {
        const e = await accessorUtil.fetchElement(query);
        const tagName = await e.getTagName();
        const type = await e.getAttribute("type");
        if (tagName.toLocaleLowerCase() === 'input' && (type === "checkbox" || type === "radio")) {
            await scrollIntoViewIfNeeded(e, ctx);
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
            await scrollIntoViewIfNeeded(e, ctx);
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
        await scrollIntoViewIfNeeded(e, ctx);
        const options = await e.findElements(By.css('option'));
        const valuesOrIndices = typeof optionToSelect === 'string' || typeof optionToSelect === 'number' ? [optionToSelect] : optionToSelect;
        const isNumberArray = (arr: (number | string)[]): arr is number[] => arr.every(n => typeof n === 'number');
        for (const [i, option] of options.entries()) {
            if (!isMultiple) {
                await setElementSelect(option, false)
            }
            if (isNumberArray(valuesOrIndices)) {
                if (valuesOrIndices.includes(i)) {
                    await option.click()
                }
            } else {
                const value = await option.getAttribute('value');
                const text = await option.getText();
                if (valuesOrIndices.includes(value) || valuesOrIndices.includes(text)) {
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


    function validateComboAndOptions(combo: undefined | string | ClickOptions, options: undefined | ClickOptions): void {
        if(combo && isClickOptions(combo) && options && isClickOptions(options)) {
            console.log("_click was used with two clickOptions in combo and options");
            if((combo.force && !options.force) || (!combo.force && options.force)) {
                throw Error(`Invalid argument combination for combo ${combo} and options ${options}`);
            }
        }
    }

    function isClickNotForced(combo: undefined | string | ClickOptions, options: undefined | ClickOptions) {
        const isComboNotForced= (combo && isClickOptions(combo) && !combo.force);
        const isOptionsNotForced = (typeof combo === "string"|| !combo) && ((options && !options.force) || (options === undefined));

        return isOptionsNotForced || isComboNotForced;
    }


    function comboClickWithActionSequence(combo: string, e: WebElement): Promise<void> {
        return runActionsWithComboKeys(
            webDriver.actions({bridge: true}),
            combo,
            a => a.click(e)
        ).perform();
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
