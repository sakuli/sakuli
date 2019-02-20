import {ThenableWebDriver} from "selenium-webdriver";
import {AccessorUtil} from "../accessor";
import {TestExecutionContext} from "@sakuli/core";
import {SahiElementQuery} from "../sahi-element.interface";
import {stripIndents} from "common-tags";

export function focusActionApi(
    webDriver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
) {
    async function _focus(query: SahiElementQuery) {
        const e = await accessorUtil.fetchElement(query);
        await webDriver.executeScript(stripIndents`
            arguments[0].focus();
        `, e);
    }

    async function _blur(query: SahiElementQuery) {
        const e = await accessorUtil.fetchElement(query);
        await webDriver.executeScript(stripIndents`
            arguments[0].blur();
        `, e);
    }

    return ({
        _focus,
        _blur,
    })
}