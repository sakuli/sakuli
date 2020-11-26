jest.mock("../sahi-element-utils");

import { TestExecutionContext } from "@sakuli/core";
import { createTestExecutionContextMock } from "../../__mocks__";
import { assertionApi } from "./assertion-api.function";
import { mockPartial } from "sneer";
import { FetchApi } from "../fetch";
import { By } from "selenium-webdriver";
import { SahiElementQuery } from "../sahi-element.interface";
import { AssertionError } from "assert";
import { stringifyElement } from "../sahi-element-utils";

describe("assertion-api", () => {
  let dummyQuery: SahiElementQuery = {
    locator: By.css(""),
    identifier: "",
    relations: [],
  };
  let api: ReturnType<typeof assertionApi>;
  let ctx: TestExecutionContext;
  let _containsTextMock = jest.fn();
  let _existsMock = jest.fn();
  let fetchApiMock = mockPartial<FetchApi>({
    _containsText: _containsTextMock,
    _exists: _existsMock,
  });

  beforeAll(async () => {
    ctx = createTestExecutionContextMock();
    api = assertionApi(ctx, fetchApiMock);
  });

  describe("_assert", () => {
    it("should do nothing, if given promise resolves to true", async () => {
      await expect(api._assert(Promise.resolve(true))).resolves.toBeUndefined();
    });

    it("should throw an exception, if given promise resolves to false", async () => {
      await expect(api._assert(Promise.resolve(false))).rejects.toThrow(
        AssertionError
      );
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";
      const failingPromise = Promise.resolve(false);

      //WHEN + THEN
      await expect(
        api._assert(failingPromise, expectedMessage)
      ).rejects.toThrow(new AssertionError({ message: expectedMessage }));
    });
  });

  describe("_assertTrue", () => {
    it("should do nothing, if given promise resolves to true", async () => {
      await expect(
        api._assertTrue(Promise.resolve(true))
      ).resolves.toBeUndefined();
    });

    it("should throw an exception, if given promise resolves to false", async () => {
      await expect(api._assertTrue(Promise.resolve(false))).rejects.toThrow(
        AssertionError
      );
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";
      const failingPromise = Promise.resolve(false);

      //WHEN + THEN
      await expect(
        api._assertTrue(failingPromise, expectedMessage)
      ).rejects.toThrow(new AssertionError({ message: expectedMessage }));
    });
  });

  describe("_assertFalse", () => {
    it("should do nothing, if given promise resolves to false", async () => {
      await expect(
        api._assertFalse(Promise.resolve(false))
      ).resolves.toBeUndefined();
    });

    it("should throw an exception, if given promise resolves to true", async () => {
      await expect(api._assertFalse(Promise.resolve(true))).rejects.toThrow(
        AssertionError
      );
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";
      const failingPromise = Promise.resolve(true);

      //WHEN + THEN
      await expect(
        api._assertFalse(failingPromise, expectedMessage)
      ).rejects.toThrow(new AssertionError({ message: expectedMessage }));
    });
  });

  describe("_assertNotFalse", () => {
    it("should do nothing, if given promise resolves to false", async () => {
      await expect(
        api._assertNotTrue(Promise.resolve(false))
      ).resolves.toBeUndefined();
    });

    it("should throw an exception, if given promise resolves to true", async () => {
      await expect(api._assertNotTrue(Promise.resolve(true))).rejects.toThrow(
        AssertionError
      );
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";
      const failingPromise = Promise.resolve(true);

      //WHEN + THEN
      await expect(
        api._assertNotTrue(failingPromise, expectedMessage)
      ).rejects.toThrow(new AssertionError({ message: expectedMessage }));
    });
  });

  describe("_assertContainsText", () => {
    it("should do nothing, if element contains text", async () => {
      _containsTextMock.mockResolvedValueOnce(true);
      await expect(
        api._assertContainsText("ABC", dummyQuery)
      ).resolves.toBeUndefined();
      expect(_containsTextMock).toHaveBeenCalledWith(dummyQuery, "ABC");
    });

    it("should throw an exception with default message, if element does not contains text", async () => {
      //GIVEN
      _containsTextMock.mockResolvedValue(false);
      const expectedText = "ABC";
      const expectedError = new AssertionError({
        message: `The following element does not contain the expected text "${expectedText}":\n\n<<stringified Element>>`,
      });

      //WHEN
      const assertContainsPromise = api._assertContainsText(
        expectedText,
        dummyQuery
      );

      //THEN
      await expect(assertContainsPromise).rejects.toThrow(expectedError);
      await expect(stringifyElement).toBeCalledWith(dummyQuery);
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";
      _containsTextMock.mockResolvedValue(false);

      //WHEN + THEN
      await expect(
        api._assertContainsText("ABC", dummyQuery, expectedMessage)
      ).rejects.toThrow(new AssertionError({ message: expectedMessage }));
    });
  });

  describe("_assertNotContainsText", () => {
    it("should do nothing, if element does not contains text", async () => {
      _containsTextMock.mockResolvedValueOnce(false);
      await expect(
        api._assertNotContainsText("ABC", dummyQuery)
      ).resolves.toBeUndefined();
      expect(_containsTextMock).toHaveBeenCalledWith(dummyQuery, "ABC");
    });

    it("should throw an exception with default message, if element contains text", async () => {
      //GIVEN
      _containsTextMock.mockResolvedValue(true);
      const expectedText = "ABC";
      const expectedError = new AssertionError({
        message: `The following element contains the prohibited text "${expectedText}":\n\n<<stringified Element>>`,
      });

      //WHEN
      const notContainsPromise = api._assertNotContainsText(
        expectedText,
        dummyQuery
      );

      //THEN
      await expect(notContainsPromise).rejects.toThrow(expectedError);
      await expect(stringifyElement).toBeCalledWith(dummyQuery);
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";
      _containsTextMock.mockResolvedValue(true);

      //WHEN + THEN
      await expect(
        api._assertNotContainsText("ABC", dummyQuery, expectedMessage)
      ).rejects.toThrow(new AssertionError({ message: expectedMessage }));
    });
  });

  describe("_assertEqual", () => {
    it("should do nothing, if actual and expected are deep strict equal", async () => {
      await expect(
        api._assertEqual({ a: 1 }, { a: 1 })
      ).resolves.toBeUndefined();
    });

    it("should throw an exception, if values are not deep strict equal", async () => {
      await expect(api._assertEqual({ a: 1 }, { a: "1" })).rejects.toThrow(
        AssertionError
      );
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";

      //WHEN + THEN
      await expect(
        api._assertEqual({ a: 1 }, { a: "1" }, expectedMessage)
      ).rejects.toThrow(new AssertionError({ message: expectedMessage }));
    });
  });

  describe("_assertNotEqual", () => {
    it("should do nothing, if actual and expected are not deep strict equal", async () => {
      await expect(
        api._assertNotEqual({ a: 1 }, { a: "1" })
      ).resolves.toBeUndefined();
    });

    it("should throw an exception, if values are deep strict equal", async () => {
      await expect(api._assertNotEqual({ a: 1 }, { a: 1 })).rejects.toThrow(
        AssertionError
      );
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";

      //WHEN + THEN
      await expect(
        api._assertNotEqual({ a: 1 }, { a: 1 }, expectedMessage)
      ).rejects.toThrow(new AssertionError({ message: expectedMessage }));
    });
  });

  describe("_assertEqualArray", () => {
    it("should do nothing, if actual and expected arrays are equal", async () => {
      await expect(
        api._assertEqualArrays([1, 2, 3], [1, 2, 3])
      ).resolves.toBeUndefined();
    });

    it("should throw an exception, if arrays are not deep strict equal", async () => {
      await expect(
        api._assertEqualArrays([1, 2, 3], [1, "2", 3])
      ).rejects.toThrow(AssertionError);
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";

      //WHEN + THEN
      await expect(
        api._assertEqualArrays([1, 2, 3], [1, "2", 3], expectedMessage)
      ).rejects.toThrow(new AssertionError({ message: expectedMessage }));
    });
  });

  describe("_assertExists", () => {
    it("should do nothing, if element exists", async () => {
      _existsMock.mockResolvedValue(true);
      await expect(api._assertExists(dummyQuery)).resolves.toBeUndefined();
    });

    it("should throw an exception with default message, if element does not exists", async () => {
      //GIVEN
      _existsMock.mockResolvedValue(false);
      const expectedError = new AssertionError({
        message: `The given element does not exist:\n\n<<stringified Element>>`,
      });

      //WHEN
      const assertExistPromise = api._assertExists(dummyQuery);

      // THEN
      await expect(assertExistPromise).rejects.toThrow(expectedError);
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";
      _existsMock.mockResolvedValue(false);

      //WHEN + THEN
      await expect(
        api._assertExists(dummyQuery, expectedMessage)
      ).rejects.toThrow(new AssertionError({ message: expectedMessage }));
      expect(_existsMock).toHaveBeenCalledWith(dummyQuery);
    });
  });

  describe("_assertNotExists", () => {
    it("should do nothing, if element does not exists", async () => {
      _existsMock.mockResolvedValue(false);
      await expect(api._assertNotExists(dummyQuery)).resolves.toBeUndefined();
    });

    it("should throw an exception, if element exists", async () => {
      //GIVEN
      _existsMock.mockResolvedValue(true);
      const expectedError = new AssertionError({
        message: `The given element exists:\n\n<<stringified Element>>`,
      });

      //WHEN
      const assertNotExistPromise = api._assertNotExists(dummyQuery);

      //THEN
      await expect(assertNotExistPromise).rejects.toThrow(expectedError);
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";
      _existsMock.mockResolvedValue(true);

      //WHEN + THEN
      await expect(
        api._assertNotExists(dummyQuery, expectedMessage)
      ).rejects.toThrow(new AssertionError({ message: expectedMessage }));
      expect(_existsMock).toHaveBeenCalledWith(dummyQuery);
    });
  });

  describe("_assertNull", () => {
    it("should do nothing, if actual value is null", async () => {
      await expect(api._assertNull(null)).resolves.toBeUndefined();
    });

    it("should throw an exception, if the actual value is not null", async () => {
      const expected = undefined;
      await expect(api._assertNull(expected)).rejects.toThrow(
        new AssertionError({
          message: `${JSON.stringify(expected)} does not equal null`,
        })
      );
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";

      //WHEN + THEN
      await expect(api._assertNull(undefined, expectedMessage)).rejects.toThrow(
        new AssertionError({ message: expectedMessage })
      );
    });
  });

  describe("_assertNotNull", () => {
    it("should do nothing, if actual value is not null", async () => {
      await expect(api._assertNotNull(undefined)).resolves.toBeUndefined();
    });

    it("should throw an exception with default message, if the actual value is null", async () => {
      await expect(api._assertNotNull(null)).rejects.toThrow(
        new AssertionError({ message: "Given value is null" })
      );
    });

    it("should use the exception message, if the assertion fails", async () => {
      //GIVEN
      const expectedMessage = "The end is near!";

      //WHEN + THEN
      await expect(api._assertNotNull(null, expectedMessage)).rejects.toThrow(
        new AssertionError({ message: expectedMessage })
      );
    });
  });
});
