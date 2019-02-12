import {createTestEnv, TestEnvironment} from "../../__mocks__/create-test-env.function";
import {By} from "selenium-webdriver";
import {ifPresent} from "@sakuli/commons";
import {getParent} from "./get-parent.function";
import {isEqual} from "./is-equal.function";

jest.setTimeout(10000);
describe('getParent', () => {
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

    it('should resolve to a parent', async done => {
        const {driver, url} = await env.getEnv();
        await driver.get(`${url}/relations/relations-resolver.html`);
        const li = await driver.findElement(By.css('li'));
        const ul = await driver.findElement(By.css('ul'));
        await ifPresent(await getParent(li), async parent => {
            await expect(isEqual(ul, parent)).resolves.toBeTruthy();
        }, () => done.fail());

        done();
    });

    it('should return null if element has no parent', async done => {
        const {driver, url} = await env.getEnv();
        await driver.get(url);
        await expect(
            getParent(driver.findElement(By.css('html')))
        ).resolves.toBeNull();
        done();
    });

});