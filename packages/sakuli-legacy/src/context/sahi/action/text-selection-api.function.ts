import {ThenableWebDriver} from "selenium-webdriver";
import {AccessorUtil} from "../accessor";
import {TestExecutionContext} from "@sakuli/core";
import {SahiElementQuery} from "../sahi-element.interface";
import {stripIndent} from "common-tags";

export type TextSelectionApi = ReturnType<typeof textSelectionApi>;

export function textSelectionApi(
    driver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
) {

    async function _selectRange(query: SahiElementQuery, start: number, end: number) {
        const e = accessorUtil.fetchElement(query);
        return driver.executeScript(stripIndent`
            const e = arguments[0];
            const start = arguments[1];
            const end = arguments[2];
            
            const range = document.createRange();
            range.setStart(e.firstChild, start);
            range.setEnd(e.firstChild, end);           
            
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range); 
        `, e, start, end)
    }
    
    async function _selectTextRange(query: SahiElementQuery, searchText: string) {
        const e = accessorUtil.fetchElement(query);
        return driver.executeScript(stripIndent`
            const e = arguments[0];
            const searchText = arguments[1];
            const content = e.innerText;
            const start = content.indexOf(searchText);
            const end = start + searchText.length;
            
            const range = document.createRange();
            range.setStart(e.firstChild, start);
            range.setEnd(e.firstChild, end);
            
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        `, e, searchText)
    }

    return ({
        _selectRange,
        _selectTextRange
    })

}