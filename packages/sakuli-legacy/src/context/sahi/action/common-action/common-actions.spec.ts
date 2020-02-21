import { getTestBrowserList } from "../../__mocks__";
import { createTestEnv, mockHtml, TestEnvironment } from "../../__mocks__";
import { createTestExecutionContextMock } from "../../../__mocks__";
import { By, Locator, ThenableWebDriver } from "selenium-webdriver";
import { CommonActionsApi } from "./common-actions.interface";
import { commonActionsApi } from "./common-actions.function";
import { AccessorUtil } from "../../accessor";
import { RelationsResolver } from "../../relations";
import { SahiElementQueryOrWebElement } from "../../sahi-element.interface";
import * as scrollIntoViewModule from "../utils/scroll-into-view-if-needed.function";

jest.setTimeout(15_000);
describe('common-actions', () => {
    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
        let env: TestEnvironment;
        let driver: ThenableWebDriver;
        let api: CommonActionsApi;
        beforeAll(async () => {
            env = createTestEnv(browser, local);
            await env.start();
            driver = (await env.getEnv()).driver;
            const ctx = createTestExecutionContextMock();
            api = commonActionsApi(
                driver,
                new AccessorUtil(
                    driver,
                    ctx,
                    new RelationsResolver(
                        driver,
                        ctx
                    )
                ),
                ctx
            )
        });

        afterAll(async () => {
            await env.stop();
        });

        function queryByLocator(locator: Locator): SahiElementQueryOrWebElement {
            return ({ locator, relations: [], identifier: 0 })
        }

        it('should not throw when highlighting', async () => {
            await driver.get(mockHtml(`
                <ul>
                    <li>First</li>
                    <li id="second">Second</li>
                    <li>Last</li>
                </ul>
            `));
            await api._highlight(queryByLocator(By.css('#second')))
        });

        it('should call scrollIntoViewIfNeeded when highlighting', async () => {
            jest.spyOn(scrollIntoViewModule, 'scrollIntoViewIfNeeded');
            await driver.get(mockHtml(`
                <ul>
                    <li>First</li>
                    <li id="second">Second</li>
                    <li>Last</li>
                </ul>
            `));
            await api._highlight(queryByLocator(By.css('#second')));
            expect(scrollIntoViewModule.scrollIntoViewIfNeeded).toHaveBeenCalled();
        });

        it('should invoke script on the page', async () => {
            await driver.get(mockHtml(`
                <ul>
                    <li>First</li>
                    <li id="second">Second</li>
                    <li>Last</li>
                </ul>
            `));
            await api._eval(`document.getElementById('second').innerHTML = 'changed'`);
            const second = await driver.findElement(By.css('#second'));
            await expect(second.getText()).resolves.toEqual('changed');
        });

        it('should invoke script on the page with parameter', async () => {
            await driver.get(mockHtml(`
                <ul>
                    <li>First</li>
                    <li id="second">Second</li>
                    <li>Last</li>
                </ul>
            `));
            await api._eval(`
                arguments[0].innerHTML = arguments[1];
            `,
                queryByLocator(By.css('#second')),
                'changed'
            );
            const second = await driver.findElement(By.css('#second'));
            await expect(second.getText()).resolves.toEqual('changed');
        });

        it('should return value from script', async () => {
            await driver.get(mockHtml(`
                <ul>
                    <li>First</li>
                    <li id="second">Second</li>
                    <li>Last</li>
                </ul>
            `));
            const result = await api._eval(`
                return arguments[0].innerHTML;
            `,
                queryByLocator(By.css('#second')),
            );

            await expect(result).toEqual('Second');
        });

        it('should return true for stabilized DOM within default timeout', async () => {
            // GIVEN
            await driver.get(mockHtml(`
                <div id="root">
                </div>
                <script>
                const elem = document.getElementById("root");
                const interval = setInterval(() => {
                    elem.innerHTML = Date.now();
                }, 5);
                setTimeout(() => clearInterval(interval), 1000);
                </script>
            `));

            // WHEN
            const start = Date.now();
            const result = await api._pageIsStable();
            const duration = Date.now() - start;

            // THEN
            expect(result).toBeTruthy();
            expect(duration).toBeLessThan(2_000);
        });
        it('should return false for unstable DOM', async () => {
            // GIVEN
            await driver.get(mockHtml(`
                <div id="root">
                </div>
                <script>
                const elem = document.getElementById("root");
                const interval = setInterval(() => {
                    elem.innerHTML = Date.now();
                }, 5);
                setTimeout(() => clearInterval(interval), 3000);
                </script>
            `));

            // WHEN
            const start = Date.now();
            const result = await api._pageIsStable();
            const duration = Date.now() - start;

            // THEN
            expect(result).toBeFalsy();
            expect(duration).toBeGreaterThanOrEqual(2_000);
        });
    })
});
