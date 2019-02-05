import {By, ThenableWebDriver} from "selenium-webdriver";
import {createTestEnv, TestEnvironment} from "../__mocks__";
import {AccessorUtil} from "./accessor-util.class";
import {mockPartial} from "sneer";
import {TestExecutionContext} from "@sakuli/core";
import {RelationsResolver} from "../relations";

describe('AccessorUtil', () => {

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

    const testExecutionContext = mockPartial<TestExecutionContext>({});
    function createApi(driver: ThenableWebDriver) {
        return new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext))
    }

    it('should fetch fuzzy matching identifiers from element', async done => {
        const {driver, url} = await env.getEnv();
        await driver.get(`${url}/accessor/get-string-identifiers-for-element.html`);
        const api = createApi(driver);
        const element = await driver.findElement(By.id('element-to-test'));
        const identifiers = await api.getStringIdentifiersForElement(element);
        await expect(identifiers).toEqual([
            'aria', 'my-name-is-earl', 'element-to-test', 'so many names', 'Some Text content'
        ]);
        done();
    });


});