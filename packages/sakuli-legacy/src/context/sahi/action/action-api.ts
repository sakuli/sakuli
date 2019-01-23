import {AccessorUtil} from "../accessor/accessor-util.class";
import {SahiElementQuery} from "../sahi-element.interface";
import {TestExecutionContext} from "@sakuli/core";
import {By, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {stripIndents} from "common-tags";

export function actionApi(
    webDriver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
) {

    const EmptyPromise = () => Promise.resolve();

    function runAsAction<T extends (...args: any[]) => Promise<any>>(
        name: string,
        fn: T
    ): T {
        return (async (...args: any[]) => {
            ctx.startTestAction({
                id: name,
            });
            const res = await fn(...args);
            ctx.endTestAction();
            return res;
        }) as T;
    }

    async function _click(query: SahiElementQuery, combo?: string): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        return e.click();
    }

    async function _setValue(query: SahiElementQuery, value: string): Promise<void> {
        const element = await accessorUtil.fetchElement(query);
        return element.sendKeys(...value.split(''));
    }

    async function _setSelected(query: SahiElementQuery, optionToSelect: string | number | string[] | number[], isMultiple: boolean = false): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        const options = await e.findElements(By.css('option'));
        const valuesOrIndices = typeof optionToSelect === 'string' || typeof optionToSelect === 'number' ? [optionToSelect] : optionToSelect;
        const isNumberArray = (arr: (number | string)[]): arr is number[] => arr.every(n => typeof n === 'number');
        for (const [i, option] of options.entries()) {
            if (!isMultiple) {
                await setElementSelect(option, false)
            }
            if (isNumberArray(valuesOrIndices)) {
                if (valuesOrIndices.indexOf(i)) {
                    await setElementSelect(option, true);
                }
            } else {
                const value = await option.getAttribute('value');
                if (valuesOrIndices.indexOf(value)) {
                    await setElementSelect(option, true);
                }
            }
        }
    }

    async function setElementSelect(e: WebElement, selected: boolean = true) {
        return webDriver.executeAsyncScript(stripIndents`
            const e = arguments[0];
            const selected = arguments[1];
            const done = arguments[arguments.length - 1];
            e.selected = selected
            done();
        `, e, selected)
    }

    async function _highlight(query: SahiElementQuery, timeoutMs: number = 2000): Promise<void> {
        const element = await accessorUtil.fetchElement(query);
        const oldBorder = await webDriver.executeScript(stripIndents`
            const oldBorder = arguments[0].style.border;
            arguments[0].style.border = '2px solid red'
            return oldBorder;
        `, element);
        await _wait(timeoutMs);
        await webDriver.executeScript(stripIndents`
            const oldBorder = arguments[1];
            arguments[0].style.border = oldBorder
        `, element, oldBorder)

    }

    async function _wait(millis: number): Promise<void> {
        return new Promise<void>((res, rej) => {
            setTimeout(() => res(), millis);
        });
    }

    return ({
        _click: runAsAction('click', _click),
        _setValue: runAsAction('setValue', _setValue),
        _setSelected: runAsAction('setSelected', _setSelected),
        _wait: runAsAction('wait', _wait),
        _highlight: runAsAction('highlight', _highlight)
    })
}