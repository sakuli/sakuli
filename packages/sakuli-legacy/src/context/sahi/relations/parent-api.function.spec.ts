import {By, ThenableWebDriver} from "selenium-webdriver";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "./relations-resolver.class";
import {SahiElementQueryOrWebElement} from "../sahi-element.interface";
import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {ParentApi, parentApi} from "./parent-api.function";
import {isEqual} from "../helper/is-equal.function";
import {getTestBrowserList} from "../__mocks__/get-browser-list.function";

jest.setTimeout(15_000);
describe('relations-api', () => {

    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
        const testExecutionContext = createTestExecutionContextMock();

        let env: TestEnvironment;
        let api: ParentApi;
        let driver: ThenableWebDriver;
        let accessorUtil: AccessorUtil;

        beforeAll(async () => {
            env = createTestEnv(browser, local);
            await env.start();
            driver = (await env.getEnv()).driver;
            accessorUtil = new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext));
            api = parentApi(driver, accessorUtil, testExecutionContext);
        });

        afterAll(async () => {
            await env.stop();
        });

        it.each(<[string, number][]>[
            ['#div1', 1],
            ['#div2', 2],
        ])('should find parent %s with offset %s', async (parentId: string, offset: number) => {
            await driver.get(mockHtml(`
            <div id="div2">
              <span><div id="div1">
                  <a href="">aLink</a>
                </div></span>
            </div>
        `));
            const linkQ: SahiElementQueryOrWebElement = {
                locator: By.css('a'),
                identifier: 'aLink',
                relations: []
            };
            const q = await api._parentNode(linkQ, 'DIV', offset);
            const expected = await driver.findElement(By.css(parentId));
            const found = await accessorUtil.fetchElement(q);
            return expect(isEqual(expected, found)).resolves.toBe(true)
        })

        it('should find parent by webelement reference', async () => {
            const {_parentNode} = api;
            await driver.get(mockHtml(`
          <div id="div2">
            <span><div id="div1">
              <a href="" id="a-link">aLink</a>
            </div></span>
          </div>
        `))
            const e = await driver.findElement(By.css('#a-link'));
            const pq = await _parentNode(e, 'div', 1);
            const found = await accessorUtil.fetchElement(pq);
            return expect(found.getAttribute('id')).resolves.toBe('div1');
        });
    });
});