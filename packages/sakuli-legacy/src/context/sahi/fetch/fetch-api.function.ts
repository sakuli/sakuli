import {By, ThenableWebDriver} from "selenium-webdriver";
import {AccessorUtil} from "../accessor";
import {TestExecutionContext} from "@sakuli/core";
import {SahiElementQueryOrWebElement} from "../sahi-element.interface";
import {html, stripIndent} from "common-tags";
import {isChildOf} from "../helper/is-child-of.function";
import {Vector2} from "../relations/vector2.type";
import {isEqual} from "../helper/is-equal.function";
import {multipleElementApi} from "./multiple-element-api.function";

export type FetchApi = ReturnType<typeof fetchApi>;

export function fetchApi(
    driver: ThenableWebDriver,
    accessorUtil: AccessorUtil,
    ctx: TestExecutionContext
) {

    async function _getValue(query: SahiElementQueryOrWebElement) {
        const e = await accessorUtil.fetchElement(query);
        return e.getAttribute('value');
    }

    async function _getText(query: SahiElementQueryOrWebElement): Promise<string> {
        const e = await accessorUtil.fetchElement(query);
        return e.getText();
    }

    async function _getOptions(query: SahiElementQueryOrWebElement, value?: "value") {
        const e = await accessorUtil.fetchElement(query);
        const options = await e.findElements(By.css('option'));
        return Promise.all(options.map(option => value === 'value'
            ? option.getAttribute('value')
            : option.getText()
        ))
    }

    const _getCellText = _getText;

    async function _getSelectedText(query: SahiElementQueryOrWebElement) {
        const e = await accessorUtil.fetchElement(query);
        return e.findElement(By.css('[selected]')).then(e => e.getText());
    }

    async function _getAttribute(query: SahiElementQueryOrWebElement, name: string) {
        const e = await accessorUtil.fetchElement(query);
        return e.getAttribute(name)
    }

    async function _exists(query: SahiElementQueryOrWebElement) {
        try {
            const result = await accessorUtil.fetchElement(query);
            return (result !== undefined);
        } catch (e) {
            return false;
        }
    }

    async function _areEqual(q1: SahiElementQueryOrWebElement, q2: SahiElementQueryOrWebElement) {
        const [e1, e2] = await Promise.all([
            accessorUtil.fetchElement(q1),
            accessorUtil.fetchElement(q2)
        ]);
        return isEqual(e1, e2);
    }

    async function _isVisible(query: SahiElementQueryOrWebElement) {
        const e = await accessorUtil.fetchElement(query);
        return e.isDisplayed();
    }

    async function _isChecked(query: SahiElementQueryOrWebElement) {
        const e = await accessorUtil.fetchElement(query);
        return e.getAttribute('checked').then(v => !!v)
    }

    async function _isEnabled(query: SahiElementQueryOrWebElement) {
        const e = await accessorUtil.fetchElement(query);
        return e.getAttribute('disabled').then(v => !v)
    }

    async function _containsText(query: SahiElementQueryOrWebElement, text: string) {
        const e = await accessorUtil.fetchElement(query);
        return e.getText().then(elementText => new RegExp(text).test(elementText))
    }

    async function _containsHTML(query: SahiElementQueryOrWebElement, htmlText: string) {
        const e = await accessorUtil.fetchElement(query);
        return e.getAttribute('innerHTML').then(elementHtml => {
            return new RegExp(html`${htmlText}`).test(html`${elementHtml}`);
        })
    }

    async function _contains(parent: SahiElementQueryOrWebElement, child: SahiElementQueryOrWebElement) {
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
    async function _style(query: SahiElementQueryOrWebElement, attr: string) {
        const e = await accessorUtil.fetchElement(query);
        return e.getCssValue(attr);
    }

    async function _position(query: SahiElementQueryOrWebElement) {
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

    async function _fetch(query: SahiElementQueryOrWebElement) {
        return accessorUtil.fetchElement(query);
    }

    const {
        _collect,
        _count
    } = multipleElementApi(driver, accessorUtil, ctx);

    return ({
        _collect,
        _count,
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