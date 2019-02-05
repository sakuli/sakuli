import {mockHtml} from "../../__mocks__/html/mock-html.function";
import {By, Locator} from "selenium-webdriver";
import {relationsApi} from "../relations-api.function";
import {mockPartial} from "sneer";
import {AccessorUtil} from "../../accessor";
import {RelationsResolver} from "../relations-resolver.class";
import {SahiElementQuery} from "../../sahi-element.interface";
import {TestExecutionContext} from "@sakuli/core";
import {createTestEnv, TestEnvironment} from "../../__mocks__/create-test-env.function";
import {distanceBetween} from "./distance-between.function";
import DoneCallback = jest.DoneCallback;
import {getNearestCommonParent} from "./get-nearest-common-parent.function";

jest.setTimeout(50000);

describe('getNearestCommonParent', () => {
    let api: ReturnType<typeof relationsApi>;
    const testExecutionContext = mockPartial<TestExecutionContext>({});

    let env: TestEnvironment;
    beforeAll(async done => {
        env = createTestEnv();
        await env.start();
        const {driver} = await env.getEnv();
        const accessorUtil = new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext));
        api = relationsApi(driver, accessorUtil, testExecutionContext);
        done();
    });

    function createQuery(locator: Locator): SahiElementQuery {
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