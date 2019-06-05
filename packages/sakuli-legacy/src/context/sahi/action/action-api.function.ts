import {AccessorUtil} from "../accessor";
import {isSahiElementQuery, SahiElementQueryOrWebElement, sahiQueryToString} from "../sahi-element.interface";
import {TestExecutionContext} from "@sakuli/core";
import {error, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {stripIndents} from "common-tags";
import {mouseActionApi} from "./mouse-actions-api.function";
import {keyboardActionApi} from "./keyboard-actions.function";
import {focusActionApi} from "./focus-actions.function";
import {alertActionApi} from "./alert-action.function";
import {INJECT_SAKULI_HOOK} from "./inject.const";
import {timeout} from "./poll-action.function";
import StaleElementReferenceError = error.StaleElementReferenceError;

type SahiExpression = (...locators: SahiElementQueryOrWebElement[]) => Promise<boolean>;

export type ActionApiFunction = ReturnType<typeof actionApi>;

export function actionApi(
    webDriver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
) {

    function withRetries<T extends (...args: any[]) => Promise<any>>(
        retries: number,
        func: T,
    ): T {
        return (async (...args: any[]) => {
            const initialTries = retries;
            while (retries) {
                try {
                    return await func(...args);
                } catch (e) {
                    if (e instanceof StaleElementReferenceError) {
                        --retries;
                        ctx.logger.info(`StaleElement: ${initialTries - retries} - ${e.stack}`)
                    } else {
                        throw Error(`A non StaleElementReferenceError is thrown during retrying;  \n${e}`)
                    }
                }
            }
            throw Error(`Failed on an action after ${initialTries} attempts.`)
        }) as T;
    }

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
                // TODO Make retries configurable
                res = await withRetries(5, fn)(...args);
            } catch (e) {
                throw Error(`Error in action: ${name} \n${e.message}`)
            } finally {
                const log =[`Finish action ${name}`];
                if(ctx.getCurrentTestAction()) {
                    log.push(`after ${new Date().getDate() - ctx.getCurrentTestAction()!.startDate!.getDate()}`);
                }
                ctx.logger.info(log.join(' '));
                ctx.endTestAction();
            }
            return res;
        }) as T;
    }

    async function _eval(source: string, ..._args: any[]) {
        const args = await Promise.all(_args.map(arg => {
            if (isSahiElementQuery(arg)) {
                return accessorUtil.fetchElement(arg);
            } else {
                return Promise.resolve(arg)
            }
        }));
        return await webDriver.executeAsyncScript(`
            var __done__ = arguments[arguments.length - 1];
            var result = (function(arguments) {          
                ${source}
            })(arguments)
            __done__(result);
        `, ...args);
    }

    async function _highlight(query: SahiElementQueryOrWebElement | WebElement, timeoutMs: number = 2000): Promise<void> {
        const element = isSahiElementQuery(query)
            ? await accessorUtil.fetchElement(query)
            : query;
        await element.getId();
        const oldBorder = await webDriver.executeScript(stripIndents`
            const oldBorder = arguments[0].style.border;
            arguments[0].style.border = '2px solid red'
            return oldBorder;
        `, element);
        await _wait(timeoutMs);
        await webDriver.executeScript(stripIndents`
            const oldBorder = arguments[1];
            arguments[0].style.border = oldBorder
        `, element, oldBorder);
    }

    async function _wait(millis: number, expression?: SahiExpression): Promise<void> {
        if (!expression) {
            return new Promise<void>((res) => {
                setTimeout(() => res(), millis);
            });
        }
        await timeout(200, millis, expression);
    }

    async function _navigateTo(target: string, forceReload: boolean = false, credentials?: { user: string, password: string }): Promise<any> {
        const url = new URL(target);
        if (credentials) {
            url.username = credentials.user;
            url.password = credentials.password;
        }
        await webDriver.manage().window().maximize();
        await webDriver.get(url.href);
        if (forceReload) {
            await webDriver.navigate().refresh()
        }
        try {
            await webDriver.executeScript(INJECT_SAKULI_HOOK);
        } catch (e) {
            // ignore
        }
    }

    async function _rteWrite(query: SahiElementQueryOrWebElement, content: string): Promise<void> {
        const e = await accessorUtil.fetchElement(query);
        const tagName = await e.getTagName();
        if (tagName.toLocaleLowerCase() !== 'iframe') {
            if (isSahiElementQuery(query)) {
                throw Error(`Query ${sahiQueryToString(query)} must find an iframe; got ${tagName} instead`);
            } else {
                throw Error(`WebElement must be an iframe; got ${tagName} instead`);
            }
        }
        const defaultWindowHandle = await webDriver.getWindowHandle();
        await webDriver.switchTo().frame(e);
        await webDriver.executeScript(`            
            document.body.innerHTML = arguments[0];
        `, content);
        await webDriver.switchTo().window(defaultWindowHandle);
    }

    const {
        _authenticate
    } = alertActionApi(webDriver, accessorUtil, ctx);

    const {
        _blur,
        _focus,
    } = focusActionApi(webDriver, accessorUtil, ctx);

    const {
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
    } = mouseActionApi(webDriver, accessorUtil, ctx);

    const {
        _setValue,
        _keyPress,
        _keyUp,
        _keyDown,
        _type
    } = keyboardActionApi(webDriver, accessorUtil, ctx);

    return ({
        _xy: runAsAction('xy', _xy),
        _rightClick: runAsAction('rightClick', _rightClick),
        _mouseDown: runAsAction('mouseDown', _mouseDown),
        _mouseUp: runAsAction('mouseUp', _mouseUp),
        _mouseOver: runAsAction('mouseOver', _mouseOver),
        _check: runAsAction('check', _check),
        _uncheck: runAsAction('uncheck', _uncheck),
        _click: runAsAction('click', _click),
        _setSelected: runAsAction('setSelected', _setSelected),
        _dragDrop: runAsAction('dragDrop', _dragDrop),
        _dragDropXY: runAsAction('dragDropXY', _dragDropXY),

        _setValue: runAsAction('setValue', _setValue),
        _keyPress: runAsAction('keyPress', _keyPress),
        _keyUp: runAsAction('keyUp', _keyUp),
        _keyDown: runAsAction('keyDown', _keyDown),
        _type: runAsAction('type', _type),

        _focus: runAsAction('focus', _focus),
        _blur: runAsAction('blur', _blur),
        _removeFocus: runAsAction('removeFocus', _blur),

        _wait: runAsAction('wait', _wait),
        _highlight: runAsAction('highlight', _highlight),
        _navigateTo: runAsAction('navigateTo', _navigateTo),
        _rteWrite: runAsAction('rteWrite', _rteWrite),
        _eval: runAsAction('eval', _eval),

        _authenticate: runAsAction('authenticate', _authenticate)
    })
}