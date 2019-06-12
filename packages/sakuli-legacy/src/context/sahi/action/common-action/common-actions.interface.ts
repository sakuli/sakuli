import {SahiElementQueryOrWebElement} from "../../sahi-element.interface";
import {WebElement} from "selenium-webdriver";

export interface CommonActionsApi {
    _eval<T=  any>(source: string, ..._args: any[]): Promise<T>
    _highlight(query: SahiElementQueryOrWebElement | WebElement, timeoutMs?: number): Promise<void>
    _wait(millis: number, expression?: (...locators: SahiElementQueryOrWebElement[]) => Promise<boolean>): Promise<void>
    _navigateTo(target: string, forceReload?: boolean, credentials?: { user: string, password: string }): Promise<any>
    _rteWrite(query: SahiElementQueryOrWebElement, content: string): Promise<void>
}