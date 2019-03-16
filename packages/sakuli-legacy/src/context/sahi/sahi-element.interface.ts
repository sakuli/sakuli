import {Locator, WebElement} from "selenium-webdriver";
import {SahiRelation} from "./relations/sahi-relation.interface";
import {AccessorIdentifier} from "./api";
import {ifPresent, Maybe} from "@sakuli/commons";
import {stripIndents} from "common-tags";
import {types} from "util";


export interface SahiElementQuery {
    locator: Locator,
    identifier: AccessorIdentifier,
    relations: SahiRelation[]
}
export type  SahiElementQueryOrWebElement = SahiElementQuery | WebElement;

export interface SahiElement {
    element: Maybe<WebElement>,
    query: SahiElementQueryOrWebElement
}

export function isSahiElementQuery(o: any): o is SahiElementQuery {
    return typeof o === "object"
        && 'identifier' in o
        && 'locator' in o
        && 'relations' in o;
}

export function identifierToString(identifier: AccessorIdentifier) {
    if (
        types.isRegExp(identifier) ||
        typeof identifier === 'string' ||
        typeof identifier === 'number') {
        return identifier.toString();
    } else {
        return JSON.stringify(identifier);
    }
}

export function sahiQueryToString({locator, relations, identifier}: SahiElementQuery) {
    return stripIndents`
        Locator: ${locator.toString()}
        identifier: ${identifierToString(identifier)}
        relations: ${relations.map(f => f.name).join(', ')}
    `
}