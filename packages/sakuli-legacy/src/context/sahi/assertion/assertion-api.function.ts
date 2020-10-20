import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { AssertionApi } from "./assertion-api.interface";
import { TestExecutionContext } from "@sakuli/core";
import { FetchApi } from "../fetch";
import { deepStrictEqual, notDeepStrictEqual } from "assert";
import { stringifyElement } from "../sahi-element-utils";

export function assertionApi(
  testExecutionContext: TestExecutionContext,
  fetchApi: FetchApi
): AssertionApi {
  async function _assert(
    condition: Promise<boolean>,
    message?: string
  ): Promise<void> {
    deepStrictEqual(await condition, true, message);
  }

  async function _assertTrue(
    condition: Promise<boolean>,
    message?: string
  ): Promise<void> {
    return _assert(condition, message);
  }

  async function _assertFalse(
    condition: Promise<boolean>,
    message?: string
  ): Promise<void> {
    return _assert(
      condition.then((c) => !c),
      message
    );
  }

  async function _assertNotTrue(
    condition: Promise<boolean>,
    message?: string
  ): Promise<void> {
    return _assertFalse(condition, message);
  }

  async function _assertContainsText(
    expected: string,
    element: SahiElementQueryOrWebElement,
    message?: string
  ): Promise<void> {
    if (!message) {
      message = `The element does not contain the expected text "${expected}"`;
    }
    return _assert(fetchApi._containsText(element, expected), message);
  }

  async function _assertNotContainsText(
    expected: string,
    element: SahiElementQueryOrWebElement,
    message?: string
  ): Promise<void> {
    if (!message) {
      message = `The following element contains the prohibited text "${expected}:"\n\n${await stringifyElement(
        element
      )}`;
    }
    return _assertFalse(fetchApi._containsText(element, expected), message);
  }

  async function _assertEqual(
    expected: any,
    actual: any,
    message?: string
  ): Promise<void> {
    deepStrictEqual(expected, actual, message);
  }

  async function _assertNotEqual(
    expected: any,
    actual: any,
    message?: string
  ): Promise<void> {
    notDeepStrictEqual(expected, actual, message);
  }

  async function _assertEqualArrays(
    expected: Array<any>,
    actual: Array<any>,
    message?: string
  ): Promise<void> {
    return _assertEqual(expected, actual, message);
  }

  async function _assertExists(
    element: SahiElementQueryOrWebElement,
    message?: string
  ): Promise<void> {
    if (!message) {
      message = `The given element does not exist`;
    }
    return _assert(fetchApi._exists(element), message);
  }

  async function _assertNotExists(
    element: SahiElementQueryOrWebElement,
    message?: string
  ): Promise<void> {
    if (!message) {
      message = `The given element exists`;
    }
    return _assertFalse(fetchApi._exists(element), message);
  }

  async function _assertNotNull(value: any, message?: string): Promise<void> {
    if (!message) {
      message = `Given value is null`;
    }
    return _assertNotEqual(value, null, message);
  }

  async function _assertNull(value: any, message?: string): Promise<void> {
    if (!message) {
      message = `${JSON.stringify(value)} does not equal null`;
    }
    return _assertEqual(value, null, message);
  }

  return {
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
    _assertNull,
  };
}
