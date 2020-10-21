import { AccessorIdentifier } from "./api";
import { types } from "util";
import { stripIndents } from "common-tags";
import {
  SahiElementQuery,
  SahiElementQueryOrWebElement,
} from "./sahi-element.interface";
import { WebElement } from "selenium-webdriver";

export function isSahiElementQuery(o: any): o is SahiElementQuery {
  return (
    typeof o === "object" &&
    "identifier" in o &&
    "locator" in o &&
    "relations" in o
  );
}

export function identifierToString(identifier: AccessorIdentifier) {
  if (
    types.isRegExp(identifier) ||
    typeof identifier === "string" ||
    typeof identifier === "number"
  ) {
    return identifier.toString();
  } else {
    return JSON.stringify(identifier);
  }
}

export function sahiQueryToString({
  locator,
  relations,
  identifier,
}: SahiElementQuery) {
  return stripIndents`
        locator: ${locator.toString()}
        identifier: ${identifierToString(identifier)}
        relations: ${relations.map((f) => f.name).join(", ")}
    `;
}

export async function webElementToString(webElement: WebElement) {
  return stripIndents`
        tag: ${await webElement.getTagName()}
        text: ${await webElement.getText()}
        rect: ${JSON.stringify(await webElement.getRect())}
    `;
}

export async function stringifyElement(element: SahiElementQueryOrWebElement) {
  return isSahiElementQuery(element)
    ? sahiQueryToString(element)
    : await webElementToString(element);
}
