import {ThenableWebDriver, WebElement} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";
import {SahiRelation} from "./sahi-relation.interface";
import {SahiElementQuery} from "../sahi-element.interface";

export class RelationsResolver {
    constructor(
        readonly driver: ThenableWebDriver,
        readonly testExecutionContext: TestExecutionContext
    ) {}

    applyRelations(elementsQuery: SahiElementQuery): Promise<SahiElementQuery> {
        return elementsQuery.relations.reduce(async (last: Promise<SahiElementQuery>, relation: SahiRelation) => {
            return await relation(await last);
        }, Promise.resolve(elementsQuery))
    }
}