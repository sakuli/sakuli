import {By} from "selenium-webdriver";
import {isChildOf} from "./is-child-of.function";
import {createTestEnv, TestEnvironment} from "../../__mocks__/create-test-env.function";

jest.setTimeout(10000);
describe('isChildOf', () => {
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



    it('should check that #del1 is child of table._in', async done => {
        const {url, driver} = await env.getEnv();
        await driver.get(`${url}/relations/relations-api.html`);
        const table = await driver.findElement(By.css('table._in'));
        const del1 = await driver.findElement(By.css('#del1'));
        await expect(isChildOf(del1, table)).resolves.toBeTruthy();
        done();
    });

    it('should check that #del2 is not a child of #del1', async done => {
        const {url, driver} = await env.getEnv();
        await driver.get(`${url}/relations/relations-api.html`);
        const del1 = await driver.findElement(By.css('#del1'));
        const del2 = await driver.findElement(By.css('#del2'));
        await expect(isChildOf(del2, del1)).resolves.toBeFalsy();
        done();
    });
});