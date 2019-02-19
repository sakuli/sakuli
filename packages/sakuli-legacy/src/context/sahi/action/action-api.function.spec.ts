import {createTestEnv, mockHtml, TestEnvironment, createTestExecutionContextMock} from "../__mocks__";
import {By, ThenableWebDriver} from "selenium-webdriver";
import {ActionApiFunction, actionApi} from "./action-api.function";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "../relations";
import DoneCallback = jest.DoneCallback;

jest.setTimeout(15_000);
xdescribe('ActionApiFunction', () => {
    let env: TestEnvironment;
    beforeEach(async done => {
        env = createTestEnv();
        await env.start();
        done();
    });

    afterEach(async done => {
        await env.stop();
        done();
    });

    const testExecutionContextMock = createTestExecutionContextMock();

    function createApi(driver: ThenableWebDriver): ActionApiFunction {
        return actionApi(driver,
            new AccessorUtil(driver, testExecutionContextMock, new RelationsResolver(driver, testExecutionContextMock)),
            testExecutionContextMock)
    }

    it('should be a dummy', () => {
        expect(true).toBeTruthy();
    });
});