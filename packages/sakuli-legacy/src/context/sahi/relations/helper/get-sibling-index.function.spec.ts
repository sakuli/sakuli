import {createTestEnv, TestEnvironment} from "../../__mocks__/create-test-env.function";
import {By} from "selenium-webdriver";
import {mockHtml} from "../../__mocks__/html/mock-html.function";
import {getSiblingIndex} from "./get-sibling-index.function";
import DoneCallback = jest.DoneCallback;

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

    it.each([0, 1, 2])('should resolve #li-%i at this index', async (i: number, done: DoneCallback) => {
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
        done();
    });


});