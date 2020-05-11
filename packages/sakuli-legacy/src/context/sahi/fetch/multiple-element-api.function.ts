import { ThenableWebDriver, WebElement } from "selenium-webdriver";
import { accessorApi as createAccessorApi, AccessorFunctions, AccessorUtil, } from "../accessor";
import { TestExecutionContext } from "@sakuli/core";
import { SahiRelation } from "../relations/sahi-relation.interface";
import { AccessorIdentifier } from "../api";
import { isSahiElementQuery } from "../sahi-element.interface";
import { MultipleElementApi } from "./multiple-element-api.interface";

export function multipleElementApi(
  driver: ThenableWebDriver,
  accessorUtil: AccessorUtil,
  ctx: TestExecutionContext
): MultipleElementApi {
  const accessorApi = createAccessorApi();

  async function _collect(
    accessorApiMethod: AccessorFunctions,
    identifier: AccessorIdentifier,
    ...relations: SahiRelation[]
  ): Promise<WebElement[]> {
    const method = accessorApi[accessorApiMethod];
    const query = method(identifier, ...relations);
    if (isSahiElementQuery(query)) {
      return accessorUtil.fetchElements(query);
    } else {
      return [query];
    }
  }

  async function _count(
    accessorApiMethod: AccessorFunctions,
    identifier: AccessorIdentifier,
    ...relations: SahiRelation[]
  ) {
    const { length } = await _collect(
      accessorApiMethod,
      identifier,
      ...relations
    );
    return length;
  }

  return {
    _collect,
    _count,
  };
}
