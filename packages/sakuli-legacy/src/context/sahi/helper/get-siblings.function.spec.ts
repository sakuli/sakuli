import {getSiblings} from "./get-siblings.function";
import {By} from "selenium-webdriver";
import {createTestEnv, mockHtml, TestEnvironment} from "../__mocks__";
import {getTestBrowserList} from "../__mocks__/get-browser-list.function";

jest.setTimeout(10000);
describe('getSiblings', () => {
    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
        let env: TestEnvironment;
        beforeAll(async done => {
            env = createTestEnv(browser, local);
            await env.start();
            done();
        });

        afterAll(async done => {
            await env.stop();
            done();
        });

        it('should get siblings of #anchor', async done => {
            const {driver} = await env.getEnv();
            await driver.get(mockHtml(`
            <ul>
              <li>Rhona Davidson</li>
              <li></li>
              <li id="anchor"></li>
              <li></li>
              <li></li>
              <li>$327,900</li>
            </ul>
        `));
            const siblings = await getSiblings(driver.findElement(By.css('#anchor')));
            expect(siblings.length).toBe(6);
            await expect(siblings[0].getText()).resolves.toEqual("Rhona Davidson");
            await expect(siblings[5].getText()).resolves.toEqual("$327,900");
            done();
        });
    });
});