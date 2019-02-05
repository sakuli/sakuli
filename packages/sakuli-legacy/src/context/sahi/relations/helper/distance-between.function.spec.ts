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

jest.setTimeout(50000);

describe('distanceBetween', () => {
    let api: ReturnType<typeof relationsApi>;
    const testExecutionContext = mockPartial<TestExecutionContext>({});

    let env: TestEnvironment;
    beforeEach(async done => {
        env = createTestEnv();
        await env.start();
        const {driver} = await env.getEnv();
        const accessorUtil = new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext));
        api = relationsApi(driver, accessorUtil, testExecutionContext);
        done();
    });

    afterEach(async done => {
        await env.stop();
        done();
    });


    it.each([
        ['n1', 4],
        ['n2', 4],
        ['n3', 4],
        ['n4', 3],
        ['n5', 4],
        ['n6', 0],
        ['n7', 4],
        ['n8', 0],
    ])('should calculate distance for %s as %i', async (id: string, distance: number, done: DoneCallback) => {
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
        done();
    });
});