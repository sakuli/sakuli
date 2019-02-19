import {By, ThenableWebDriver} from "selenium-webdriver";
import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {AccessorUtil} from "./accessor-util.class";
import {mockPartial} from "sneer";
import {TestExecutionContext} from "@sakuli/core";
import {RelationsResolver} from "../relations";


jest.setTimeout(15_000);
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

    const testExecutionContext = createTestExecutionContextMock();
    function createApi(driver: ThenableWebDriver) {
        return new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext))
    }

    it('should fetch fuzzy matching identifiers from element', async done => {
        const {driver} = await env.getEnv();
        await driver.get(mockHtml(`
         <div
            id="element-to-test"
            aria-describedby="aria"
            class="so many names"
            name="my-name-is-earl"
          >Some Text content</div>
        `));
        const api = createApi(driver);
        const element = await driver.findElement(By.id('element-to-test'));
        const identifiers = await api.getStringIdentifiersForElement(element);
        await expect(identifiers).toEqual([
            'aria', 'my-name-is-earl', 'element-to-test', 'so many names', 'Some Text content'
        ]);
        done();
    });

    it('should filter non displayed elements', async done => {
        const {driver} = await env.getEnv();
        await driver.get(mockHtml(`
          <div id="visibility-hidden" style="visibility: hidden">ABC</div>
          <div id="display-none" style="display: none;">ABC</div>
          <div id="normal">ABC</div>
          <div id="out-of-viewport" style="position: absolute; top: 1000px; right: 10px">ABC</div>
          <div id="no-content-not-displayed"></div>
        `));
        const api = createApi(driver);
        const divs = await api.findElements(By.css('div'));
        //expect(divs.length).toBe(2);
        await expect(Promise.all(divs.map(e => e.getAttribute('id')))).resolves.toEqual([
            'visibility-hidden',
            'display-none',
            'normal',
            'out-of-viewport',
            'no-content-not-displayed'
        ]);
        done();
    });

    it('should invoke a default relation', async done => {
        const {driver} = await env.getEnv();
        await driver.get(mockHtml(`
            <div>Test</div>
        `));
        const api = createApi(driver);
        const relationMock = jest.fn(x => x);
        api.addDefaultRelation(relationMock);
        await api.fetchElement({
            locator: By.css('div'),
            identifier: 'Test',
            relations: []
        });
        expect(relationMock).toHaveBeenCalledTimes(1);
        done();
    });

    it('should remove a default relation', async done => {
        const {driver} = await env.getEnv();
        await driver.get(mockHtml(`
            <div>Test</div>
        `));
        const api = createApi(driver);
        const relationMock = jest.fn(x => x);
        api.addDefaultRelation(relationMock);
        api.removeLastRelation();
        await api.fetchElement({
            locator: By.css('div'),
            identifier: 'Test',
            relations: []
        });
        expect(relationMock).toHaveBeenCalledTimes(0);
        done();
    });

});