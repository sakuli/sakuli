import { isElementCovered } from "./is-element-covered.function";
import { By } from "selenium-webdriver";
import { createTestEnv, getTestBrowserList, mockHtml, TestEnvironment } from "../../__mocks__";

jest.setTimeout(60_000);
describe('is-element-covered', () => {
    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
        let env: TestEnvironment;
        beforeEach(async () => {
            env = createTestEnv(browser, local);
            await env.start();
        });

        afterEach(async () => {
            await env.stop();
        });

        it("should return false when not covered", async () => {
            //GIVEN
            const {driver} = await env.getEnv();
            const html = mockHtml(`                                
            <div id="div-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
            <div id="div-1">In convallis vehicula ante eget consectetur.</div>
            `);
            await driver.get(html);

            //WHEN
            const div1 = await driver.findElement(By.id('div-0'));
            const result = await isElementCovered(div1, driver);

            //THEN
            expect(result).toBe(false);
        });

        it("should return true when covered", async () => {
            //GIVEN
            const {driver} = await env.getEnv();
            const html = mockHtml(`                                
            <style>
                .container {display: grid}
                .content, .overlay {grid-area: 1 / 1 }
            </style>
            <div class="container">
                <div id="div-0" class="content">Covered</div>
                <div id="div-1" class="overlay">Overlay - must be placed under content in the HTML</div>
            </div>
            `);
            await driver.get(html);

            //WHEN
            const div1 = await driver.findElement(By.id('div-0'));
            const result = await isElementCovered(div1, driver);

            //THEN
            expect(result).toBe(true);
        })
    });
});