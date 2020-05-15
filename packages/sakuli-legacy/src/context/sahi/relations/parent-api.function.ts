import { ThenableWebDriver, WebElement } from "selenium-webdriver";
import { AccessorUtil } from "../accessor";
import { TestExecutionContext } from "@sakuli/core";
import { isSahiElementQuery, SahiElementQueryOrWebElement, } from "../sahi-element.interface";
import { getParent } from "../helper/get-parent.function";
import { isPresent } from "@sakuli/commons";
import { ParentApi } from "./parent-api.interface";

export function parentApi(
  driver: ThenableWebDriver,
  accessorUtil: AccessorUtil,
  ctx: TestExecutionContext
): ParentApi {
  async function _parentNode(
    query: SahiElementQueryOrWebElement | WebElement,
    tagName: string,
    occurrence: number = 1
  ): Promise<SahiElementQueryOrWebElement> {
    const e = isSahiElementQuery(query)
      ? await accessorUtil.fetchElement(query)
      : query;
    let parent = await getParent(e);
    while (isPresent(parent)) {
      const eTagName = await parent.getTagName();
      if (
        eTagName.toLocaleLowerCase() === tagName.toLocaleLowerCase() &&
        occurrence === 1
      ) {
        return parent;
      }
      if (
        eTagName.toLocaleLowerCase() === tagName.toLocaleLowerCase() &&
        occurrence > 1
      ) {
        occurrence = occurrence - 1;
      }
      parent = await getParent(parent);
    }
    throw Error(`Could not find any parent of type ${tagName}`);
  }

  async function _parentCell(
    query: SahiElementQueryOrWebElement,
    occurrence: number = 1
  ) {
    return _parentNode(query, "td", occurrence);
  }

  async function _parentRow(
    query: SahiElementQueryOrWebElement,
    occurrence: number = 1
  ) {
    return _parentNode(query, "tr", occurrence);
  }

  async function _parentTable(
    query: SahiElementQueryOrWebElement,
    occurrence: number = 1
  ) {
    return _parentNode(query, "table", occurrence);
  }

  return {
    _parentNode,
    _parentCell,
    _parentRow,
    _parentTable,
  };
}
