import {createTestEnv, mockHtml, TestEnvironment, createTestExecutionContextMock} from "../__mocks__";
import {By, ThenableWebDriver} from "selenium-webdriver";
import {ActionApi, actionApi} from "./action.api";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "../relations";
import DoneCallback = jest.DoneCallback;

jest.setTimeout(15_000);
describe('ActionApi', () => {
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

    function createApi(driver: ThenableWebDriver): ActionApi {
        return actionApi(driver,
            new AccessorUtil(driver, testExecutionContextMock, new RelationsResolver(driver, testExecutionContextMock)),
            testExecutionContextMock)
    }

    describe('_setSelected', () => {
        it
            .each([
                'Beer',
                2,
                'v_beer'
            ])
            ('should select option #beer by identifier %s', async (selector: number | string, done: DoneCallback) => {
                const {driver, url} = await env.getEnv();
                const api = createApi(driver);
                await driver.get(mockHtml(`
                    <select>
                        <option value="v_coffee">Coffee</option>
                        <option value="v_tea">Tea</option>
                        <option id="beer" value="v_beer">Beer</option>
                        <option id="water" value="v_water">Water</option>                
                    </select>
                `));
                await api._setSelected({
                    relations: [],
                    identifier: 0,
                    locator: By.css('select')
                }, selector);
                const selectedOption = await driver.findElement(By.css('#beer'));
                await expect(selectedOption.isSelected()).resolves.toBeTruthy();
                done();
            });

    });
});