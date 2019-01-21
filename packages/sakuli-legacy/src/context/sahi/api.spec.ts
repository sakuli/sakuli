import {ThenableWebDriver} from "selenium-webdriver";
import {SahiApi} from "./api";
import {mockPartial} from "sneer";
import {TestExecutionContext} from "@sakuli/core";
import {initTestEnv} from "./__mocks__";
import {StaticServer} from "./__mocks__/serve-static-helper.function";

describe('Sahi API', () => {

    let driver: ThenableWebDriver;
    let staticServer: StaticServer;
    let url: string;
    let api: SahiApi;
    const testExecutionContext = mockPartial<TestExecutionContext>({});

    beforeAll(initTestEnv((info) => {
        url = info.url;
        driver = info.webDriver;
        staticServer = info.server;
        api = new SahiApi(driver, testExecutionContext);
    }));

    afterAll(async done => {
        await driver.quit();
        await staticServer.stop();
    });

    it('should highlight without errors', async done => {
        await api._navigateTo(url);
        await api._highlight(
            await api._link('Link 1')
        );
        done();
    });

    it('should fill the form', async done => {
        await api._navigateTo(`${url}/login.html`);
        await api._setValue(
            await api._textbox('username'),
            'User'
        );
        await api._setValue(
            await api._password('password'),
            'secret'
        );
        await api._click(
            await api._button('Login')
        );

        await api._highlight(
            await api._div('Logged in as User with secret')
        );
        done();
    });

});