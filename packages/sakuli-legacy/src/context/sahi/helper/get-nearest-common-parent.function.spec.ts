import {relationsApi, RelationsResolver} from "../relations";
import {TestExecutionContext} from "@sakuli/core";
import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {AccessorUtil} from "../accessor";
import {By, Locator} from "selenium-webdriver";
import {SahiElementQueryOrWebElement} from "../sahi-element.interface";
import {getNearestCommonParent} from "./get-nearest-common-parent.function";

jest.setTimeout(50000);

describe('getNearestCommonParent', () => {
    let api: ReturnType<typeof relationsApi>;
    const testExecutionContext = createTestExecutionContextMock();

    let env: TestEnvironment;
    beforeAll(async done => {
        env = createTestEnv();
        await env.start();
        const {driver} = await env.getEnv();
        const accessorUtil = new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext));
        api = relationsApi(driver, accessorUtil, testExecutionContext);
        done();
    });

    function createQuery(locator: Locator): SahiElementQueryOrWebElement {
        return ({
            locator,
            identifier: 0,
            relations: []
        })
    }

    afterAll(async done => {
        await env.stop();
        done();
    });


    it('should find a common parent', async done => {
        const {driver} = await env.getEnv();
        const html = mockHtml(`                                
          <div>       
            <ul id="parent">
              <li>
                <span id="a"></span>
              </li>
              <li></li>
              <li>
                <div>
                  <span id="b"></span>
                </div>
              </li>
            </ul>
          </div>
                `);
        await driver.get(html);
        const a = await driver.findElement(By.css('#a'));
        const b = await driver.findElement(By.css('#b'));
        const ncp = await getNearestCommonParent(a,b);
        await expect(ncp.getAttribute('id')).resolves.toBe('parent');
        done();
    });
});