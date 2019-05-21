import {By} from "selenium-webdriver";
import {getSiblingIndex} from "./get-sibling-index.function";
import {createTestEnv, mockHtml, TestEnvironment} from "../__mocks__";
import {getTestBrowserList} from "../action/__mocks__/get-browser-list.function";

jest.setTimeout(10000);
describe('getSiblingIndex', () => {
    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
        let env: TestEnvironment;

        beforeEach(async done => {
            env = createTestEnv(browser, local);
            await env.start();
            done();
        });

        afterEach(async (done) => {
            await env.stop();
            done();
        });

        it.each(<number[]>[0, 1, 2])('should resolve #li-%i at this index', async (i: number) => {
            const {driver} = await env.getEnv();
            await driver.get(mockHtml(`
            <ul>
              <li id="li-0"></li>
              <li id="li-1"></li>
              <li id="li-2"></li>
            </ul>
        `));
            const li = await driver.findElement(By.css(`#li-${i}`));
            await expect(getSiblingIndex(li)).resolves.toBe(i);
        });

    });
});