import { ParentApi } from "./parent-api.interface";
import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { SahiRelation } from "./sahi-relation.interface";

export interface RelationApi extends ParentApi {
  /**
   * Create a relation that specifies elements inside an anchor element.
   *
   * @example
   * <br />Assuming this HTML-snippet:
   *
   * ```html
   * <b>something</b>
   * <div>
   *   <b>something else</b>
   * </div>
   * ```
   *
   * The following expression ...
   * ```typescript
   * await _bold(0, _in(_div(1)))
   * ```
   * ... would return the second bold element.
   * @param anchor
   */
  _in(anchor: SahiElementQueryOrWebElement): SahiRelation;
  _near(anchor: SahiElementQueryOrWebElement): SahiRelation;

  /**
   * Create a relation that specifies elements that are geometrically under an anchor element.
   *
   * **Note**: The specified elements must be intersected by the same vertical line. E.g.:
   *
   * ```
   * +----+
   * | 1  |
   * +----+
   *          +----+
   *          | 2  |
   *          +----+
   *      +----+
   *      | 3  |
   *      +----+
   * ```
   * In this sense element `3` is  "under" element `2` and element `3` is also "under" element `1`, but element `2` is not "under" element `1`.
   *
   * **Note**: Reference for the relation is the geometrical center of each element.
   * That means that elements, that are part of the relation, can overlap with the anchor element.
   * @param anchor
   * @param offset
   */
  _under(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;

  /**
   * Create a relation that specifies elements that are geometrically above an anchor element.
   *
   * **Note**: The specified elements must be intersected by the same vertical line.
   * This works just the same as in [[`_under`]].
   * @param anchor
   * @param offset
   */
  _above(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;

  /**
   * Create a relation that specifies elements that are geometrically under or above an anchor element.
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
   * Create a relation that specifies elements that are geometrically right of an anchor element.
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
   * In this sense, element `3` is "right" of element `1` and element `2`, but element `2` is not "right" of element `1`.
   *
   * **Note**: Reference for the relation is the geometrical center of each element.
   * This means, that elements, that are part of the relation, can overlap with the anchor element.
   * @param anchor
   * @param offset
   */
  _rightOf(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;

  /**
   * Create a relation that specifies elements that are geometrically left of an anchor element.
   *
   * **Note**: The specified elements must be intersected by the same horizontal line.
   * This works just the same as in [[`_rightOf`]].
   * @param anchor
   * @param offset
   */
  _leftOf(anchor: SahiElementQueryOrWebElement, offset?: number): SahiRelation;

  /**
   * Create a relation that specifies elements that are geometrically left of right of an anchor element.
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
