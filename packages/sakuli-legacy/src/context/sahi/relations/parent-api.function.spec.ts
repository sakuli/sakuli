import {By, Locator, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "./relations-resolver.class";
import {SahiElementQuery} from "../sahi-element.interface";
import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {ParentApi, parentApi} from "./parent-api.function";

jest.setTimeout(15_000);
describe('relations-api', () => {
    const testExecutionContext = createTestExecutionContextMock();

    let env: TestEnvironment;
    let api: ParentApi;
    let driver: ThenableWebDriver;
    let accessorUtil: AccessorUtil;


    function createQuery(locator: Locator): SahiElementQuery {
        return ({
            locator,
            identifier: 0,
            relations: []
        })
    }

    beforeAll(async () => {
        env = createTestEnv();
        await env.start();
        driver = (await env.getEnv()).driver;
        accessorUtil = new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext));
        api = parentApi(driver, accessorUtil, testExecutionContext);
    });

    afterAll(async () => {
        await env.stop();
    });

    it.each([
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
        const linkQ: SahiElementQuery = {
            locator: By.css('a'),
            identifier: 'aLink',
            relations: []
        };
        const q = await api._parentNode(linkQ, 'DIV', offset);
        const expected = await driver.findElement(By.css(parentId));
        const found = await accessorUtil.fetchElement(q);
        return expect(WebElement.equals(expected, found)).resolves.toBe(true)
    })

});