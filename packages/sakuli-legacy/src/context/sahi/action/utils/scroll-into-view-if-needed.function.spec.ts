import {By, ThenableWebDriver, WebDriver, WebElement} from "selenium-webdriver";
import {scrollIntoViewIfNeeded} from "./scroll-into-view-if-needed.function";
import {TestExecutionContext} from "@sakuli/core";
import {createTestExecutionContextMock} from "../../../__mocks__";
import {mockPartial} from "sneer";
import {createTestEnv, getTestBrowserList, mockHtml, TestEnvironment} from "../../__mocks__";

function mockExecuteScript(promise: Promise<void>) {
    const executeScriptFunction = jest.fn().mockResolvedValue(promise);
    return mockPartial<WebElement>({
        getDriver: () => mockPartial<WebDriver>({
            executeAsyncScript: executeScriptFunction
        })
    });
}

describe("scroll into view if needed", () => {

    let ctx: TestExecutionContext;

    beforeEach(() => {
        ctx = createTestExecutionContextMock();
    });

    it("should resolve if element is null", async () => {

        //GIVEN

        //WHEN
        const scrollIntoView = scrollIntoViewIfNeeded((undefined as unknown) as WebElement, ctx);

        //THEN
        await expect(scrollIntoView).resolves;
        expect(ctx.logger.debug).toBeCalledWith("scroll into view failed: element was null or undefined")
    });

    it("should execute script on driver", async () => {

        //GIVEN
        const webElementMock = mockExecuteScript(Promise.resolve());
        //WHEN
        const scrollIntoView = scrollIntoViewIfNeeded(webElementMock, ctx);

        //THEN
        await expect(scrollIntoView).resolves;
        expect(webElementMock.getDriver().executeAsyncScript).toBeCalledWith(expect.any(String), webElementMock);
        expect(ctx.logger.trace).toBeCalledWith(expect.stringContaining("scroll into view started with element:"));
        expect(ctx.logger.trace).toBeCalledWith(expect.stringContaining("scroll into view finished for element:"))
    });

    it("should resolve if script execution rejects", async () => {

        //GIVEN
        const webElementMock = mockExecuteScript(Promise.reject());

        //WHEN
        const scrollIntoView = scrollIntoViewIfNeeded(webElementMock, ctx);

        //THEN
        await expect(scrollIntoView).resolves;
        expect(webElementMock.getDriver().executeAsyncScript).toBeCalledWith(expect.any(String), webElementMock);
        expect(ctx.logger.trace).toBeCalledWith(expect.stringContaining("scroll into view finished for element:"))
    })
});

describe('ScrollIntoViewIfNeeded', () => {
    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
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

        it('', async () => {
            // GIVEN
            await driver.get(mockHtml(`
                <div id="long-scroll" style="height: 1000000px;"></div>
                <button id="click-me" onclick="alert('clicked!')">Click me after scrolling!</button>
            `, {
                additionalHeadContent: `
                <style>
                    html {
                        scroll-behavior: smooth;
                    }
                </style>
                `
            }));
            const element = await driver.findElement(By.id('click-me'));

            // WHEN
            const scrollIntoView = scrollIntoViewIfNeeded(element, testExecutionContext);

            // THEN
            await expect(scrollIntoView).resolves;
        });
    });
});
