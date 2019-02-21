import {By, ThenableWebDriver} from "selenium-webdriver";
import {AccessorUtil} from "../accessor";
import {TestExecutionContext} from "@sakuli/core";
import {SahiElementQuery} from "../sahi-element.interface";
import {html, stripIndent} from "common-tags";
import {isChildOf} from "../helper/is-child-of.function";
import {Vector2} from "../relations/vector2.type";
import {isEqual} from "../helper/is-equal.function";

export type FetchApi = ReturnType<typeof fetchApi>;

export function fetchApi(
    driver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
) {

    async function _getValue(query: SahiElementQuery) {
        const e = await accessorUtil.fetchElement(query);
        return e.getAttribute('value');
    }

    async function _getText(query: SahiElementQuery) {
        const e = await accessorUtil.fetchElement(query);
        return e.getText();
    }

    async function _getOptions(query: SahiElementQuery, value?: "value") {
        const e = await accessorUtil.fetchElement(query);
        const options = await e.findElements(By.css('option'));
        return Promise.all(options.map(option => value === 'value'
            ? option.getAttribute('value')
            : option.getText()
        ))
    }

    const _getCellText = _getText;

    async function _getSelectedText(query: SahiElementQuery) {
        const e = await accessorUtil.fetchElement(query);
        return e.findElement(By.css('[selected]')).then(e => e.getText());
    }

    async function _getAttribute(query: SahiElementQuery, name: string) {
        const e = await accessorUtil.fetchElement(query);
        return e.getAttribute(name)
    }

    async function _exists(query: SahiElementQuery) {
        try {
            await accessorUtil.fetchElement(query);
            return true
        } catch (e) {
            return false;
        }
    }

    async function _areEqual(q1: SahiElementQuery, q2: SahiElementQuery) {
        const [e1, e2] = await Promise.all([
            accessorUtil.fetchElement(q1),
            accessorUtil.fetchElement(q2)
        ]);
        return isEqual(e1, e2);
    }

    async function _isVisible(query: SahiElementQuery) {
        const e = await accessorUtil.fetchElement(query);
        return e.isDisplayed();
    }

    async function _isChecked(query: SahiElementQuery) {
        const e = await accessorUtil.fetchElement(query);
        return e.getAttribute('checked').then(v => !!v)
    }

    async function _isEnabled(query: SahiElementQuery) {
        const e = await accessorUtil.fetchElement(query);
        return e.getAttribute('disabled').then(v => !v)
    }

    async function _containsText(query: SahiElementQuery, text: string) {
        const e = await accessorUtil.fetchElement(query);
        return e.getText().then(elementText => new RegExp(text).test(elementText))
    }

    async function _containsHTML(query: SahiElementQuery, htmlText: string) {
        const e = await accessorUtil.fetchElement(query);
        return e.getAttribute('innerHTML').then(elementHtml => {
            return new RegExp(html`${htmlText}`).test(html`${elementHtml}`);
        })
    }

    async function _contains(parent: SahiElementQuery, child: SahiElementQuery) {
        const [parentElement, childElement] = await Promise.all([
            accessorUtil.fetchElement(parent),
            accessorUtil.fetchElement(child)
        ]);
        return isChildOf(childElement, parentElement);
    }

    async function _title() {
        return driver.getTitle();
    }

    /**
     * Styles in HTML elements are calculated by the browser based on various CSS rules.
     * _style returns the computed style that is finally applicable to the element.
     * Accessing style directly as an attribute will not give computed style.
     * Always use _style instead.
     *
     * @param query
     * @param attr
     * @private
     */
    async function _style(query: SahiElementQuery, attr: string) {
        const e = await accessorUtil.fetchElement(query);
        return e.getCssValue(attr);
    }

    async function _position(query: SahiElementQuery) {
        const e = await accessorUtil.fetchElement(query);
        return e.getLocation().then(({x, y}) => [x, y] as Vector2)
    }

    async function _getSelectionText() {
        return driver.executeAsyncScript(stripIndent`            
            var done = arguments[arguments.length -1];
            let text = '';
            if (window.getSelection) {
                text = window.getSelection().toString();
            } else if (document.selection && document.selection.type != "Control") {
                text = document.selection.createRange().text;
            }
            done(text);
        `)
    }

    async function _fetch(query: SahiElementQuery) {
        return accessorUtil.fetchElement(query);
    }

    return ({
        _fetch,
        _getValue,
        _getText,
        _getOptions,
        _getCellText,
        _getSelectedText,
        _getAttribute,
        _exists,
        _areEqual,
        _isVisible,
        _isChecked,
        _isEnabled,
        _containsText,
        _containsHTML,
        _contains,
        _title,
        _style,
        _position,
        _getSelectionText
    })

}