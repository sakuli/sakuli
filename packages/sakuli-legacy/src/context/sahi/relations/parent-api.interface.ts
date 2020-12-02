import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { WebElement } from "selenium-webdriver";

export interface ParentApi {
  /**
   * Create a relation that specifies an element with `tagName` that encloses the anchor element `q`.
   * If `occurence` is given it specifies the "occurence" of the element, that should be taken, in the hierarchy above the anchor element.
   * The `occurence` defaults to 1.
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
   * The following query ...
   * ```
   * await _parentNode(_byId("anchor"), "div", 2))
   * ```
   * ... will return the element with id `"target"`.
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
  _parentCell(
    q: SahiElementQueryOrWebElement,
    occurrence?: number
  ): Promise<SahiElementQueryOrWebElement>;
  _parentRow(
    q: SahiElementQueryOrWebElement,
    occurrence?: number
  ): Promise<SahiElementQueryOrWebElement>;
  _parentTable(
    q: SahiElementQueryOrWebElement,
    occurrence?: number
  ): Promise<SahiElementQueryOrWebElement>;
}
