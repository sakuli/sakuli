import {By, ThenableWebDriver} from "selenium-webdriver";
import {mockPartial} from "sneer";
import {TestExecutionContext} from "@sakuli/core";
import {RelationsResolver} from "./relations-resolver.class";
import {createTestEnv, TestEnvironment} from "../__mocks__";

describe('AccessorUtil', () => {
    const testExecutionContext = mockPartial<TestExecutionContext>({});

    let env: TestEnvironment;
    beforeEach(async done => {
        env = createTestEnv();
        await env.start();
        done();
    });

    afterEach(async done => {
        await env.stop();
        done();
    })

    function createApi(driver: ThenableWebDriver) {
        return new RelationsResolver(driver, testExecutionContext);
    }


    it('should call on relations', async done => {
        const {driver, url} = await env.getEnv();
        await driver.get(`${url}/relations/relations-resolver.html`);
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
        done();
    });

});