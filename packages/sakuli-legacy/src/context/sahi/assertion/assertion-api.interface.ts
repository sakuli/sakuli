import { SahiElementQueryOrWebElement } from "../sahi-element.interface";

/**
 * Implementation of the [SahiOS Assertion API](https://sahipro.com/docs/sahi-apis/assertions.html)
 *
 * Uses NodeJs' [assert module](https://nodejs.org/docs/latest-v10.x/api/assert.html)
 *
 * All methods are available as global functions in Sakuli tests
 *
 */
export interface AssertionApi {
  /**
   * Throws an [`AssertionError`](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_class_assert_assertionerror)
   * when `condition` resolves to `false`
   *
   * @param condition
   * @param message - If the exception from this assertion is not handled, Sakuli will print and log this message.
   */
  _assert(condition: Promise<boolean>, message?: string): Promise<void>;

  /**
   * Alias for {@link AssertionApi._assert}
   *
   * @param condition
   * @param message - If the exception from this assertion is not handled, Sakuli will print and log this message.
   */
  _assertTrue(condition: Promise<boolean>, message?: string): Promise<void>;

  /**
   * Opposite of {@link AssertionApi._assertTrue}.
   *
   * It throws an [`AssertionError`](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_class_assert_assertionerror)
   * when `condition` resolves to `true`
   *
   * @param condition
   * @param message
   */
  _assertFalse(condition: Promise<boolean>, message?: string): Promise<void>;

  /**
   * Alias for {@link AssertionApi._assertFalse}
   *
   * @param condition
   * @param message - If the exception from this assertion is not handled, Sakuli will print and log this message.
   */
  _assertNotTrue(condition: Promise<boolean>, message?: string): Promise<void>;

  /**
   * Throws an [`AssertionError`](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_class_assert_assertionerror)
   * when `element` doesn't contains `text`.
   *
   * Uses {@link FetchApi._containsText}
   *
   * @param expected
   * @param element
   * @param message
   */
  _assertContainsText(
    expected: string,
    element: SahiElementQueryOrWebElement,
    message?: string
  ): Promise<void>;

  /**
   * Throws an [`AssertionError`](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_class_assert_assertionerror)
   * when `element` contains `text`.
   *
   * Uses {@link FetchApi._containsText}
   *
   * @param expected
   * @param element
   * @param message
   */
  _assertNotContainsText(
    expected: string,
    element: SahiElementQueryOrWebElement,
    message?: string
  ): Promise<void>;

  /**
   * Throws an [`AssertionError`](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_class_assert_assertionerror)
   * when `expected` value doesn't [deep strictly equals](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_assert_deepstrictequal_actual_expected_message)
   * the `actual` value.
   *
   * @param expected
   * @param actual
   * @param message
   */
  _assertEqual(expected: any, actual: any, message?: string): Promise<void>;

  /**
   * Throws an [`AssertionError`](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_class_assert_assertionerror)
   * when `expected` value [deep strictly equals](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_assert_deepstrictequal_actual_expected_message)
   * the `actual` value.
   *
   * @param expected
   * @param actual
   * @param message
   */
  _assertNotEqual(expected: any, actual: any, message?: string): Promise<void>;

  /**
   * Basically the same as {@link AssertionApi._assertEqual} but only excepts arrays as `èxpected` and `actual` values.
   *
   * @param expected
   * @param actual
   * @param message
   */
  _assertEqualArrays(
    expected: Array<any>,
    actual: Array<any>,
    message?: string
  ): Promise<void>;

  /**
   * Throws an [`AssertionError`](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_class_assert_assertionerror)
   * when `element` doesn't exists in the current _dom_.
   *
   * Uses {@link FetchApi._exists}
   *
   * @param element
   * @param message
   */
  _assertExists(
    element: SahiElementQueryOrWebElement,
    message?: string
  ): Promise<void>;

  /**
   * Throws an [`AssertionError`](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_class_assert_assertionerror)
   * when `element` exists in the current _dom_.
   *
   * Uses {@link FetchApi._exists}
   *
   * @param element
   * @param message
   */
  _assertNotExists(
    element: SahiElementQueryOrWebElement,
    message?: string
  ): Promise<void>;

  /**
   * Throws an [`AssertionError`](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_class_assert_assertionerror)
   * when `value` is `null`.
   *
   * Note that this method uses [deep strict equality](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_assert_deepstrictequal_actual_expected_message)
   * so that an `undefined` value will also **pass** the assertion.
   *
   * @param value
   * @param message
   */
  _assertNotNull(value: any, message?: string): Promise<void>;

  /**
   * Throws an [`AssertionError`](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_class_assert_assertionerror)
   * when `value` is not `null`.
   *
   * Note that this method uses [deep strict equality](https://nodejs.org/docs/latest-v10.x/api/assert.html#assert_assert_deepstrictequal_actual_expected_message)
   * so that an `undefined` value will also **fail** the assertion.
   *
   * @param value
   * @param message
   */
  _assertNull(value: any, message?: string): Promise<void>;
}
