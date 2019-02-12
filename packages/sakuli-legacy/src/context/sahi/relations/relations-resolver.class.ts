import {ThenableWebDriver, WebElement} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";
import {SahiRelation} from "./sahi-relation.interface";

export class RelationsResolver {
    constructor(
        readonly driver: ThenableWebDriver,
        readonly testExecutionContext: TestExecutionContext
    ) {}

    applyRelations(elements: WebElement[], relations: SahiRelation[]): Promise<WebElement[]> {
        return relations.reduce(async (last: Promise<WebElement[]>, relation: SahiRelation) => {
            return await relation(await last);
        }, Promise.resolve(elements))
    }
}