import {SahiElementQueryOrWebElement} from "../sahi-element.interface";
import {WebElement} from "selenium-webdriver";

export interface MouseActionApi {
    /**
     * @deprecated
     * @throws Error - Not implemented error
     */
    _xy(): never

    /**
     * _click simulates a user's click on the given element.
     *
     * @example
     * <code>
     * _click(_button("Click Me"));
     * _click(_button("Click Me"), "CTRL"); // clicks with CTRL key pressed
     * _click(_button("Click Me"), "CTRL|SHIFT"); // clicks with CTRL and SHIFT keys pressed
     *
     * </code>
     *
     * @param query - query to the Element to click on
     * @param combo - Any combo key: can be "CTRL", "SHIFT", "ALT" or "META";
        Can also be two or more keys together like "CTRL|SHIFT"
     *
     * @return {Promise<void>} Resolves after the click is invoked, doesn't wait for further actions on the website which are possibly invoked after the click
     */
    _click(query: SahiElementQueryOrWebElement, combo?: string): Promise<void>

    /**
     *
     * Performs a `press` action on the element
     *
     * @see https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/input_exports_Actions.html
     *
     * @param query
     * @param isRight - Indicates that the right mousebutton is pressed
     * @param combo - Any combo key: can be "CTRL", "SHIFT", "ALT" or "META";
     Can also be two or more keys together like "CTRL|SHIFT"
     */
    _mouseDown(query: SahiElementQueryOrWebElement, isRight?: boolean, combo?: string): Promise<void>

    /**
     *
     * Performs a `release` action on the element
     *
     * @see https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/input_exports_Actions.html
     *
     * @param query
     * @param isRight - Indicates that the right mousebutton is released
     * @param combo - Any combo key: can be "CTRL", "SHIFT", "ALT" or "META";
     Can also be two or more keys together like "CTRL|SHIFT"
     */
    _mouseUp(query: SahiElementQueryOrWebElement, isRight?: boolean, combo?: string): Promise<void>

    _rightClick(query: SahiElementQueryOrWebElement, combo?: string): Promise<void>

    _mouseOver(query: SahiElementQueryOrWebElement, combo?: string): Promise<void>

    _check(query: SahiElementQueryOrWebElement): Promise<void>

    _uncheck(query: SahiElementQueryOrWebElement): Promise<void>

    _dragDrop(eSource: SahiElementQueryOrWebElement, eTarget: SahiElementQueryOrWebElement): Promise<void>

    _dragDropXY(q: SahiElementQueryOrWebElement, x: number, y: number, $isRelative?: boolean): Promise<void>

    _setSelected(query: SahiElementQueryOrWebElement, optionToSelect: string | number | string[] | number[], isMultiple?: boolean): Promise<void>

}