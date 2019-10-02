import { SahiElementQueryOrWebElement } from "../sahi-element.interface";

export interface AssertionApi {
    _assert(condition: Promise<boolean>, message?: string): Promise<void>;
    _assertTrue(condition: Promise<boolean>, message?: string): Promise<void>;
    _assertFalse(condition: Promise<boolean>, message?: string): Promise<void>;
    _assertNotTrue(condition: Promise<boolean>, message?: string): Promise<void>;
    _assertContainsText(expected: string, element: SahiElementQueryOrWebElement, message?: string): Promise<void>;
    _assertNotContainsText(expected: string, element: SahiElementQueryOrWebElement, message?: string): Promise<void>;
    _assertEqual(expected: any, actual: any, message?: string): Promise<void>;
    _assertNotEqual(expected: any, actual: any, message?: string): Promise<void>;
    _assertEqualArrays(expected: Array<any>, actual: Array<any>, message?: string): Promise<void>;
    _assertExists(element: SahiElementQueryOrWebElement, message?: string): Promise<void>;
    _assertNotExists(element: SahiElementQueryOrWebElement, message?: string): Promise<void>;
    _assertNotNull(value: any, message?: string): Promise<void>;
    _assertNull(value: any, message?: string): Promise<void>;
}