import {By, ThenableWebDriver} from "selenium-webdriver";
import {mockPartial} from "sneer";
import {TestExecutionContext} from "@sakuli/core";
import {RelationsResolver} from "./relations-resolver.class";
import {createTestEnv, mockHtml, TestEnvironment} from "../__mocks__";

describe('AccessorUtil', () => {
    const testExecutionContext = mockPartial<TestExecutionContext>({});

    let env: TestEnvironment;
    beforeAll(async () => {
        env = createTestEnv();
        await env.start();
    });

    afterAll(async () => {
        await env.stop();
    })

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
        const relationsMock = jest.fn(() => otherItems);
        const relationsMock2 = jest.fn();
        await api.applyRelations(items, [
            relationsMock,
            relationsMock2
        ]);
        expect(relationsMock).toHaveBeenCalledWith(items);
        expect(relationsMock2).toHaveBeenCalledWith(otherItems);
    });

});