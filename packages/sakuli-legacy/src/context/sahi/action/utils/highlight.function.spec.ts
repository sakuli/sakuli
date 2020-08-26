import { mockPartial } from "sneer";
import { IRectangle, WebDriver, WebElement } from "selenium-webdriver";
import {
  fallbackHighlightWithBorder,
  highlightElement,
} from "./highlight.function";

function mockExecuteScript<T>(promise: Promise<T>) {
  const executeScriptFunction = jest.fn().mockResolvedValue(promise);
  return mockPartial<WebElement>({
    getDriver: () =>
      mockPartial<WebDriver>({
        executeAsyncScript: executeScriptFunction,
      }),
    getRect(): Promise<IRectangle> {
      return Promise.resolve<IRectangle>({
        x: 100,
        y: 200,
        width: 300,
        height: 400,
      });
    },
  });
}

describe("highlight", () => {
  describe("highlightElement", () => {
    it("should execute the highlight script on an IRectangle", async () => {
      //GIVEN
      const webElementMock = mockExecuteScript<void>(Promise.resolve());
      const elementRect = await webElementMock.getRect();
      const timeout = 1500;

      //WHEN
      await highlightElement(webElementMock, timeout);

      //THEN
      expect(webElementMock.getDriver().executeAsyncScript).toBeCalledWith(
        expect.any(String),
        elementRect,
        timeout
      );
    });

    it("should fallback to highlight border script in case getRect return undefined", async () => {
      //GIVEN
      const webElementMock = mockExecuteScript<void>(Promise.resolve());
      webElementMock.getRect = jest.fn(() =>
        Promise.resolve((undefined as unknown) as IRectangle)
      );
      const timeout = 1500;

      //WHEN
      await highlightElement(webElementMock, timeout);

      //THEN
      expect(webElementMock.getDriver().executeAsyncScript).toBeCalledWith(
        expect.any(String),
        webElementMock,
        timeout
      );
    });
  });

  describe("showHighlightBorder", () => {
    it("should execute the highlight script on a WebElement", async () => {
      //GIVEN
      const webElementMock = mockExecuteScript<void>(Promise.resolve());
      const timeout = 1000;

      //WHEN
      await fallbackHighlightWithBorder(webElementMock, timeout);

      //THEN
      expect(webElementMock.getDriver().executeAsyncScript).toBeCalledWith(
        expect.any(String),
        webElementMock,
        timeout
      );
    });
  });
});
