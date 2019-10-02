import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { FetchApi } from "../fetch";
import { AssertionApi } from "./assertion-api.interface";
import { AccessorUtil } from "../accessor";

export function assertionApi(
    accessorUtil: AccessorUtil
): AssertionApi {

    async function _assert(condition: FetchApi, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertTrue(condition: FetchApi, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertFalse(condition: FetchApi, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertNotTrue(condition: FetchApi, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertContainsText(expected: String, element: SahiElementQueryOrWebElement, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertNotContainsText(expected: String, element: SahiElementQueryOrWebElement, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertEqual(expected: any, actual: any, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertNotEqual(expected: any, actual: any, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertEqualArrays(expected: Array<any>, actual: Array<any>, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertExists(element: SahiElementQueryOrWebElement, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertNotExists(element: SahiElementQueryOrWebElement, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertNotNull(value: any, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    async function _assertNull(value: any, message?: String): Promise<null> {
        throw new Error("Not Implemented");
    }

    return({
        _assert,
        _assertTrue,
        _assertFalse,
        _assertNotTrue,
        _assertContainsText,
        _assertNotContainsText,
        _assertEqual,
        _assertNotEqual,
        _assertEqualArrays,
        _assertExists,
        _assertNotExists,
        _assertNotNull,
        _assertNull
    })
}