import {By, ThenableWebDriver} from "selenium-webdriver";
import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {AccessorUtil} from "./accessor-util.class";
import {RelationsResolver} from "../relations";


jest.setTimeout(15_000);
describe('AccessorUtil', () => {

    let env: TestEnvironment;
    beforeEach(async () => {
        env = createTestEnv();
        await env.start();
    });

    afterEach(async () => {
        await env.stop();
    });

    const testExecutionContext = createTestExecutionContextMock();

    function createApi(driver: ThenableWebDriver) {
        return new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext))
    }

    it('should fetch fuzzy matching identifiers from element', async () => {
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
        return expect(identifiers).toEqual([
            'aria', 'my-name-is-earl', 'element-to-test', 'so many names', 'Some Text content'
        ]);
    });

    it('should filter non displayed elements', async () => {
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
        return expect(Promise.all(divs.map(e => e.getAttribute('id')))).resolves.toEqual([
            'visibility-hidden',
            'display-none',
            'normal',
            'out-of-viewport',
            'no-content-not-displayed'
        ]);
    });

    it('should identify an element by string index', async () => {
        const {driver} = await env.getEnv();
        const api = createApi(driver);
        await driver.get(mockHtml(`
            <div id="div-1">D1</div>
            <div id="div-2">D1</div>
            <div id="div-3">D1</div>
        `));
        const div = await api.fetchElement({
            locator: By.css('div'),
            identifier: "D1[1]",
            relations: []
        });
        return expect(div.getAttribute('id')).resolves.toBe('div-2');
    });

});