import { SahiElementQueryOrWebElement } from "../sahi-element.interface";

export interface AssertionApi {
    _assert(condition: Promise<boolean>, message?: String): Promise<void>;
    _assertTrue(condition: Promise<boolean>, message?: String): Promise<void>;
    _assertFalse(condition: Promise<boolean>, message?: String): Promise<void>;
    _assertNotTrue(condition: Promise<boolean>, message?: String): Promise<void>;
    _assertContainsText(expected: String, element: SahiElementQueryOrWebElement, message?: String): Promise<void>;
    _assertNotContainsText(expected: String, element: SahiElementQueryOrWebElement, message?: String): Promise<void>;
    _assertEqual(expected: any, actual: any, message?: String): Promise<void>;
    _assertNotEqual(expected: any, actual: any, message?: String): Promise<void>;
    _assertEqualArrays(expected: Array<any>, actual: Array<any>, message?: String): Promise<void>;
    _assertExists(element: SahiElementQueryOrWebElement, message?: String): Promise<void>;
    _assertNotExists(element: SahiElementQueryOrWebElement, message?: String): Promise<void>;
    _assertNotNull(value: any, message?: String): Promise<void>;
    _assertNull(value: any, message?: String): Promise<void>;
}