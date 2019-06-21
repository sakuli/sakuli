import {SahiElementQueryOrWebElement} from "../../sahi-element.interface";

/**
 * Combines methods to bring either focus or blur to webelements elements
 */
export interface FocusActionApi {

    /**
     *
     * Fetches an element and performs the native `.focus()` method n the browser
     *
     * @param {SahiElementQueryOrWebElement} query - Query or concrete WebElement
     * @return {Promise<void>} Resolves when browser-script finished
     */
    _focus(query: SahiElementQueryOrWebElement): Promise<void>

    /**
     *
     * Fetches an element and perform the native `.blur()` in the browser.
     *
     * @param {SahiElementQueryOrWebElement} q - Query or concrete Webelement
     * @return {Promise<void>} Resolves when browser-script finished
     *
     */
    _blur(query: SahiElementQueryOrWebElement): Promise<void>
    _removeFocus(query: SahiElementQueryOrWebElement): Promise<void>

}