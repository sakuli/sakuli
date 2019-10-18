import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { WebElement } from "selenium-webdriver";
import { MultipleElementApi } from "./multiple-element-api.interface";

export interface FetchApi extends MultipleElementApi {

    /**
     * Retrieves the actual _value_ from the value attribute of an [Element or Query]{@link SahiElementQueryOrWebElement}.
     *
     * @example
     *
     * Assume this HTML-snippet:
     * ```html
     * <input type="text" name="with-value" value="Hello World" />
     * <div id="without-value"></div>
     * ```
     *
     * Accessing the value of `[value]`
     *
     * ```typescript
     * const valueFromInput = await _getValue(_textbox('with-value')); // -> "Hello World"
     * const noValue = await _getValue(_div('without-value')); // -> undefined
     * ```
     *
     * @param query
     */
    _getValue(query: SahiElementQueryOrWebElement): Promise<string>;

    /**
     * Gets the visible (i.e. not hidden by CSS) innerText of this element, including sub-elements, without any leading or trailing whitespace. It uses [`WebElement.getText()`]{@link  https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElement.html#getText} method internally.
     *
     * @param query
     */
    _getText(query: SahiElementQueryOrWebElement): Promise<string>;

    /**
     * Alias for {@link FetchApi._getText}.
     *
     * @param query
     */
    _getCellText(query: SahiElementQueryOrWebElement): Promise<string>;

    /**
     * Finds all `option` elements within the queried element and resolves to an array with all visible texts of the options.
     * If the parameter `value` is set to `"value"` it will resolve to an array with all option values.
     *
     * @example
     *
     * Assume this HTML-snippet:
     * ```html
     * <select name="answers">
     *     <option value="a-yes">Yes</option>
     *     <option value="a-no">No</option>
     *     <option value="a-maybe">Maybe</option>
     * </select>
     * ```
     * Accessing either to displayed text or the actual values of the options:
     *
     * ```typescript
     * const optionTexts = await _getOptions(_select('answers')); // -> ['Yes', 'No', 'Maybe']
     * const optionValues = await _getOptions(_select('answers'), "value"); // -> ['a-yes', 'a-no', 'a-maybe']
     * ```
     *
     * @param query
     * @param value
     */
    _getOptions(query: SahiElementQueryOrWebElement, value?: "value"): Promise<string[]>;

    /**
     * Retrieves the text content of the selected `option` within the `select` element.
     *
     * @example
     *
     * Assume this HTML-snippet:
     * ```html
     * <select name="answers">
     *     <option value="a-yes">Yes</option>
     *     <option value="a-no">No</option>
     *     <option selected="selected" value="a-maybe">Maybe</option>
     *     <!-- Selected attribute is also set if the user (or Sakuli) selects the option in the browser -->
     * </select>
     * ```
     * Accessing either the displayed text or the actual value of the options:
     *
     * ```typescript
     * const selectedOptionText = await _getSelected(_select('answers')); // -> 'a-maybe'
     * ```
     * @param query
     */
    _getSelectedText(query: SahiElementQueryOrWebElement): Promise<string>;

    /**
     * Retrieves the value of an element attribute.
     *
     * @example
     * Assume this HTML-snippet:
     * ```html
     * <div
     *     data-testid="foo-element"
     *     class="widget primary"
     * >Foo bar</div>
     * ```
     * Accessing the values of div attributes:
     *
     * ```typescript
     * const dataTestId = await _getAttribute(_div(/Foo bar/), 'data-testid'); // -> "foo-element"
     * const classNames = await _getAttribute(_div(/Foo bar/), 'class'); // -> "widget primary"
     * ```
     */
    _getAttribute(query: SahiElementQueryOrWebElement, name: string): Promise<string>;


    /**
     * Resolves to `true` / `false` when the element can be found in the DOM or not.
     *
     * @example
     * Assume this HTML-snippet:
     * ```html
     * <div>Hello</div>
     * ```
     * Determine if an element is present in the current DOM:
     *
     * ```typescript
     * const present = await _exists(_div("Hello")); // -> true
     * const absent = await _exists(_div("World")); // -> false
     * ```
     *
     * @param query
     */
    _exists(query: SahiElementQueryOrWebElement): Promise<boolean>;

    /**
     * Checks if two queries resolves to the same element.
     *
     * @example
     * Assume this HTML-snippet:
     * ```html
     * <ul>
     *     <li>entry</li>
     *     <li>entry</li>
     * </ul>
     * ```
     *
     * Test the equality of two elements:
     *
     * ```typescript
     * // _listItem("entry") will fetch the first list item
     * const equal = await _areEqual(_listItem(0), _listItem("entry")) // -> true
     * const notEqual = await _areEqual(_listItem(1), _listItem("entry")) // -> false
     * ```
     *
     * @param query1
     * @param query2
     */
    _areEqual(query1: SahiElementQueryOrWebElement, query2: SahiElementQueryOrWebElement): Promise<boolean>;

    /**
     * Tests if this element is currently displayed.
     * Using a timeout of maximum one second. If a longer timeout is needed, {@link ActionApi._wait} can be used.
     * It uses [WebElement.isDisplayed]{@link https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElement.html#isDisplayed} internally.
     *
     * @example
     * Assume this HTML-snippet:
     * ```html
     * <div>Hello World</div>
     * <div style="display: none">Ninja Element</div>
     * ```
     * Testing the visibility of the elements:
     *
     * ```typescript
     * const visible = await _isVisible(_div("Hello World")) // -> true
     * const invisible = await _isVisible(_div("Ninja Element")) // -> false
     *
     * // Waits at most 5 seconds until element is visible
     *
     * await _wait(5000, () => _isVisible(_div('Hello World')));
     *
     * ```
     *
     * @param query
     */
    _isVisible(query: SahiElementQueryOrWebElement): Promise<boolean>;

    /**
     * Checks if the element has an attribute `checked`. This is useful for checkboxes or radio inputs.
     *
     * @example
     * Assume this HTML-snippet:
     * ```html
     *    <input type="radio" name="payment" value=debit-card" />
     *    <input type="radio" name="payment" value="cash" />
     * ```
     *
     * Checks if a radio input is checked or not:
     *
     * ```typescript
     * const checked = await _isChecked(_radio(0)); // -> true
     * const notChecked = await _isChecked(_radio(1)); // -> false
     * ```
     *
     * @param query
     */
    _isChecked(query: SahiElementQueryOrWebElement): Promise<boolean>;

    /**
     * Checks if an element is enabled. An element is considered as enabled when it has no `disabled` attribute set.
     *
     * @example
     * Assume this HTML-snippet:
     * ```html
     * <input type="text" id="enabled-input" />
     * <input type="text" disabled id="disabled-input" />
     * ```
     *
     * Check if the inputs are enabled:
     *
     * ```typescript
     * const enabled = await _isEnabled(_textbox('enabled-input')); // -> true
     * const disabled = await _isEnabled(_textbox('disabled-input')); // -> false
     * ```
     *
     * @param query
     */
    _isEnabled(query: SahiElementQueryOrWebElement): Promise<boolean>;

    /**
     * Checks if the displayed text of the element contains the given text.
     * The text parameter is turned into an RegExp object before performing the check.
     *
     * @example
     * Assume following HTML-snippet:
     * ```html
     * <p ="intro">
     * Lorem ipsum dolor sit amet. consetetur sadipscing elitr
     * </p>
     * <!-- Inner HTML-tags are stripped -->
     * <div>Hello <i>World</i></div>
     * <div id="pending-request">
     *     There are 5 pending request
     * </div>
     * ```
     *
     * Check if a element contains certain text:
     *
     * ```typescript
     * const containsIpsumDolor = await _containsText(_paragraph('intro'), 'ipsum dolor') // -> true
     * const containsYpsumDolor = await _containsText(_paragraph('intro'), 'ypsum dolor') // -> false
     *
     * const containsText = await _containsText(_div(0), 'Hello World'); // -> true
     *
     * const probablyDynamicText = await _containsText(_div('pending-request'), "There are . pending requests"); // -> true
     * ```
     *
     * @param query
     * @param text
     */
    _containsText(query: SahiElementQueryOrWebElement, text: string): Promise<boolean>;

    /**
     * Compares the [`.innerHTML`]{@link https://developer.mozilla.org/de/docs/Web/API/Element/innerHTML} of an element with the given html string.
     * Both `.innerHTML` and the snippet are unified using the [`html`]{@link https://github.com/declandewet/common-tags#html} function from [common-tags](https://www.npmjs.com/package/common-tags) library.
     *
     * @example
     * Assume the following HTML-snippet:
     * ```html
     * <div id="d1" style="background-color: yellow"><i>Formatted</i> Text</div>
     * ```
     * Check if an element contains certain HTML:
     *
     * ```typescript
     * await _containsHTML(_div(0), '<i>Formatted</i>'); // -> true
     * await _containsHTML(_div(0), 'Text'); // -> true
     * await _containsHTML(_div(0), '<i>Formatted</i> Text'); // -> true
     * await _containsHTML(_div(0), '<i>.*</i>'); // -> true
     * await _containsHTML(_div(0), 'Formatted Text'); // -> false
     * await _containsHTML(_div(0), 'Non existent'); // -> false
     * ```
     *
     * @param query
     * @param html
     */
    _containsHTML(query: SahiElementQueryOrWebElement, html: string): Promise<boolean>;

    /**
     * Check if a _parent_ element contains a _child_ element.
     *
     * @example
     * Assume the following HTML-snippet:
     * ```html
     * <div id="parent">
     *     <div id="child-a"></div>
     *     <div id="child-b"></div>
     * </div>
     * ```
     * Check if an element is the contained within another
     *
     * ```typescript
     * await _contains(_div('parent'), _div('child-b')) // -> true
     * await _contains(_div('child-a'), _div('child-b')) // -> false
     * ```
     *
     * @param parent
     * @param child
     */
    _contains(parent: SahiElementQueryOrWebElement, child: SahiElementQueryOrWebElement): Promise<boolean>

    /**
     * Retrieves the current text content of the documents [`title`]{@link https://developer.mozilla.org/de/docs/Web/HTML/Element/title} element.
     *
     * @example
     * Assuming the following document:
     * ```html
     * <!DOCTYPE html>
     * <html>
     * <head>
     *   <title>Tested with Sakuli</title>
     * </head>
     * <body>
     * </body>
     * </html>
     * ```
     * Accessing the current Title of the element:
     * ```typescript
     * const title = await _title() // -> "Tested with Sakuli";
     * ```
     */
    _title(): Promise<string>;

    /**
    * Styles in HTML elements are calculated by the browser based on various CSS rules.
    * `_style` returns the computed style that is finally applicable to the element.
    * If the element inherits the named style from
    * its parent, the parent will be queried for its value. Where possible,
    * color values will be converted to their hex representation (e.g. `#00ff00`
    * instead of `rgb(0, 255, 0)`).
    *
    * Accessing the style directly as an attribute will not return a computed style.
    * Always use `_style` instead.
    *
    * _Warning:_ A proper assertion will be difficult as some browser may interpret it differently.
    *
    * @param query
    * @param attr
    */
    _style(query: SahiElementQueryOrWebElement, attr: string): Promise<string>;

    /**
     * Returns a tuple describing an element's location, in pixels relative to
     * the document element.
     *
     * @example
     * Assuming a modal overlay element at x: 300 and y: 400
     * ```typescript
     * const [x,y] = await _position(_div('modal')) // -> [300, 400];
     * ```
     *
     * @param query
     */
    _position(query: SahiElementQueryOrWebElement): Promise<[number, number]>;

    /**
     * Retrieves the selection from a user in the current document as a `string`.
     * This is most likely the text what will set to the clipboard if a user
     * copies the selection.
     */
    _getSelectionText(): Promise<string>

    /**
     * Executes the given query and returns a "native" [`WebElement`]{@link https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElement.html} instance
     * when the query is successful.
     *
     * @param query
     */
    _fetch(query: SahiElementQueryOrWebElement): Promise<WebElement>;



}
