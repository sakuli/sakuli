import {createTestEnv, createTestExecutionContextMock, TestEnvironment} from "../__mocks__";
import {ThenableWebDriver} from "selenium-webdriver";
import {actionApi, ActionApiFunction} from "./action-api.function";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "../relations";

jest.setTimeout(15_000);
xdescribe('ActionApiFunction', () => {
    let env: TestEnvironment;
    beforeEach(async () => {
        env = createTestEnv();
        await env.start();
    });

    afterEach(async () => {
        await env.stop();
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