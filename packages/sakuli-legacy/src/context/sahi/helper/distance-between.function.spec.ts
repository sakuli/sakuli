import {By} from "selenium-webdriver";
import {mockPartial} from "sneer";
import {TestExecutionContext} from "@sakuli/core";
import {distanceBetween} from "./distance-between.function";
import {relationsApi, RelationsResolver} from "../relations";
import {createTestEnv, mockHtml, TestEnvironment} from "../__mocks__";
import {AccessorUtil} from "../accessor";
import {getTestBrowserList} from "../action/__mocks__/get-browser-list.function";

jest.setTimeout(50000);

describe('distanceBetween', () => {
    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
        let api: ReturnType<typeof relationsApi>;
        const testExecutionContext = mockPartial<TestExecutionContext>({});

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


        it.each(<[string, number][]>[
            ['n1', 4],
            ['n2', 4],
            ['n3', 4],
            ['n4', 3],
            ['n5', 4],
            ['n6', 0],
            ['n7', 4],
            ['n8', 0],
        ])('should calculate distance for %s as %i', async (id: string, distance: number) => {
            const {driver} = await env.getEnv();
            const html = mockHtml(`                                
            <div>              
              <span id="n5">n5</span><!-- 6 -->
              <div>
                <span id="n4">n4</span><!-- 2 -->
                <div>
                  <span id="n3">n3</span><!-- 3 -->
                </div>
                <div>                  
                  <span id="n1">n1</span><!-- 4 -->                  
                  <span id="n2">n2</span><!-- 5 -->
                </div>
                <div>
                  <span id="n8">n8</span><!-- 0 -->
                  <div id="anchor">Anchor</div>                  
                  <span id="n6">n6</span><!-- 0 -->
                  <div>
                    <div>                      
                      <span id="n7">n7</span><!-- 1 -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
                `);
            await driver.get(html);
            const e = await driver.findElement(By.css(`#${id}`));
            const root = await driver.findElement(By.css('#anchor'));
            await expect(distanceBetween(root, e)).resolves.toBe(distance);
        });
    });
});