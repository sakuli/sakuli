import {
  By,
  ThenableWebDriver,
  until,
  WebDriver,
  WebElement,
} from "selenium-webdriver";
import { scrollIntoViewIfNeeded } from "./scroll-into-view-if-needed.function";
import { TestExecutionContext } from "@sakuli/core";
import { createTestExecutionContextMock } from "../../../__mocks__";
import {
  createTestEnv,
  getTestBrowserList,
  mockHtml,
  TestEnvironment,
} from "../../__mocks__";
import { mockPartial } from "sneer";
import { wait } from "../../helper/wait.function";

function mockExecuteScript<T>(promise: Promise<T>) {
  const executeScriptFunction = jest.fn().mockResolvedValue(promise);
  return mockPartial<WebElement>({
    getDriver: () =>
      mockPartial<WebDriver>({
        executeAsyncScript: executeScriptFunction,
      }),
    getAttribute: (attributeName: string) =>
      Promise.resolve(`mockAttribute${attributeName}`),
    getId: () => Promise.resolve("mockElementId"),
    getTagName: () => Promise.resolve("mockTagName"),
    getText: () => Promise.resolve("mockElementText"),
  });
}

async function getAlertText(driver: WebDriver) {
  await driver.wait(until.alertIsPresent());
  const alert = await driver.switchTo().alert();
  const alertText = await alert.getText();
  await alert.dismiss();
  return alertText;
}

describe("scroll into view if needed", () => {
  let ctx: TestExecutionContext;

  beforeEach(() => {
    ctx = createTestExecutionContextMock();
  });

  it("should resolve to false if element is null", async () => {
    //GIVEN

    //WHEN
    const scrollIntoView = scrollIntoViewIfNeeded(
      (undefined as unknown) as WebElement,
      ctx
    );

    //THEN
    await expect(scrollIntoView).resolves.toBeFalsy();
  });

  it("should execute script on driver", async () => {
    //GIVEN
    const webElementMock = mockExecuteScript<boolean>(Promise.resolve(true));

    //WHEN
    const scrollIntoView = scrollIntoViewIfNeeded(webElementMock, ctx);

    //THEN
    await expect(scrollIntoView).resolves.toBeTruthy();
    expect(webElementMock.getDriver().executeAsyncScript).toBeCalledWith(
      expect.any(String),
      webElementMock
    );
  });

  it("should resolve if script execution rejects", async () => {
    //GIVEN
    const webElementMock = mockExecuteScript(Promise.reject());

    //WHEN
    const scrollIntoView = scrollIntoViewIfNeeded(webElementMock, ctx);

    //THEN
    await expect(scrollIntoView).resolves.toBeFalsy();
    expect(webElementMock.getDriver().executeAsyncScript).toBeCalledWith(
      expect.any(String),
      webElementMock
    );
  });
});

describe("scrollIntoViewIfNeeded", () => {
  describe.each(getTestBrowserList())(
    "%s",
    (browser: "firefox" | "chrome", local: boolean) => {
      let env: TestEnvironment;
      let driver: ThenableWebDriver;
      let testExecutionContext: TestExecutionContext;
      beforeAll(async () => {
        env = createTestEnv(browser, local);
        await env.start();
        driver = (await env.getEnv()).driver;
        testExecutionContext = createTestExecutionContextMock();
      });

      afterAll(async () => {
        await env.stop();
      });

      it("should scroll to element before resolving", async () => {
        // GIVEN
        jest.setTimeout(15_000);
        const expectedAlertText = "clicked!";
        await driver.get(
          mockHtml(
            `
                <div id="long-scroll" style="height: 10000000px;"></div>
                <button id="click-me" onclick="alert('clicked!')">Click me after scrolling!</button>
            `,
            {
              additionalHeadContent: `
                <style>
                    html {
                        scroll-behavior: smooth;
                        height: 100%;
                    }
                    body {
                        height: 100%;
                    }
                </style>
                `,
            }
          )
        );
        const element = await driver.findElement(By.id("click-me"));
        await wait(2000);

        // WHEN
        const hasScrolled = await scrollIntoViewIfNeeded(
          element,
          testExecutionContext
        );
        await element.click();
        const alertText = await getAlertText(driver);

        // THEN
        expect(hasScrolled).toBeTruthy();
        expect(alertText).toBe(expectedAlertText);
      });

      it("should not have to scroll if not needed", async () => {
        // GIVEN
        const expectedAlertText = "clicked!";
        await driver.get(
          mockHtml(
            `
                <div id="long-scroll" style="height: 100px;"></div>
                <button id="click-me" onclick="alert('clicked!')">Click me after scrolling!</button>
            `,
            {
              additionalHeadContent: `
                <style>
                    html {
                        scroll-behavior: smooth;
                        height: 100%;
                    }
                    body {
                        height: 100%;
                    }
                </style>
                `,
            }
          )
        );
        const element = await driver.findElement(By.id("click-me"));

        // WHEN
        const hasScrolled = await scrollIntoViewIfNeeded(
          element,
          testExecutionContext
        );
        await element.click();
        const alertText = await getAlertText(driver);

        // THEN
        expect(hasScrolled).toBeFalsy();
        expect(alertText).toBe(expectedAlertText);
      });
    }
  );
});
