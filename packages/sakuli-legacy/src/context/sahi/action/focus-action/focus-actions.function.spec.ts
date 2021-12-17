import { createTestEnv, getTestBrowserList, mockHtml, TestEnvironment, } from "../../__mocks__";
import { createTestExecutionContextMock } from "../../../__mocks__";
import { By, ThenableWebDriver } from "selenium-webdriver";
import { AccessorUtil } from "../../accessor";
import { RelationsResolver } from "../../relations";
import { focusActionApi } from "./focus-actions.function";

jest.setTimeout(100_000);
describe("focus-api", () => {
  describe.each(getTestBrowserList())(
    "%s",
    (browser: "firefox" | "chrome", local: boolean) => {
      let env: TestEnvironment;
      let driver: ThenableWebDriver;

      beforeAll(async () => {
        env = createTestEnv(browser, local);
        await env.start();
        driver = (await env.getEnv()).driver;
      });

      afterAll(async () => {
        await env.stop();
      });

      const testExecutionContextMock = createTestExecutionContextMock();

      function createApi(driver: ThenableWebDriver) {
        return focusActionApi(
          driver,
          new AccessorUtil(
            driver,
            testExecutionContextMock,
            new RelationsResolver(driver, testExecutionContextMock)
          ),
          testExecutionContextMock
        );
      }

      it("should set focus to element", async () => {
        const { _focus } = createApi(driver);
        await driver.get(
          mockHtml(`
            <input type="text" id="text-input" />
        `)
        );
        const inputLocator = By.css("#text-input");
        await _focus({
          locator: inputLocator,
          identifier: 0,
          relations: [],
        });
        const inputElement = await driver.findElement(inputLocator);
        const focusedElement = await driver.findElement(By.css(":focus"));

        expect(await inputElement.getId()).toBe(await focusedElement.getId());
      });

      it("should set blur an focused element", async () => {
        const { _blur } = createApi(driver);
        await driver.get(
          mockHtml(`
            <input type="text" id="text-input" autofocus />
            <script>document.getElementById('text').focus()</script>
        `)
        );
        const inputLocator = By.css("#text-input");
        const focusLocator = By.css(":focus");
        const inputId = await driver.findElement(inputLocator).getId();
        await expect(driver.findElement(focusLocator).getId()).resolves.toBe(
          inputId
        );
        await _blur({
          locator: inputLocator,
          identifier: 0,
          relations: [],
        });

        await expect(driver.findElement(focusLocator)).rejects;
      });
    }
  );
});
