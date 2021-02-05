import { ThenableWebDriver } from "selenium-webdriver";
import { TestExecutionContext } from "@sakuli/core";
import { SahiRelation } from "./sahi-relation.interface";
import { SahiElementQuery } from "../sahi-element.interface";
import { sahiQueryToString } from "../sahi-element-utils";

export class RelationsResolver {
  constructor(
    readonly driver: ThenableWebDriver,
    readonly testExecutionContext: TestExecutionContext
  ) {}

  applyRelations(elementsQuery: SahiElementQuery): Promise<SahiElementQuery> {
    return elementsQuery.relations.reduce(
      async (last: Promise<SahiElementQuery>, relation: SahiRelation) => {
        const lastElement = await last;
        this.testExecutionContext.logger.trace(
          `Start applying relation to element`,
          sahiQueryToString(lastElement)
        );
        return await relation(lastElement);
      },
      Promise.resolve(elementsQuery)
    );
  }
}
