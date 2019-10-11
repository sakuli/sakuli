import {SahiElementQueryOrWebElement} from "../sahi-element.interface";
import {WebElement} from "selenium-webdriver";
import {MultipleElementApi} from "./multiple-element-api.interface";

export interface FetchApi extends MultipleElementApi {
    _getValue(query: SahiElementQueryOrWebElement): Promise<string>;
    _getText(query: SahiElementQueryOrWebElement): Promise<string>;
    _getCellText(query: SahiElementQueryOrWebElement): Promise<string>;
    _getOptions(query: SahiElementQueryOrWebElement, value?: "value"): Promise<string[]>;
    _getSelectedText(query: SahiElementQueryOrWebElement): Promise<string>;
    _getAttribute(query: SahiElementQueryOrWebElement, name: string): Promise<string>;
    _exists(query: SahiElementQueryOrWebElement): Promise<boolean>;
    _areEqual(query1: SahiElementQueryOrWebElement,query2: SahiElementQueryOrWebElement): Promise<boolean>;
    _isVisible(query: SahiElementQueryOrWebElement): Promise<boolean>;
    _isChecked(query: SahiElementQueryOrWebElement): Promise<boolean>;
    _isEnabled(query: SahiElementQueryOrWebElement): Promise<boolean>;
    _containsText(query: SahiElementQueryOrWebElement, text: string): Promise<boolean>;
    _containsHTML(query: SahiElementQueryOrWebElement, html: string): Promise<boolean>;
    _contains(parent: SahiElementQueryOrWebElement, child: SahiElementQueryOrWebElement): Promise<boolean>
    _title(): Promise<string>;
    _style(query: SahiElementQueryOrWebElement, attr: string): Promise<string>;
    _position(query: SahiElementQueryOrWebElement): Promise<[number, number]>;
    _getSelectionText(): Promise<string>
    _fetch(query: SahiElementQueryOrWebElement): Promise<WebElement>;



}