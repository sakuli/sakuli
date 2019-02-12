import {AccessorUtil} from "../accessor";
import {isSahiElementQuery, SahiElementQuery, sahiQueryToString} from "../sahi-element.interface";
import {TestExecutionContext} from "@sakuli/core";
import {By, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {stripIndents} from "common-tags";

export type ActionApi = ReturnType<typeof actionApi>;

export function actionApi(
    webDriver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
) {

    function runAsAction<T extends (...args: any[]) => Promise<any>>(
        name: string,
        fn: T
    ): T {
        return (async (...args: any[]) => {
            ctx.startTestAction({
                id: name,
            });
            ctx.logger.info(`Start action ${name}`);
            let res: any;
            try {
                res = await fn(...args);
            } catch(e) {
                throw Error(`Error in action: ${name} \n${e.message}`)
            } finally {
                ctx.endTestAction();
            }
            return res;
        }) as T;
    }

    async function _click(query: SahiElementQuery, combo?: string): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        await e.click();
    }

    async function _setValue(query: SahiElementQuery, value: string): Promise<void> {
        const element = await accessorUtil.fetchElement(query);
        try {
            for(let char of value.split('')) {
              await _wait(10);
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

    async function _eval(source: string, ..._args: any[]) {
        const args = await Promise.all(_args.map(arg => {
            if(isSahiElementQuery(arg)) {
                return accessorUtil.fetchElement(arg);
            } else {
                return Promise.resolve(arg)
            }
        }));
        return await webDriver.executeAsyncScript(`
            const __done__ = arguments[arguments.length - 1];
            ${source}
            __done__();
        `, ...args);
    }

    async function _focus(query: SahiElementQuery) {
        const e = await accessorUtil.fetchElement(query);
        await webDriver.executeScript(stripIndents`
            arguments[0].focus();
        `, e);
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
            done(e.textContent);
        `, e, selected);
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

    async function _navigateTo(url: string, forceReload: boolean = false): Promise<any> {
        await webDriver.get(url);
        if (forceReload) {
            await webDriver.navigate().refresh()
        }
    }

    async function _dragDrop(eSource: SahiElementQuery, eTarget: SahiElementQuery): Promise<void> {
        throw Error('Not yet implemented')
    }

    async function _dragDropXY(e: SahiElementQuery, $x: number, $y: number, $isRelative: boolean = false): Promise<void> {
        throw Error('Not yet implemented')
    }

    async function _rteWrite(query: SahiElementQuery, content: string): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        const tagName = await e.getTagName();
        if(tagName.toLocaleLowerCase() !== 'iframe') {
            throw Error(`Query ${sahiQueryToString(query)} must find an iframe; got ${tagName} instead`);
        }
        const defaultWindowHandle = await webDriver.getWindowHandle();
        await webDriver.switchTo().frame(e);
        await webDriver.executeScript(`            
            document.body.innerHTML = arguments[0];
        `, content);
        await webDriver.switchTo().window(defaultWindowHandle);

    }

    return ({
        _click: runAsAction('click', _click),
        _setValue: runAsAction('setValue', _setValue),
        _setSelected: runAsAction('setSelected', _setSelected),
        _wait: runAsAction('wait', _wait),
        _highlight: runAsAction('highlight', _highlight),
        _navigateTo: runAsAction('navigateTo', _navigateTo),
        _dragDrop: runAsAction('dragDrop', _dragDrop),
        _dragDropXY: runAsAction('dragDrop', _dragDropXY),
        _rteWrite: runAsAction('rteWrite', _rteWrite),
        _focus: runAsAction('focus', _focus),
        _eval: runAsAction('eval', _eval)
    })
}