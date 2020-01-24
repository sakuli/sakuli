import { relationsApi, RelationsResolver } from "../relations";
import { createTestEnv, mockHtml, TestEnvironment } from "../__mocks__";
import { createTestExecutionContextMock } from "../../__mocks__";
import { AccessorUtil } from "../accessor";
import { By } from "selenium-webdriver";
import { getNearestCommonParent } from "./get-nearest-common-parent.function";
import { getTestBrowserList } from "../__mocks__/get-browser-list.function";

jest.setTimeout(50000);

describe('getNearestCommonParent', () => {
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
            const ncp = await getNearestCommonParent(a, b);
            await expect(ncp.getAttribute('id')).resolves.toBe('parent');
            done();
        });
    });
});