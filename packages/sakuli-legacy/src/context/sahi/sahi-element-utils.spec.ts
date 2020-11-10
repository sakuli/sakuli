import { SahiElementQuery } from "./sahi-element.interface";
import { By, WebElement } from "selenium-webdriver";
import {
  identifierToString,
  isSahiElementQuery,
  sahiQueryToString,
  stringifyElement,
} from "./sahi-element-utils";
import { mockPartial } from "sneer";
import { AccessorIdentifierAttributes } from "./accessor";
import { stripIndents } from "common-tags";

describe("Sahi element utils", () => {
  describe("isSahiElementQuery", () => {
    it("should identify sahi element query", () => {
      //GIVEN
      const sahiElementQuery: SahiElementQuery = {
        locator: By.css,
        identifier: "foo",
        relations: [],
      };

      //WHEN + THEN
      expect(isSahiElementQuery(sahiElementQuery)).toBeTruthy();
    });

    it("should identify object is not a  sahi element query", () => {
      //GIVEN
      const anyElement = {
        foo: "bar",
      };

      //WHEN + THEN
      expect(isSahiElementQuery(anyElement)).toBeFalsy();
    });
  });

  describe("identifierToString", () => {
    it("should represent string as string", () => {
      //GIVEN
      const identifier = "myIdentifier";

      //WHEN
      const stringRepresentation = identifierToString(identifier);

      //THEN
      expect(stringRepresentation).toBe(identifier);
    });

    it("should represent number as string", () => {
      //GIVEN
      const identifier = 42;
      const expectedIdentifierString = identifier + "";

      //WHEN
      const stringRepresentation = identifierToString(identifier);

      //THEN
      expect(stringRepresentation).toBe(expectedIdentifierString);
    });

    it("should represent regex as string", () => {
      //GIVEN
      const identifier = /.*[0-9a-zA-Z]+.*/;
      const expectedIdentifierString = identifier + "";

      //WHEN
      const stringRepresentation = identifierToString(identifier);

      //THEN
      expect(stringRepresentation).toBe(expectedIdentifierString);
    });

    it("should represent AccessorIdentifierAttributes as string", () => {
      //GIVEN
      const identifier = mockPartial<AccessorIdentifierAttributes>({
        className: "foobar",
      });
      const expectedIdentifierString = '{"className":"foobar"}';

      //WHEN
      const stringRepresentation = identifierToString(identifier);

      //THEN
      expect(stringRepresentation).toBe(expectedIdentifierString);
    });
  });

  describe("sahiQueryToString", () => {
    it("should print sahi query", () => {
      //GIVEN
      const elementQuery: SahiElementQuery = {
        locator: By.id("data-test-id"),
        identifier: "42",
        relations: [
          (_) => {
            return Promise.resolve({
              locator: By.id("containing-div"),
              identifier: "42",
              relations: [],
            });
          },
        ],
      };

      const expectedElementQuery = stripIndents`locator: By(css selector, *[id="data-test-id"])
                             identifier: 42
                             relations:`; //Relations are not rendered as of today => https://github.com/sakuli/sakuli/issues/518

      //WHEN
      const stringifiedQuery = sahiQueryToString(elementQuery);

      //THEN
      expect(stringifiedQuery).toBe(expectedElementQuery);
    });
  });

  describe("stringifyElement", () => {
    it("should identify and render sahiQuery element", async () => {
      //GIVEN
      const elementQuery: SahiElementQuery = {
        locator: By.id("data-test-id"),
        identifier: "42",
        relations: [],
      };

      const expectedElementQueryString = stripIndents`locator: By(css selector, *[id="data-test-id"])
                             identifier: 42
                             relations:`;

      //WHEN
      const stringifiedElement = await stringifyElement(elementQuery);

      //THEN
      expect(stringifiedElement).toBe(expectedElementQueryString);
    });

    it("should identify and render WebElement", async () => {
      //GIVEN
      const expectedWebElementString = "WebElement content";
      const expectedTagName = "WebElement content";
      const expectedLocation = { height: 50, width: 2560, x: 0, y: 26.796875 };
      const webElement: WebElement = mockPartial<WebElement>({
        getText: jest.fn(() => {
          return Promise.resolve(expectedWebElementString);
        }),
        getTagName: jest.fn(() => {
          return Promise.resolve(expectedTagName);
        }),
        getRect: jest.fn(() => {
          return Promise.resolve(expectedLocation);
        }),
      });

      const expectedElementQueryString = stripIndents`tag: ${expectedTagName}
                             text: ${expectedWebElementString}
                             rect: ${JSON.stringify(expectedLocation)}`;

      //WHEN
      const stringifiedElement = await stringifyElement(webElement);

      //THEN
      expect(stringifiedElement).toBe(expectedElementQueryString);
    });
  });

  describe("webElementToString", () => {
    it("should skip getTagName if it does not exist on web element", async () => {
      //GIVEN
      const expectedWebElementString = "WebElement content";
      const expectedLocation = { height: 50, width: 2560, x: 0, y: 26.796875 };

      const webElement: WebElement = mockPartial<WebElement>({
        getText: jest.fn(() => {
          return Promise.resolve(expectedWebElementString);
        }),
        getRect: jest.fn(() => {
          return Promise.resolve(expectedLocation);
        }),
      });

      const expectedElementQueryString = stripIndents`tag: 
                             text: ${expectedWebElementString}
                             rect: ${JSON.stringify(expectedLocation)}`;

      //WHEN
      const stringifiedElement = await stringifyElement(webElement);

      //THEN
      expect(stringifiedElement).toBe(expectedElementQueryString);
    });

    it("should skip getText if it does not exist on web element", async () => {
      //GIVEN
      const expectedTagName = "WebElement tag";
      const expectedLocation = { height: 50, width: 2560, x: 0, y: 26.796875 };

      const webElement: WebElement = mockPartial<WebElement>({
        getTagName: jest.fn(() => {
          return Promise.resolve(expectedTagName);
        }),
        getRect: jest.fn(() => {
          return Promise.resolve(expectedLocation);
        }),
      });

      const expectedElementQueryString = stripIndents`tag: ${expectedTagName}
                             text: 
                             rect: ${JSON.stringify(expectedLocation)}`;

      //WHEN
      const stringifiedElement = await stringifyElement(webElement);

      //THEN
      expect(stringifiedElement).toBe(expectedElementQueryString);
    });

    it("should skip getRect if it does not exist on web element", async () => {
      //GIVEN
      const expectedWebElementString = "WebElement content";
      const expectedTagName = "WebElement tag";

      const webElement: WebElement = mockPartial<WebElement>({
        getTagName: jest.fn(() => {
          return Promise.resolve(expectedTagName);
        }),
        getText: jest.fn(() => {
          return Promise.resolve(expectedWebElementString);
        }),
      });

      const expectedElementQueryString = stripIndents`tag: ${expectedTagName}
                             text: ${expectedWebElementString}
                             rect: `;

      //WHEN
      const stringifiedElement = await stringifyElement(webElement);

      //THEN
      expect(stringifiedElement).toBe(expectedElementQueryString);
    });
  });
});
