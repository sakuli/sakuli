import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { WebElement } from "selenium-webdriver";

export interface ParentApi {
    _parentNode(q: SahiElementQueryOrWebElement | WebElement, tagName: string, occurrence?: number): Promise<SahiElementQueryOrWebElement>;
    _parentCell(q: SahiElementQueryOrWebElement, occurrence?: number): Promise<SahiElementQueryOrWebElement>;
    _parentRow(q: SahiElementQueryOrWebElement, occurrence?: number): Promise<SahiElementQueryOrWebElement>;
    _parentTable(q: SahiElementQueryOrWebElement, occurrence?: number): Promise<SahiElementQueryOrWebElement>;
}
