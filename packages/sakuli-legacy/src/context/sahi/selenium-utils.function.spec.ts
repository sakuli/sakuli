import {By, ThenableWebDriver} from "selenium-webdriver";
import {StaticServer} from "./__mocks__/serve-static-helper.function";
import {relationsApi} from "./relations/relations-api.function";
import {mockPartial} from "sneer";
import {initTestEnv} from "./__mocks__";
import {TestExecutionContext} from "@sakuli/core";
import {elementIntersection} from "./selenium-utils.function";

describe('selenium utils', () => {
    let driver: ThenableWebDriver;
    let staticServer: StaticServer;
    let url: string;
    let api: ReturnType<typeof relationsApi>;
    const testExecutionContext = mockPartial<TestExecutionContext>({});

    beforeAll(initTestEnv((info) => {
        url = info.url;
        driver = info.webDriver;
        staticServer = info.server;
        api = relationsApi(driver, testExecutionContext);
    }));

    afterAll(async done => {
        await driver.quit();
        await staticServer.stop();
        done();
    });

    describe('elementIntersection', () => {

        it('should find two intersected elements', async done => {
            await driver.get(`${url}/utils.html`);
            const a = await driver.findElements(By.css('.a'));
            const b = await driver.findElements(By.css('.b'));
            const intersect = await elementIntersection(a, b);
            expect(intersect.length).toBe(2);
            done();
        });

    });

});