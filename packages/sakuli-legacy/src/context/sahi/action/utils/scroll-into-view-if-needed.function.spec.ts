import {By, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {scrollIntoViewIfNeeded} from "./scroll-into-view-if-needed.function";
import {TestExecutionContext} from "@sakuli/core";
import {createTestExecutionContextMock} from "../../../__mocks__";
import {createTestEnv, getTestBrowserList, mockHtml, TestEnvironment} from "../../__mocks__";

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
});

describe('scrollIntoViewIfNeeded', () => {
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

        it('should scroll to element before resolving', async () => {
            // GIVEN
            jest.setTimeout(15_000);
            await driver.get(mockHtml(`
                <div id="long-scroll" style="height: 100000px;"></div>
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
            const hasScrolled = await scrollIntoViewIfNeeded(element, testExecutionContext);

            // THEN
            expect(hasScrolled).toBeTruthy();
        });

        it('should not have to scroll if not needed', async () => {
            // GIVEN
            await driver.get(mockHtml(`
                <div id="long-scroll" style="height: 100px;"></div>
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
            const hasScrolled = await scrollIntoViewIfNeeded(element, testExecutionContext);

            // THEN
            expect(hasScrolled).toBeFalsy();
        });
    });
});
