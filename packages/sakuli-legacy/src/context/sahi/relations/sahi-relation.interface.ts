import { SahiElementQuery, SahiElementQueryOrWebElement, } from "../sahi-element.interface";

/**
 * A Sahi relation is basically a mapping operation between two WebElement-Arrays
 * Usually it is produced by a higher order function wich injects some context to it.
 * <code>
 *     function _in(element: WebElement) {
 *         return async (elements: WebElement[]) {
 *             return Promise.all(elements.map(...))
 *         }
 *     }
 * </code>
 */
export type SahiRelation = (
  elements: SahiElementQuery
) => Promise<SahiElementQuery>;

export type RelationProducer = (
  anchorElement: SahiElementQueryOrWebElement
) => SahiRelation;
export type RelationProducerWithOffset = (
  anchorElement: SahiElementQueryOrWebElement,
  offset?: number
) => SahiRelation;
