import {By, ThenableWebDriver} from "selenium-webdriver";
import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "../relations";
import {FetchApi, fetchApi as createFetchApi} from "../fetch/fetch-api.function";
import {textSelectionApi, TextSelectionApi} from "./text-selection-api.function";
import {SahiElementQuery} from "../sahi-element.interface";

jest.setTimeout(15_000);
describe('textSelectionApi', () => {

    let env: TestEnvironment;
    let driver: ThenableWebDriver;
    let fetchApi: FetchApi;
    let api:TextSelectionApi;
    beforeAll(async () => {
        env = createTestEnv();
        await env.start();
        driver = (await env.getEnv()).driver;

        const ctx = createTestExecutionContextMock();
        const rr = new RelationsResolver(driver, ctx);
        const au = new AccessorUtil(driver, ctx, rr);
        fetchApi = createFetchApi(driver, au, ctx);
        api = textSelectionApi(driver, au, ctx);
    });

    afterAll(async () => {
        await env.stop();
    });

    test('_selectRange', async () => {
        const {_selectRange} = api;
        await driver.get(mockHtml(`
            <div>Lorem ipsum dolor sit amet</div>
        `));
        const q:SahiElementQuery = {
            locator: By.css('div'),
            identifier: 0,
            relations: []
        };
        await _selectRange(q, 6, 6 + 5);
        return expect(fetchApi._getSelectionText()).resolves.toBe('ipsum');
    });

    test('_selectTextRange', async () => {
        const {_selectTextRange} = api;
        await driver.get(mockHtml(`
            <div>Lorem ipsum dolor sit amet</div>
        `));
        const q:SahiElementQuery = {
            locator: By.css('div'),
            identifier: 0,
            relations: []
        };
        await _selectTextRange(q, 'ipsum');
        return expect(fetchApi._getSelectionText()).resolves.toBe('ipsum');
    });

});