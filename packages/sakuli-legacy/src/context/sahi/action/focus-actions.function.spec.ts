import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {By, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "../relations";
import {focusActionApi} from "./focus-actions.function";

jest.setTimeout(15_000);
describe('focus-api', () => {
    let env: TestEnvironment;
    let driver: ThenableWebDriver;
    beforeAll(async () => {
        env = createTestEnv();
        await env.start();
        driver = (await env.getEnv()).driver;
    });

    afterAll(async () => {
        await env.stop();
    });

    const testExecutionContextMock = createTestExecutionContextMock();

    function createApi(driver: ThenableWebDriver) {
        return focusActionApi(driver,
            new AccessorUtil(driver, testExecutionContextMock, new RelationsResolver(driver, testExecutionContextMock)),
            testExecutionContextMock)
    }

    it('should set focus to element', async () => {
        const {_focus} = createApi(driver);
        await driver.get(mockHtml(`
            <input type="text" id="text-input" />
        `));
        const inputLocator = By.css("#text-input");
        await _focus({
            locator: inputLocator,
            identifier: 0,
            relations: []
        });
        const inputElement = await driver.findElement(inputLocator);
        return expect(WebElement.equals(
            inputElement,
            driver.switchTo().activeElement()
        )).resolves.toBeTruthy()
    });

    it('should set blur an focused element', async () => {
        const {_blur} = createApi(driver);
        await driver.get(mockHtml(`
            <input type="text" id="text-input" autofocus />
        `));
        const inputLocator = By.css("#text-input");
        await _blur({
            locator: inputLocator,
            identifier: 0,
            relations: []
        });
        const inputElement = await driver.findElement(inputLocator);

        return expect(WebElement.equals(
            inputElement,
            driver.switchTo().activeElement()
        )).resolves.toBeFalsy()
    });
});