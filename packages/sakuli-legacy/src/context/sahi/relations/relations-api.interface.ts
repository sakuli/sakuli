import { ParentApi } from "./parent-api.interface";
import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { SahiRelation } from "./sahi-relation.interface";

export interface RelationApi extends ParentApi {
  /**
   * Creates a relation that specifies elements inside the anchor element.
   *
   * @example
   * <br />Assuming this HTML-snippet:
   *
   * ```html
   * <b>something</b>
   * <div id="div1">
   *   <b>something</b>
   * </div>
   * ```
   *
   * The following expression returns the second bold element.
   * ```typescript
   * await _bold("something", _in(_byId("div1")));
   * ```
   * @param anchor
   */
  _in(anchor: SahiElementQueryOrWebElement): SahiRelation;

  /**
   * Creates a relation that sorts elements according to how close they are to the anchor element.
   *
   * @param anchor
   */
  _near(anchor: SahiElementQueryOrWebElement): SahiRelation;

  /**
   * Creates a relation that specifies elements that are vertically aligned under the center of the anchor element.
   *
   * @example
   * ```
   * +----+
   * | 1  |
   * +----+
   *      :   +----+
   *      :   | 2  |
   *      :   +----+
   *      +----+
   *      | 3  |
   *      +----+
   * ```
   * In this case element `3` is  "under" element `2` and element `3` is also "under" element `1`, but element `2` is not "under" element `1`.
   *
   * @param anchor
   * @param offset
   */
  _under(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;

  /**
   * Creates a relation that specifies elements that are geometrically above the anchor element.
   *
   * **Note**: The specified elements must be intersected by the same vertical line.
   * This works just the same as in [[`_under`]].
   * @param anchor
   * @param offset
   */
  _above(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;

  /**
   * Creates a relation that specifies elements that are geometrically under or above the anchor element.
   *
   * **Note**: The specified elements must be intersected by the same vertical line.
   * This works just the same as in [[`_under`]].
   * @param anchor
   * @param offset
   */
  _underOrAbove(
    anchor: SahiElementQueryOrWebElement,
    offset?: number
  ): SahiRelation;

  /**
   * Creates a relation that specifies elements that are geometrically right of the anchor element.
   *
   * **Note**: The specified elements must be intersected by the same horizontal line.
   * ```
   * +----+
   * | 1  |
   * +----+          +----+
   *         +----+  | 3  |
   *         | 2  |  +----+
   *         +----+
   * ```
   * In this case element `3` is "right" of element `1` and element `2`, but element `2` is not "right" of element `1`.
   *
   * **Note**: Reference for the relation is the geometrical center of each element.
   * This means, that elements, that are part of the relation, can overlap with the anchor element.
   * @param anchor
   * @param offset
   */
  _rightOf(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;

  /**
   * Creates a relation that specifies elements that are geometrically left of the anchor element.
   *
   * **Note**: The specified elements must be intersected by the same horizontal line.
   * This works just the same as in [[`_rightOf`]].
   * @param anchor
   * @param offset
   */
  _leftOf(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;

  /**
   * Creates a relation that specifies elements that are geometrically left or right of the anchor element.
   *
   * **Note**: The specified elements must be intersected by the same horizontal line.
   * This works just the same as in [[`_rightOf`]].
   * @param anchor
   * @param offset
   */
  _leftOrRightOf(
    anchor: SahiElementQueryOrWebElement,
    offset?: number
  ): SahiRelation;
}
