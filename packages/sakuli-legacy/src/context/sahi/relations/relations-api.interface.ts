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

  /**
   * Create a relation that sorts elements by how near they are to an anchor element.
   *
   * The distance between two elements is determined by the minimum amount of steps
   * you have to move up or down the dom-hierarchy to get from one element to the other.
   * ```
   * <div>
   *   <div>
   *     <b id="elem"></b>
   *   </div>
   *   <code id="anchor"></code>
   * </div>
   * ```
   * The HTML-element with id "elem" has a distance of 3 to the anchor element.
   *
   * If two elements require the exact same amount of steps to reach from an anchor element,
   * the element that is above in the html source code is determined to be nearer to the anchor.
   * ```
   * <div>
   *   <div>
   *     <b id="elem1"></b>
   *     <b id="elem2"></b>
   *   </div>
   *   <code id="anchor"></code>
   * </div>
   * ```
   * In the above example the element with id "elem1" is nearer to the anchor than the element with id "elem2".
   * @param anchor
   */
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
