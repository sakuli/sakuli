import {By, ThenableWebDriver} from "selenium-webdriver";
import {StaticServer} from "../__mocks__/serve-static-helper.function";
import {mockPartial} from "sneer";
import {initTestEnv} from "../__mocks__";
import {TestExecutionContext} from "@sakuli/core";
import {AccessorUtil} from "./accessor-util.class";
import {RelationsResolver} from "../relations/relations-resolver.class";

describe('AccessorUtil', () => {
    let driver: ThenableWebDriver;
    let staticServer: StaticServer;
    let url: string;
    let api: AccessorUtil;
    const testExecutionContext = mockPartial<TestExecutionContext>({});

    beforeAll(initTestEnv((info) => {
        url = info.url;
        driver = info.webDriver;
        staticServer = info.server;
        api = new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext));
    }));

    afterAll(async done => {
        await driver.quit();
        await staticServer.stop();
    });


    it('should fetch fuzzy matching identifiers from element', async done => {
        await driver.get(`${url}/accessor/get-string-identifiers-for-element.html`);
        const element = await driver.findElement(By.id('element-to-test'));
        const identifiers = await api.getStringIdentifiersForElement(element);
        expect(identifiers).toEqual([
            'aria', 'my-name-is-earl', 'element-to-test', 'so many names', 'Some Text content'
        ]);
        done();
    });

    it('should ', () => {
        //api.getElement()
    });

});