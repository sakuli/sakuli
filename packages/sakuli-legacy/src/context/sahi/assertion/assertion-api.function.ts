import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { AssertionApi } from "./assertion-api.interface";
import { TestExecutionContext } from "@sakuli/core";

export function assertionApi(
    testExecutionContext: TestExecutionContext
): AssertionApi {

    async function _assert(condition: Promise<boolean>, message: string = "Condition evaluated to 'false'"): Promise<void> {
        if(!await condition){
            testExecutionContext.logger.error(message, condition);
            throw new Error(message);
        }
        return Promise.resolve();
    }

    async function _assertTrue(condition: Promise<boolean>, message?: string): Promise<void> {
        return _assert(condition, message);
    }

    async function _assertFalse(condition: Promise<boolean>, message?: string): Promise<void> {
        throw new Error("Not Implemented");
    }

    async function _assertNotTrue(condition: Promise<boolean>, message?: string): Promise<void> {
        throw new Error("Not Implemented");
    }

    async function _assertContainsText(expected: string, element: SahiElementQueryOrWebElement, message?: string): Promise<void> {
        throw new Error("Not Implemented");
    }

    async function _assertNotContainsText(expected: string, element: SahiElementQueryOrWebElement, message?: string): Promise<void> {
        throw new Error("Not Implemented");
    }

    async function _assertEqual(expected: any, actual: any, message?: string): Promise<void> {
        throw new Error("Not Implemented");
    }

    async function _assertNotEqual(expected: any, actual: any, message?: string): Promise<void> {
        throw new Error("Not Implemented");
    }

    async function _assertEqualArrays(expected: Array<any>, actual: Array<any>, message?: string): Promise<void> {
        throw new Error("Not Implemented");
    }

    async function _assertExists(element: SahiElementQueryOrWebElement, message?: string): Promise<void> {
        throw new Error("Not Implemented");
    }

    async function _assertNotExists(element: SahiElementQueryOrWebElement, message?: string): Promise<void> {
        throw new Error("Not Implemented");
    }

    async function _assertNotNull(value: any, message?: string): Promise<void> {
        throw new Error("Not Implemented");
    }

    async function _assertNull(value: any, message?: string): Promise<void> {
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