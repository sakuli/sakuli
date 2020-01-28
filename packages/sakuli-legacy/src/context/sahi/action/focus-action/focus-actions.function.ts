import { ThenableWebDriver } from "selenium-webdriver";
import { AccessorUtil } from "../../accessor";
import { TestExecutionContext } from "@sakuli/core";
import { SahiElementQueryOrWebElement } from "../../sahi-element.interface";
import { stripIndents } from "common-tags";
import { FocusActionApi } from "./focus-actions.interface";
import { scrollIntoViewIfNeeded } from "../utils/scroll-into-view-if-needed.function";

export function focusActionApi(
    webDriver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
): FocusActionApi  {
    async function _focus(query: SahiElementQueryOrWebElement) {
        const e = await accessorUtil.fetchElement(query);
        await scrollIntoViewIfNeeded(e, ctx);
        await webDriver.executeScript(stripIndents`
            arguments[0].focus();
        `, e);
    }

    async function _blur(query: SahiElementQueryOrWebElement) {
        const e = await accessorUtil.fetchElement(query);
        await scrollIntoViewIfNeeded(e, ctx);
        await webDriver.executeScript(stripIndents`
            arguments[0].blur();
        `, e);
    }

    return ({
        _focus,
        _blur,
        _removeFocus: _blur
    })
}
