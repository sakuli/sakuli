import { By, ThenableWebDriver } from "selenium-webdriver";
import { createTestEnv, mockHtml, TestEnvironment } from "../__mocks__";
import { createTestExecutionContextMock } from "../../__mocks__";
import { AccessorUtil } from "../accessor";
import { RelationsResolver } from "../relations";
import { FetchApi, fetchApi as createFetchApi } from "../fetch";
import { textSelectionApi, TextSelectionApi, } from "./text-selection-api.function";
import { SahiElementQueryOrWebElement } from "../sahi-element.interface";
import { getTestBrowserList } from "../__mocks__/get-browser-list.function";

jest.setTimeout(100_000);
describe("textSelectionApi", () => {
  describe.each(getTestBrowserList())(
    "%s",
    (browser: "firefox" | "chrome", local: boolean) => {
      let env: TestEnvironment;
      let driver: ThenableWebDriver;
      let fetchApi: FetchApi;
      let api: TextSelectionApi;

      beforeAll(async () => {
        env = createTestEnv(browser, local);
        await env.start();
        driver = (await env.getEnv()).driver;

        const ctx = createTestExecutionContextMock();
        const rr = new RelationsResolver(driver, ctx);
        const au = new AccessorUtil(driver, ctx, rr);
        fetchApi = createFetchApi(driver, au, ctx);
        api = textSelectionApi(driver, au, ctx);
      });

      afterAll(async () => {
        await env.stop();
      });

      test("_selectRange", async () => {
        const { _selectRange } = api;
        await driver.get(
          mockHtml(`
            <div>Lorem ipsum dolor sit amet</div>
        `)
        );
        const q: SahiElementQueryOrWebElement = {
          locator: By.css("div"),
          identifier: 0,
          relations: [],
        };
        await _selectRange(q, 6, 6 + 5);
        return expect(fetchApi._getSelectionText()).resolves.toBe("ipsum");
      });

      test("_selectTextRange", async () => {
        const { _selectTextRange } = api;
        await driver.get(
          mockHtml(`
            <div>Lorem ipsum dolor sit amet</div>
        `)
        );
        const q: SahiElementQueryOrWebElement = {
          locator: By.css("div"),
          identifier: 0,
          relations: [],
        };
        await _selectTextRange(q, "ipsum");
        return expect(fetchApi._getSelectionText()).resolves.toBe("ipsum");
      });
    }
  );
});
