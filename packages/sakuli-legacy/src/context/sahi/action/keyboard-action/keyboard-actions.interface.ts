import {SahiElementQueryOrWebElement} from "../../sahi-element.interface";
import {CharInfo} from "../char-info.interface";

export interface KeyboardActionsApi {
    _setValue(query: SahiElementQueryOrWebElement, value: string): Promise<void>
    _keyDown(query: SahiElementQueryOrWebElement, charInfo: CharInfo, combo?: string): Promise<void>
    _keyUp(query: SahiElementQueryOrWebElement, charInfo: CharInfo): Promise<void>
    _keyPress(query: SahiElementQueryOrWebElement, charInfo: CharInfo, combo?: string): Promise<void>
    _type(query: SahiElementQueryOrWebElement, text: string): Promise<void>
}