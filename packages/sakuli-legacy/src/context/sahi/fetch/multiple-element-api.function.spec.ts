import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {ThenableWebDriver} from "selenium-webdriver";
import {multipleElementApi, MultipleElementApi} from "./multiple-element-api.function";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "../relations";

jest.setTimeout(15_000);
describe('multipleElementApi', () => {
    let env: TestEnvironment;
    let driver: ThenableWebDriver;
    let api: MultipleElementApi;

    beforeAll(async () => {
        env = createTestEnv();
        await env.start();
        driver = (await env.getEnv()).driver;
        const ctx = createTestExecutionContextMock();
        api = multipleElementApi(
            driver,
            new AccessorUtil(driver, ctx, new RelationsResolver(driver, ctx)),
            ctx
        );
    });

    afterAll(async () => {
        await env.stop()
    });

    describe('_collect', () => {
        it('should collect 3 divs', async () => {
            const {_collect} = api;
            await driver.get(mockHtml(`
                <div>D1</div>
                <div>D2</div>
                <div>X1</div>
                <div>D3</div>
            `));
            const collected = await _collect("_div", 'D.');
            return expect(collected.length).toBe(3);
        });
    });


});