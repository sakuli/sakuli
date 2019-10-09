import {SahiElementQueryOrWebElement} from "../../sahi-element.interface";

export interface MouseActionApi {
    /**
     * @deprecated
     * @throws Error - Not implemented error
     */
    _xy(): Promise<never>

    /**
     * _click simulates a user's click on the given element.
     *
     * @example
     * <br />
     *
     * ```typescript
     * _click(_button("Click Me"));
     * _click(_button("Click Me"), "CTRL"); // clicks with CTRL key pressed
     * _click(_button("Click Me"), "CTRL|SHIFT"); // clicks with CTRL and SHIFT keys pressed
     * ```
     *
     * @param query - query to the Element to click on
     * @param combo - Optional combo key(s): can be <kbd>CTRL</kbd>, <kbd>SHIFT</kbd>, <kbd>ALT</kbd> or <kbd>META</kbd>;
     *   Can also be two or more keys together like `"CTRL|SHIFT"`
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
     * Performs a `release` action on the element.
     * Release is the action when a user releases his finger from the mouse button.
     *
     * @see https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/input_exports_Actions.html
     *
     * @param query
     * @param isRight - Indicates that the right mousebutton is released
     * @param combo - Optional combo key(s): can be <kbd>CTRL</kbd>, <kbd>SHIFT</kbd>, <kbd>ALT</kbd> or <kbd>META</kbd>;
     *   Can also be two or more keys together like `"CTRL|SHIFT"`
     */
    _mouseUp(query: SahiElementQueryOrWebElement, isRight?: boolean, combo?: string): Promise<void>

    /**
     * Performs a right click on the queried element. Can be combined with a key combo.
     *
     * @param query
     * @param combo - Any combo key: can be "CTRL", "SHIFT", "ALT" or "META";
     Can also be two or more keys together like "CTRL|SHIFT"
     */
    _rightClick(query: SahiElementQueryOrWebElement, combo?: string): Promise<void>

    /**
     * Invokes a mouse over on the queried element. Can be combined with a key combo.
     *
     * @param query
     * @param combo - Optional combo key(s): can be <kbd>CTRL</kbd>, <kbd>SHIFT</kbd>, <kbd>ALT</kbd> or <kbd>META</kbd>;
     *   Can also be two or more keys together like `"CTRL|SHIFT"`
     */
    _mouseOver(query: SahiElementQueryOrWebElement, combo?: string): Promise<void>

    /**
     * Performs a click on a checkbox input and forces its state to be checked
     *
     * @param query
     */
    _check(query: SahiElementQueryOrWebElement): Promise<void>

    /**
     * Performs a click on a checkbox input and forces its state not to be checked
     *
     * @param query
     */
    _uncheck(query: SahiElementQueryOrWebElement): Promise<void>

    /**
     * Performs a mouse down on _eSource_, than moves the mouse to the position of element _eTarget_ and releases the mouse button at this position.
     *
     * This implementation uses Webdriver actions which maybe not always behave as expected.
     *
     * For a more reliable experience {@link ThenableRegion.dragAndDrop} is recommended.
     *
     * @param eSource
     * @param eTarget
     */
    _dragDrop(eSource: SahiElementQueryOrWebElement, eTarget: SahiElementQueryOrWebElement): Promise<void>

    /**
     * Performs a mouse down on _eSource_, than moves the mouse to the position P(x,y) in the browsers viewport and releases the mouse button at this position.
     *
     * This implementation uses Webdriver actions which maybe not always behave as expected.
     *
     * For a more reliable experience {@link ThenableRegion.dragAndDrop} is recommended.
     *
     * @param q
     * @param x
     * @param y
     * @param $isRelative
     */
    _dragDropXY(q: SahiElementQueryOrWebElement, x: number, y: number, $isRelative?: boolean): Promise<void>

    /**
     * Sets the options within a `<select>` element.
     * Selection can be done by the acutal values of an option or it's zero-based element index.
     *
     * This action will invoke a click on the option element which means, that the _selected_ state is not enforced. If an option is already selected it will be unselected in this case.
     *
     * @example
     * Assume the following HTML-Snippet:
     * ```html
     * <select multiple="multiple" name="cities">
     *     <option value="muc">Munich</option>
     *     <option value="vie">Vienna</option>
     *     <option value="dus">Dusseldorf</option>
     * </select>
     * ```
     *
     * ```typescript
     * await _setSelected(_select('cities'), 'vie') // -> select the option Vienna
     * await _setSelected(_select('cities'), 0) // -> select the option Dusseldorf
     * ```
     *
     * @param query
     * @param optionToSelect
     * @param isMultiple
     */
    _setSelected(query: SahiElementQueryOrWebElement, optionToSelect: string | number | string[] | number[], isMultiple?: boolean): Promise<void>

}
