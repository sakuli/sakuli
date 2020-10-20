import { Locator, WebElement } from "selenium-webdriver";
import { SahiRelation } from "./relations/sahi-relation.interface";
import { AccessorIdentifier } from "./api";

export interface SahiElementQuery {
  locator: Locator;
  identifier: AccessorIdentifier;
  relations: SahiRelation[];
}

export type SahiElementQueryOrWebElement = SahiElementQuery | WebElement;
