import { SahiElementQueryOrWebElement } from "../../sahi-element.interface";

/**
 * Combines methods to bring either focus or blur to webelements elements
 */
export interface FocusActionApi {
  /**
   * Fetches an element and performs the native `.focus()` method in the browser.
   * When `_focus` is performed on an `<input>` element, it will be automatically scrolled into the viewport by the browser.
   *
   * Note that not all elements will get an actual focus in the browser.
   * Usually links and user-controls (e.g. `<input>`, `<textarea>`, `<select>`...) can gain focus.
   *
   * @param {SahiElementQueryOrWebElement} query - Query or concrete WebElement
   * @return {Promise<void>} Resolves when browser-script finished
   */
  _focus(query: SahiElementQueryOrWebElement): Promise<void>;

  /**
   *
   * Fetches an element and performs the native `.blur()` in the browser.
   * That means that this element will lose the focus-state.
   *
   * @param {SahiElementQueryOrWebElement} q - Query or concrete Webelement
   * @return {Promise<void>} Resolves when browser-script finished
   *
   */
  _blur(query: SahiElementQueryOrWebElement): Promise<void>;
  _removeFocus(query: SahiElementQueryOrWebElement): Promise<void>;
}
