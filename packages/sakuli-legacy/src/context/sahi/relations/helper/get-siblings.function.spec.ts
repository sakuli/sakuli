import {getSiblings} from "./get-siblings.function";
import {By} from "selenium-webdriver";
import {createTestEnv, mockHtml, TestEnvironment} from "../../__mocks__";

jest.setTimeout(10000);
describe('getSiblings', () => {

    let env: TestEnvironment;
    beforeEach(async done => {
        env = createTestEnv();
        await env.start();
        done();
    });

    afterEach(async done => {
        await env.stop();
        done();
    });

    it('should get siblings of #anchor', async done => {
        const {url, driver} = await env.getEnv();
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