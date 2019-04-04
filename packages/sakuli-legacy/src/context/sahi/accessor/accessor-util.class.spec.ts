import {By, ThenableWebDriver} from "selenium-webdriver";
import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {AccessorUtil} from "./accessor-util.class";
import {RelationsResolver} from "../relations";
import {TestExecutionContext} from "@sakuli/core";


jest.setTimeout(15_000);
describe('AccessorUtil', () => {

    let env: TestEnvironment;
    let accessorUtil: AccessorUtil;
    let driver: ThenableWebDriver;
    let testExecutionContext: TestExecutionContext;
    beforeAll(async () => {
        env = createTestEnv();
        await env.start();
        driver = (await env.getEnv()).driver;
        testExecutionContext = createTestExecutionContextMock();
        accessorUtil = new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext))
    });

    afterAll(async () => {
        await env.stop();
    });


    function createApi(driver: ThenableWebDriver) {
        return new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext))
    }

    it('should fetch fuzzy matching identifiers from element', async () => {
        await driver.get(mockHtml(`
         <div
            id="element-to-test"
            aria-describedby="aria"
            class="so many names"
            name="my-name-is-earl"
            value="some-value"
            src="some-image.png"
          >Some Text content</div>
        `));
        const element = await driver.findElement(By.id('element-to-test'));
        const identifiers = await accessorUtil.getStringIdentifiersForElement(element);
        return expect(identifiers).toEqual([
            'aria', 'my-name-is-earl', 'element-to-test', 'so many names', 'Some Text content', 'some-value', 'some-image.png'
        ]);
    });

    it('should filter non displayed elements', async () => {
        await driver.get(mockHtml(`
          <div id="visibility-hidden" style="visibility: hidden">ABC</div>
          <div id="display-none" style="display: none;">ABC</div>
          <div id="normal">ABC</div>
          <div id="out-of-viewport" style="position: absolute; top: 1000px; right: 10px">ABC</div>
          <div id="no-content-not-displayed"></div>
        `));
        const divs = await accessorUtil.findElements(By.css('div'));
        return expect(Promise.all(divs.map(e => e.getAttribute('id')))).resolves.toEqual([
            'visibility-hidden',
            'display-none',
            'normal',
            'out-of-viewport',
            'no-content-not-displayed'
        ]);
    });

    it('should identify an element by string index', async () => {
        await driver.get(mockHtml(`
            <div id="div-1">D1</div>
            <div id="div-2">D1</div>
            <div id="div-3">D1</div>
        `));
        const div = await accessorUtil.fetchElement({
            locator: By.css('div'),
            identifier: "D1[1]",
            relations: []
        });
        return expect(div.getAttribute('id')).resolves.toBe('div-2');
    });

    it('should reduce elements list by sahi class', async () => {
        await driver.get(mockHtml(`
            <div></div>
            <div class="test-class"></div>
            <div class="cls-1 test-class cls-2"></div>
        `));
        const allDivs = await driver.findElements(By.css('div'));
        const divWithTestClass = await accessorUtil.getElementBySahiClassName(allDivs, {className: 'test-class'});
        return expect(divWithTestClass.length).toBe(2);
    });

    it('should find by classname', async () => {
        await driver.get(mockHtml(`
            <div>D1</div>
            <div class="test-class">D2</div>
            <div class="cls-1 test-class cls-2">D3</div>
        `));
        const divWithTestClass = await accessorUtil.fetchElement({
            locator: By.css('div'),
            identifier: {className: 'test-class'},
            relations: []
        });
        return expect(divWithTestClass.getText()).resolves.toBe("D2");
    });

    it('should find by classname and sahiText', async () => {
        await driver.get(mockHtml(`
            <div>D1</div>
            <div class="test-class">D2</div>
            <div class="cls-1 test-class cls-2">D3</div>
        `));
        const divWithTestClass = await accessorUtil.fetchElement({
            locator: By.css('div'),
            identifier: {className: 'test-class', sahiText: 'D3'},
            relations: []
        });
        return expect(divWithTestClass.getText()).resolves.toBe("D3");
    });

    it('should find by text with reserved regexp characters', async () => {
        await driver.get(mockHtml(`
            <div>Price (EUR)</div>
            <div>Name</div>
        `))
        const div = await accessorUtil.fetchElement({
            locator: By.css('div'),
            identifier: 'Price (EUR)',
            relations: []
        });
        return expect(div).toBeDefined();
    });

});