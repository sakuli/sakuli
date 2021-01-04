import { ParentApi } from "./parent-api.interface";
import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { SahiRelation } from "./sahi-relation.interface";

export interface RelationApi extends ParentApi {
  _in(anchor: SahiElementQueryOrWebElement): SahiRelation;

  /**
   * Creates a relation which returns the given element nearest (distance within the DOM tree) to the anchor
   *
   * @example
   * Assuming the following HTML-snippets
   * ```html
   * <div>
   *    <p id="elem0">elem</p>
   *    <p id="elem1">elem</p>
   *    <p id="anchor"></p>
   * </div>
   * ```
   * ```html
   * <div>
   *  <div>
   *    <p id="elem0">elem</p>
   *    <p id="elem1">elem</p>
   *  </div>
   *  <p id="anchor"></p>
   * </div>
   * ```
   *
   * The following query will return in both cases the element with id="elem0"
   * ```typescript
   * _paragraph("elem", _near(_paragraph("anchor"));
   * ```
   * @param anchor
   */
  _near(anchor: SahiElementQueryOrWebElement): SahiRelation;
  _under(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;
  _above(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;
  _underOrAbove(
    anchor: SahiElementQueryOrWebElement,
    offset?: number
  ): SahiRelation;
  _rightOf(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;
  _leftOf(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;
  _leftOrRightOf(
    anchor: SahiElementQueryOrWebElement,
    offset?: number
  ): SahiRelation;
}
