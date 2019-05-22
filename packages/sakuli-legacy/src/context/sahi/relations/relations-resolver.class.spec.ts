import {By, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {mockPartial} from "sneer";
import {TestExecutionContext} from "@sakuli/core";
import {RelationsResolver} from "./relations-resolver.class";
import {createTestEnv, mockHtml, TestEnvironment} from "../__mocks__";
import {getTestBrowserList} from "../__mocks__/get-browser-list.function";

const webElementToQuery = (elements: WebElement[]) => {
    return ({
        locator: By.js(`return arguments[0]`, elements),
        relations: [],
        identifier: RegExp('.*')
    });
};

jest.setTimeout(15_000);
describe('RelationResolver', () => {
    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
        const testExecutionContext = mockPartial<TestExecutionContext>({});

        let env: TestEnvironment;
        beforeAll(async () => {
            env = createTestEnv(browser, local);
            await env.start();
        });

        afterAll(async () => {
            await env.stop();
        });

        function createApi(driver: ThenableWebDriver) {
            return new RelationsResolver(driver, testExecutionContext);
        }


        it('should call on relations', async () => {
            const {driver} = await env.getEnv();
            await driver.get(mockHtml(`
            <ul>
              <li>Test 1</li>
              <li>Test 2</li>
              <li>Test 3</li>
              <li>Test 4</li>
            </ul>
        `));
            const api = createApi(driver);
            const items = await driver.findElements(By.css('li'));
            const otherItems = items.filter((_, i) => i % 2 === 0);
            const relationsMock = jest.fn(() => Promise.resolve(webElementToQuery(otherItems)));
            const relationsMock2 = jest.fn();
            await api.applyRelations({
                relations: [
                    relationsMock,
                    relationsMock2
                ],
                identifier: new RegExp('.*'),
                locator: By.css('li')
            });
            expect(relationsMock).toHaveBeenCalled();
            expect(relationsMock2).toHaveBeenCalled();
        });
    });
});