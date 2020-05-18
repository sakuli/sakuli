import { ThenableWebDriver } from "selenium-webdriver";
import { TestExecutionContext } from "@sakuli/core";
import {
  accessorApi,
  AccessorIdentifierAttributes,
  AccessorUtil,
} from "./accessor";
import { SahiRelation } from "./relations/sahi-relation.interface";
import { relationsApi, RelationsResolver } from "./relations";
import { SahiElementQueryOrWebElement } from "./sahi-element.interface";
import { actionApi } from "./action";
import { fetchApi } from "./fetch";
import { SahiApi } from "./sahi-api.interface";
import { assertionApi } from "./assertion/assertion-api.function";

/**
 * Generic type which can be used in the most [AccessorApi Functions]{@link AccessorApi}. It is inspired by the [Sahi syntax](https://sahipro.com/docs/sahi-apis/accessor-api-basics.html).
 *
 * The AccessorIdentifer is part of a [ElementQuery]{@link ElementQuery} and probably the most used by test-authors.
 *
 * Behavior will depend on the actual type of the identifier:
 *
 * - *number*: Is considered as the zero-based index of all found element
 * - *string*: Is used to find an element by it's text-content
 * - *AccessorIdentifierAttributes*: {@see AccessorIdentifierAttributes}
 * - *RegExp*: Is used to find an element by it's text-content that matches the [RegExp](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/RegExp)
 *
 * @example
 *
 * Consider this HTML-snippet:
 *
 * ```html
 *    <ul>
 *      <li>Item 1</li>
 *      <li>Item 2</li>
 *      <li>Item 3</li>
 *    </ul>
 * ```
 *
 *  You can utilize the AccessorIdentifier like this:
 *
 * ```typescript
 *
 *     _listItem(0); // Queries `<li>Item 1</li>`
 *     _listItem("Item 2"); // Queries `<li>Item 2</li>`
 *     _listItem(/3/); // Queries `<li>Item 3</li>`
 *
 * ```
 *
 */
export type AccessorIdentifier =
  | number
  | string
  | AccessorIdentifierAttributes
  | RegExp;
export type AccessorFunction = (
  identifier: AccessorIdentifier,
  ...relations: SahiRelation[]
) => SahiElementQueryOrWebElement;

export function sahiApi(
  driver: ThenableWebDriver,
  testExecutionContext: TestExecutionContext
): SahiApi {
  const relationResolver = new RelationsResolver(driver, testExecutionContext);
  const accessorUtil = new AccessorUtil(
    driver,
    testExecutionContext,
    relationResolver
  );
  const action = actionApi(driver, accessorUtil, testExecutionContext);
  const accessor = accessorApi();
  const relations = relationsApi(driver, accessorUtil, testExecutionContext);
  const fetch = fetchApi(driver, accessorUtil, testExecutionContext);
  const assertion = assertionApi(testExecutionContext, fetch);
  return {
    ...action,
    ...accessor,
    ...relations,
    ...fetch,
    ...assertion,
    _dynamicInclude: (): Promise<void> => Promise.resolve(),
    _setFetchTimeout: (timeout: number) => {
      accessorUtil.setTimeout(timeout);
    },
    _getFetchTimeout: (): number => {
      return accessorUtil.getTimeout();
    },
  };
}
