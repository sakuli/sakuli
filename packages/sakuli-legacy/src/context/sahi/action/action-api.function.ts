import { AccessorUtil } from "../accessor";
import { TestExecutionContext } from "@sakuli/core";
import { ThenableWebDriver } from "selenium-webdriver";
import { focusActionApi } from "./focus-action";
import { mouseActionApi } from "./mouse-action";
import { keyboardActionApi } from "./keyboard-action";
import { ActionApi } from "./action-api.interface";
import { commonActionsApi } from "./common-action";
import { createWithRetries } from "./utils";
import { createWithActionContext } from "./utils";
import { createWithTryAcrossFrames } from "./utils/create-with-try-across-frames.function";

export type ActionApiFunction = ReturnType<typeof actionApi>;

export function actionApi(
    webDriver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
): ActionApi {

    const withRetries = createWithRetries(ctx);
    const withActionContext = createWithActionContext(ctx);
    const withTryAcrossFrames = createWithTryAcrossFrames(webDriver);
    const runAsAction = <ARGS extends any[], R>(name: string, fn: (...args:ARGS) => Promise<R>): ((...args: ARGS) => Promise<R>) => {
        return withActionContext(name, withTryAcrossFrames(withRetries(5, fn)));
    };

    const {
        _eval,
        _highlight,
        _navigateTo,
        _rteWrite,
        _wait,
        _pageIsStable
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
        _pageIsStable: runAsAction('pageIsStable', _pageIsStable),
        _highlight: runAsAction('highlight', _highlight),
        _navigateTo: runAsAction('navigateTo', _navigateTo),
        _rteWrite: runAsAction('rteWrite', _rteWrite),
        _eval: runAsAction('eval', _eval),
    })
}
