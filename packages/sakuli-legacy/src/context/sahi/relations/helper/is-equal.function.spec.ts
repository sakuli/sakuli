import {mockHtml} from "../../__mocks__/html/mock-html.function";
import {By} from "selenium-webdriver";
import {createTestEnv, TestEnvironment} from "../../__mocks__/create-test-env.function";
import {distanceBetween} from "./distance-between.function";
import {isEqual} from "./is-equal.function";

jest.setTimeout(50000);

describe('distanceBetween', () => {

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


    it('should detect elements as equal', async done => {
        const {driver} = await env.getEnv();
        const html = mockHtml(`                                
            <div id="a"></div>   
        `);
        await driver.get(html);
        const byId = await driver.findElement(By.css(`#a`));
        const byTagName = await driver.findElement(By.css('div'));
        await expect(isEqual(byId, byTagName)).resolves.toBeTruthy();
        done();
    });
});