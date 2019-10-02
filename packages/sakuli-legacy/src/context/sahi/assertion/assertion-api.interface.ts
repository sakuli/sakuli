import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { FetchApi } from "../fetch";

export interface AssertionApi {
    _assert(condition: FetchApi, message?: String): Promise<null>;
    _assertTrue(condition: FetchApi, message?: String): Promise<null>;
    _assertFalse(condition: FetchApi, message?: String): Promise<null>;
    _assertNotTrue(condition: FetchApi, message?: String): Promise<null>;
    _assertContainsText(expected: String, element: SahiElementQueryOrWebElement, message?: String): Promise<null>;
    _assertNotContainsText(expected: String, element: SahiElementQueryOrWebElement, message?: String): Promise<null>;
    _assertEqual(expected: any, actual: any, message?: String): Promise<null>;
    _assertNotEqual(expected: any, actual: any, message?: String): Promise<null>;
    _assertEqualArrays(expected: Array<any>, actual: Array<any>, message?: String): Promise<null>;
    _assertExists(element: SahiElementQueryOrWebElement, message?: String): Promise<null>;
    _assertNotExists(element: SahiElementQueryOrWebElement, message?: String): Promise<null>;
    _assertNotNull(value: any, message?: String): Promise<null>;
    _assertNull(value: any, message?: String): Promise<null>;
}