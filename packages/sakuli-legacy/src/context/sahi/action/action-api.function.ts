import {AccessorUtil} from "../accessor";
import {TestExecutionContext} from "@sakuli/core";
import {error, ThenableWebDriver} from "selenium-webdriver";
import {alertActionApi} from "./alert-action.function";
import {focusActionApi} from "./focus-action";
import {mouseActionApi} from "./mouse-action";
import {keyboardActionApi} from "./keyboard-action/keyboard-actions.function";
import {ActionApi} from "./action-api.interface";
import {commonActionsApi} from "./common-action";
import StaleElementReferenceError = error.StaleElementReferenceError;

export type ActionApiFunction = ReturnType<typeof actionApi>;

export function actionApi(
    webDriver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
): ActionApi {

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
                const log = [`Finish action ${name}`];
                if (ctx.getCurrentTestAction()) {
                    log.push(`after ${(new Date().getTime() - ctx.getCurrentTestAction()!.startDate!.getTime()) / 1000}s`);
                }
                ctx.logger.info(log.join(' '));
                ctx.endTestAction();
            }
            return res;
        }) as T;
    }

    const {
        _eval,
        _highlight,
        _navigateTo,
        _rteWrite,
        _wait
    } = commonActionsApi(webDriver, accessorUtil, ctx);

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
    })
}