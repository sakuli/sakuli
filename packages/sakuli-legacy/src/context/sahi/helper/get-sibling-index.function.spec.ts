import {By} from "selenium-webdriver";
import {getSiblingIndex} from "./get-sibling-index.function";
import {createTestEnv, mockHtml, TestEnvironment} from "../__mocks__";

jest.setTimeout(10000);
describe('getSiblingIndex', () => {
    let env: TestEnvironment;

    beforeEach(async done => {
        env = createTestEnv();
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