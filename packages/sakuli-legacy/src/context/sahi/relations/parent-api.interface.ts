import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { WebElement } from "selenium-webdriver";

export interface ParentApi {
  /**
   * Fetch an element with `tagName` that encloses the anchor element `q`.
   * If `occurence` is given it specifies the "occurence" of the element, that should be taken, in the hierarchy above the anchor element.
   * The `occurence` defaults to 1, if not specified.
   *
   * @example Assuming this HTML-snippet:
   * ```
   * <div>
   *   <div>something else</div>
   *   <div id="target">
   *     something something
   *     <section>
   *     <div>
   *       <b id="anchor">something</b>
   *     </div>
   *     </section>
   *   </div>
   * </div>
   * ```
   * The following query returns the element with id `"target"`.
   * ```
   * await _parentNode(_byId("anchor"), "div", 2);
   * ```
   *
   * **Note**: Exits with an error if the `occurence` parameter is higher than the number of elements with tag `tagName` in the hierarchy above the anchor element `q`.
   *
   * @param q
   * @param tagName
   * @param occurrence
   */
  _parentNode(
    q: SahiElementQueryOrWebElement | WebElement,
    tagName: string,
    occurrence?: number
  ): Promise<SahiElementQueryOrWebElement>;

  /**
   * Fetch a HTML-table-cell (with tag `td`), if the element specified by `q` is its child.
   * If `occurence` is given it specifies the "occurence" of the element, that should be taken, in the hierarchy above the anchor element.
   * The `occurence` defaults to 1, if not specified.
   *
   * @example Assuming this HTML-snippet:
   * ```
   * <td>
   *   <div>text</div>
   * </td>
   * ```
   * The folliwing query returns the `<td>` element.
   * ```
   * await _parentCell(_div("text"));
   * ```
   * @param q
   * @param occurrence
   */
  _parentCell(
    q: SahiElementQueryOrWebElement,
    occurrence?: number
  ): Promise<SahiElementQueryOrWebElement>;

  /**
   * Fetch a HTML-table-row if it is a parent of the element specified by `q`.
   * If `occurence` is given it specifies the "occurence" of the element, that should be taken, in the hierarchy above the anchor element.
   * The `occurence` defaults to 1, if not specified.
   *
   * @param q
   * @param occurrence
   */
  _parentRow(
    q: SahiElementQueryOrWebElement,
    occurrence?: number
  ): Promise<SahiElementQueryOrWebElement>;

  /**
   * Fetch a HTML-table if it is a parent of the element specified by `q`.
   * If `occurence` is given it specifies the "occurence" of the element, that should be taken, in the hierarchy above the anchor element.
   * The `occurence` defaults to 1, if not specified.
   *
   * @param q
   * @param occurrence
   */
  _parentTable(
    q: SahiElementQueryOrWebElement,
    occurrence?: number
  ): Promise<SahiElementQueryOrWebElement>;
}
