import {By, ThenableWebDriver} from "selenium-webdriver";
import {StaticServer} from "../__mocks__/serve-static-helper.function";
import {mockPartial} from "sneer";
import {initTestEnv} from "../__mocks__";
import {TestExecutionContext} from "@sakuli/core";
import {RelationsResolver} from "./relations-resolver.class";

describe('AccessorUtil', () => {
    let driver: ThenableWebDriver;
    let staticServer: StaticServer;
    let url: string;
    let api: RelationsResolver;
    const testExecutionContext = mockPartial<TestExecutionContext>({});

    beforeAll(initTestEnv((info) => {
        url = info.url;
        driver = info.webDriver;
        staticServer = info.server;
        api = new RelationsResolver(driver, testExecutionContext);
    }));

    afterAll(async done => {
        await driver.quit();
        await staticServer.stop();
    });


    it('should call on relations', async done => {
        await driver.get(`${url}/relations/relations-resolver.html`);
        const items = await driver.findElements(By.css('li'));
        const otherItems = items.filter((_, i) => i % 2 === 0);
        const relationsMock = jest.fn(() => otherItems);
        const relationsMock2 = jest.fn();
        const elements = await api.applyRelations(items, [
            relationsMock,
            relationsMock2
        ]);
        expect(relationsMock).toHaveBeenCalledWith(items);
        expect(relationsMock2).toHaveBeenCalledWith(otherItems);
        done();
    });

});