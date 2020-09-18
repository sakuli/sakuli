import { AccessorFunctions } from "../accessor";
import { AccessorIdentifier } from "../api";
import { SahiRelation } from "../relations/sahi-relation.interface";
import { WebElement } from "selenium-webdriver";

export interface MultipleElementApi {
  /**
   * Collects all specified elements
   *
   * @example
   * Assuming the following HTML-snippet:
   * ```html
   *     <div class="city">Los Angeles</div>
   *     <div class="city>Berlin</div>
   * ```
   *
   * Highlights the div containing second city:
   * ```typescript
   *     const cities = await _collect('_div', 'city');
   *
   *     await _highlight(cities[0]);
   * ```
   *
   *
   * @param accessorApiMethod
   * @param identifier
   * @param relations
   */
  _collect(
    accessorApiMethod: AccessorFunctions,
    identifier: AccessorIdentifier,
    ...relations: SahiRelation[]
  ): Promise<WebElement[]>;

  /**
   *
   * Counts all specified elements
   *
   * @example
   * Assuming the following HTML-snippet:
   * ```html
   *     <div class="city">Los Angeles</div>
   *     <div class="city>Berlin</div>
   * ```
   *
   * Logs the city count into sakuli.log:
   * ```typescript
   *     const cityCount = await _count('_div', 'city');
   *
   *     Logger.logInfo(`${cityCount} cities found`);
   * ```
   *
   * @param accessorApiMethod
   * @param identifier
   * @param relations
   */
  _count(
    accessorApiMethod: AccessorFunctions,
    identifier: AccessorIdentifier,
    ...relations: SahiRelation[]
  ): Promise<number>;
}
