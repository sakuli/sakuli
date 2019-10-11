import {SahiElementQueryOrWebElement} from "../../sahi-element.interface";
import {WebElement} from "selenium-webdriver";

export interface CommonActionsApi {
    /**
     * This function sends Javascript to the browser which is executed their.
     * you can pass a list of arguments to this script.
     *
     * The function is using [ThenableWebdriver.executeScript](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_ThenableWebDriver.html#executeAsyncScript) internally.
     *
     * All element queries in the `_args` list (e.g. `_div('Hello')`) are resolved to [WebElements](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_WebElement.html) and are available as a HTMLElement in the script
     *
     * All `_args` are available in the `arguments` array in the script.
     *
     * the return value of the JavaScript is returned from this function.
     *
     * @example
     * ```typescript
     * const windowOuterHeight = await _eval(`return window.outerHeight`);
     * ```
     *
     * @example
     * ```typescript
     * // Dispatch a custom Event from a button on the page
     * const await _eval(`
     *    const btn = arguments[0];
     *    btn.dispatchEvent(new CustomEvent('something-custom'));
     * `, _button('Some special Button'))
     * ```
     *
     *
     * @param source Javascript code which is executed in the browser
     * @param _args A variadic list of arguments that are passed to Javascript
     */
    _eval<T=  any>(source: string, ..._args: any[]): Promise<T>

    /**
     * Draws a red border around an element on the website.
     *
     * @param query The element to be highlighted
     * @param timeoutMs determine how long the highlight will last (default: `2000`)
     */
    _highlight(query: SahiElementQueryOrWebElement | WebElement, timeoutMs?: number): Promise<void>

    /**
     * Wait for a maximum of the given timeout. It's also possible to pass an expression function which will be evaluated during the waiting.
     *
     * @example
     *
     * ```typescript
     * // Will wait at most 5 seconds until a submit button with the text "Buy now" is visible
     * await _wait(5000, () => _isVisible(_submit('Buy Now')));
     * ```
     *
     *
     * @param millis Maximum amount of time to be waiting (in milliseconds)
     * @param expression An optional function which will abort the wait when it returns a truthy value
     */
    _wait(millis: number, expression?: (...locators: SahiElementQueryOrWebElement[]) => Promise<boolean>): Promise<void>

    /**
     * Navigates the browser instance to the given URL (also [Data URLs](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) are possible).
     *
     * @example
     * ```typescript
     * // open sakuli.io in the browser
     * await _navigateTo("https://sakuli.io");
     *
     *
     * // navigate and authenticate on a page with http-basic
     * await _navigateTo("https://sakuli.io/fictional-admin", false, {user: 'UserName', password: 'top$ecret'})
     * ```
     *
     * It uses [ThenableWebdriver.get()](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_ThenableWebDriver.html#get) under the hood.
     *
     *
     * @param target The URL of the Website to test - Could be any string that can be entered in a browser navigationbar
     * @param forceReload Forces the page to reload after it has been loaded - it is a relict of Sahi. Default: `false`
     * @param credentials If a site requires "Http-Basic-Authentication" you can pass the credentials here
     */
    _navigateTo(target: string, forceReload?: boolean, credentials?: { user: string, password: string }): Promise<any>

    /**
     * @deprecated
     *
     *
     *
     * @param query
     * @param content
     */
    _rteWrite(query: SahiElementQueryOrWebElement, content: string): Promise<void>
}
