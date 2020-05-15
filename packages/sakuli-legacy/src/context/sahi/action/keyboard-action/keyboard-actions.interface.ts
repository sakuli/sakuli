import { SahiElementQueryOrWebElement } from "../../sahi-element.interface";
import { CharInfo } from "../char-info.interface";

export interface KeyboardActionsApi {
  /**
   * Sets a value on an `<input />` field.
   *
   * It will clear the existing value from the input before:
   *
   * - It will send each character from the _value_ string to the input with an delay of 10 ms
   *   using [.sendKeys]{@link https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElement.html#sendKeys}.
   *   This ensures that components which rely on key-events (like `keyup` or `keydown`) will behave
   *   as expected on the page.
   *
   * - When [.sendKeys]{@link https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElement.html#sendKeys} fails,
   *   `_setValue` will try to set the value attribute of the dom element.
   *
   * @example
   * Assume the following HTML-snippet:
   * ```html
   * <form>
   *     <input type="text" name="username"/>
   *     <input type="password" name="password" />
   * </form>
   * ```
   *
   * `_setValue` can be used to enter login information:
   *
   * ```typescript
   * await _setValue(_textbox('username'), 'IamGroot');
   * await _setValue(_password('password'), '$secret');
   * ```
   *
   *
   * @param query
   * @param value
   */
  _setValue(query: SahiElementQueryOrWebElement, value: string): Promise<void>;

  /**
   * Invokes a single `keydown` event on the given element.
   * This is useful if you want to invoke a certain event which relies
   * on the keydown event. In most cases it has to be used together with {@link KeyboardActionsApi._keyUp}
   *
   * @param query
   * @param charInfo
   * @param combo - Optional combo key(s): can be <kbd>CTRL</kbd>, <kbd>SHIFT</kbd>, <kbd>ALT</kbd> or <kbd>META</kbd>;
   *   Can also be two or more keys together like `"CTRL|SHIFT"`
   */
  _keyDown(
    query: SahiElementQueryOrWebElement,
    charInfo: CharInfo,
    combo?: string
  ): Promise<void>;

  /**
   * Invokes a single `keyup` event with the given element.
   * This is only useful when {@link KeyboardActionsApi._keyDown} is invoked previously. Some WebDrivers like Firefox will not trigger any event if there was no keypress before.
   *
   * @param query
   * @param charInfo
   */
  _keyUp(
    query: SahiElementQueryOrWebElement,
    charInfo: CharInfo
  ): Promise<void>;

  /**
   * Performs a single keystroke (`'keypress'`-event) on the element.
   *
   * @example
   * Performing <kbd>CTRL</kbd>+<kbd>s</kbd> on an (imaginary) web-based word-processor element:
   * ```typescript
   * await _keyPress(_byId('word-processor-canvas'), 's', 'CTRL')
   * ```
   *
   * @param query
   * @param charInfo
   * @param combo - Optional combo key(s): can be <kbd>CTRL</kbd>, <kbd>SHIFT</kbd>, <kbd>ALT</kbd> or <kbd>META</kbd>;
   *   Can also be two or more keys together like `"CTRL|SHIFT"`
   */
  _keyPress(
    query: SahiElementQueryOrWebElement,
    charInfo: CharInfo,
    combo?: string
  ): Promise<void>;

  /**
   * Invokes [.sendKeys]{@link https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/lib/webdriver_exports_WebElement.html#sendKeys} on the given element.
   * It will neither type with a delay nor set the `value`-attribute when the method fails.
   *
   * @param query
   * @param text
   */
  _type(query: SahiElementQueryOrWebElement, text: string): Promise<void>;
}
