import {getSiblings} from "./get-siblings.function";
import {By} from "selenium-webdriver";
import {createTestEnv, TestEnvironment} from "../../__mocks__/create-test-env.function";

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
        await driver.get(`${url}/relations/relations-api.html`);
        const siblings = await getSiblings(driver.findElement(By.css('#anchor')));
        expect(siblings.length).toBe(6);
        await expect(siblings[0].getText()).resolves.toEqual("Rhona Davidson");
        await expect(siblings[5].getText()).resolves.toEqual("$327,900");
        done();
    });
});