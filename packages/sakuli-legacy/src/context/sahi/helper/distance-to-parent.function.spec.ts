import {relationsApi, RelationsResolver} from "../relations";
import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {AccessorUtil} from "../accessor";
import {By} from "selenium-webdriver";
import {distanceToParent} from "./distance-to-parent.function";
import {getTestBrowserList} from "../__mocks__/get-browser-list.function";

jest.setTimeout(50000);

describe('distanceToParent', () => {
    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
        let api: ReturnType<typeof relationsApi>;
        const testExecutionContext = createTestExecutionContextMock();

        let env: TestEnvironment;
        beforeAll(async done => {
            env = createTestEnv(browser, local);
            await env.start();
            const {driver} = await env.getEnv();
            const accessorUtil = new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext));
            api = relationsApi(driver, accessorUtil, testExecutionContext);
            done();
        });


        afterAll(async done => {
            await env.stop();
            done();
        });


        it('should calculate distance from a to b', async done => {
            const {driver} = await env.getEnv();
            const html = mockHtml(`                                
          <div id="parent">
            <div>
              <div>
                <div>
                  <div id="child"></div>
                </div>
              </div>
            </div>    
          </div>
        `);
            await driver.get(html);
            const child = await driver.findElement(By.css('#child'));
            const parent = await driver.findElement(By.css('#parent'));
            await expect(distanceToParent(child, parent)).resolves.toBe(4);
            done();
        });

        it('should throw if first parameter is not a child of second', async done => {
            const {driver} = await env.getEnv();
            const html = mockHtml(`                                
          <div id="parent">
            <div>
              <div id="child"></div>
            </div>
          </div>
        `);
            await driver.get(html);
            const child = await driver.findElement(By.css('#child'));
            const parent = await driver.findElement(By.css('#parent'));
            await expect(distanceToParent(parent, child)).rejects.toEqual(expect.any(Error));
            done();
        });
    });
});