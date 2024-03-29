import { createTestEnv, getTestBrowserList, mockHtml, TestEnvironment, } from "../../__mocks__";
import { createTestExecutionContextMock } from "../../../__mocks__";
import { By, Locator, ThenableWebDriver } from "selenium-webdriver";
import { CommonActionsApi } from "./common-actions.interface";
import { commonActionsApi } from "./common-actions.function";
import { AccessorUtil } from "../../accessor";
import { RelationsResolver } from "../../relations";
import { SahiElementQueryOrWebElement } from "../../sahi-element.interface";
import * as highlightElementModule from "../utils/highlight.function";
import * as scrollIntoViewIfNeededModule from "../utils/scroll-into-view-if-needed.function";
import { TestExecutionContext } from "@sakuli/core";

jest.setTimeout(100_000);

describe("common-actions", () => {
  describe.each(getTestBrowserList())(
    "%s",
    (browser: "firefox" | "chrome", local: boolean) => {
      let env: TestEnvironment;
      let driver: ThenableWebDriver;
      let api: CommonActionsApi;
      let ctx: TestExecutionContext;
      beforeAll(async () => {
        env = createTestEnv(browser, local);
        await env.start();
        driver = (await env.getEnv()).driver;
        ctx = createTestExecutionContextMock();
        api = commonActionsApi(
          driver,
          new AccessorUtil(driver, ctx, new RelationsResolver(driver, ctx)),
          ctx
        );
      });

      beforeEach(() => {
        jest.resetAllMocks();
      });

      afterAll(async () => {
        await env.stop();
      });

      function queryByLocator(locator: Locator): SahiElementQueryOrWebElement {
        return { locator, relations: [], identifier: 0 };
      }

      it("should not throw when highlighting", async () => {
        await driver.get(
          mockHtml(`
                <ul>
                    <li>First</li>
                    <li id="second">Second</li>
                    <li>Last</li>
                </ul>
            `)
        );
        await api._highlight(queryByLocator(By.css("#second")));
      });

      it("should highlight via highlightElement", async () => {
        // GIVEN
        const highlightSpy = jest.spyOn(
          highlightElementModule,
          "highlightElement"
        );
        await driver.get(
          mockHtml(`
                        <ul>
                            <li>First</li>
                            <li id="second">Second</li>
                            <li>Last</li>
                        </ul>
                    `)
        );
        const targetSelector = By.css("#second");
        const targetElement = await driver.findElement(targetSelector);
        const highlightTimeout = 500;

        // WHEN
        await api._highlight(queryByLocator(targetSelector), highlightTimeout);

        // THEN
        expect(highlightSpy).toBeCalledTimes(1);
        expect(highlightSpy).toBeCalledWith(targetElement, highlightTimeout);
      });

      it("should call scrollIntoViewIfNeeded when highlighting", async () => {
        // GIVEN
        const scrollIntoViewSpy = jest.spyOn(
          scrollIntoViewIfNeededModule,
          "scrollIntoViewIfNeeded"
        );
        await driver.get(
          mockHtml(`
                <ul>
                    <li>First</li>
                    <li id="second">Second</li>
                    <li>Last</li>
                </ul>
            `)
        );
        const targetSelector = By.css("#second");
        const targetElement = await driver.findElement(targetSelector);

        // WHEN
        await api._highlight(queryByLocator(targetSelector));

        // THEN
        expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1);
        expect(scrollIntoViewSpy).toBeCalledWith(targetElement, ctx);
      });

      it("should invoke script on the page", async () => {
        await driver.get(
          mockHtml(`
                <ul>
                    <li>First</li>
                    <li id="second">Second</li>
                    <li>Last</li>
                </ul>
            `)
        );
        await api._eval(
          `document.getElementById('second').innerHTML = 'changed'`
        );
        const second = await driver.findElement(By.css("#second"));
        await expect(second.getText()).resolves.toEqual("changed");
      });

      it("should invoke script on the page with parameter", async () => {
        await driver.get(
          mockHtml(`
                <ul>
                    <li>First</li>
                    <li id="second">Second</li>
                    <li>Last</li>
                </ul>
            `)
        );
        await api._eval(
          `
                arguments[0].innerHTML = arguments[1];
            `,
          queryByLocator(By.css("#second")),
          "changed"
        );
        const second = await driver.findElement(By.css("#second"));
        await expect(second.getText()).resolves.toEqual("changed");
      });

      it("should return value from script", async () => {
        await driver.get(
          mockHtml(`
                <ul>
                    <li>First</li>
                    <li id="second">Second</li>
                    <li>Last</li>
                </ul>
            `)
        );
        const result = await api._eval(
          `
                return arguments[0].innerHTML;
            `,
          queryByLocator(By.css("#second"))
        );

        await expect(result).toEqual("Second");
      });

      describe("_pageIsStable", () => {
        it("should return true for stabilized DOM within default timeout", async () => {
          // GIVEN
          await driver.get(
            mockHtml(`
                <div id="root">
                </div>
                <script>
                const elem = document.getElementById("root");
                const interval = setInterval(() => {
                    elem.innerHTML = Date.now();
                }, 5);
                setTimeout(() => clearInterval(interval), 1000);
                </script>
            `)
          );

          // WHEN
          const start = Date.now();
          const result = await api._pageIsStable();
          const duration = Date.now() - start;

          // THEN
          expect(result).toBeTruthy();
          expect(duration).toBeLessThan(2_000);
        });

        it("should return false for unstable DOM", async () => {
          // GIVEN
          await driver.get(
            mockHtml(`
                <div id="root">
                </div>
                <script>
                const elem = document.getElementById("root");
                const interval = setInterval(() => {
                    elem.innerHTML = Date.now();
                }, 5);
                setTimeout(() => clearInterval(interval), 3000);
                </script>
            `)
          );

          // WHEN
          const start = Date.now();
          const result = await api._pageIsStable();
          const duration = Date.now() - start;

          // THEN
          expect(result).toBeFalsy();
          expect(duration).toBeGreaterThanOrEqual(1_999);
        });
      });

      describe("_wait", () => {
        it("should return action return value on success", async () => {
          //GIVEN
          const expressionResult = "Who or what is Tom Bombadil?";
          const expression = async () => expressionResult;

          //WHEN
          const result = await api._wait(2000, expression);

          //THEN
          expect(result).toBe(expressionResult);
        });

        it("should return void if no action was provided", async () => {
          //WHEN
          const result = await api._wait(2000);

          //THEN
          expect(result).toBeUndefined();
        });
      });
    }
  );
});
