import {By, Locator, ThenableWebDriver} from "selenium-webdriver";
import {mockPartial} from "sneer";
import {TestExecutionContext} from "@sakuli/core";
import {relationsApi} from "./relations-api.function";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "./relations-resolver.class";
import {SahiElementQuery} from "../sahi-element.interface";
import {getSiblings} from "./helper/get-siblings.function";
import {mockHtml} from "../__mocks__/html/mock-html.function";
import {createTestEnv, TestEnvironment} from "../__mocks__";

describe('relations-api', () => {
    const testExecutionContext = mockPartial<TestExecutionContext>({});


    let env: TestEnvironment;

    function createApi(driver: ThenableWebDriver) {
        const accessorUtil = new AccessorUtil(driver, testExecutionContext, new RelationsResolver(driver, testExecutionContext));
        return relationsApi(driver, accessorUtil, testExecutionContext);
    }

    function createQuery(locator: Locator): SahiElementQuery {
        return ({
            locator,
            identifier: 0,
            relations: []
        })
    }

    beforeEach(async done => {
        env = createTestEnv();
        await env.start();
        done();
    });

    afterEach(async done => {
        await env.stop();
        done();
    });


    describe('_in', () => {
        it('should resolve ', async done => {
            const {url, driver} = await env.getEnv();
            const api = createApi(driver);
            await driver.get(`${url}/relations/relations-api.html`);
            const del2 = createQuery(By.css('._in #del2'));
            const links = await driver.findElements(By.css('._in a'));
            const relation = api._in(del2);
            const relatedLinks = await relation(links);
            expect(links.length).toBe(2);
            expect(relatedLinks.length).toBe(1);
            done();
        });
    });

    describe('_near', () => {
        it('should work', async done => {
            const {driver} = await env.getEnv();
            const api = createApi(driver);
            const html = mockHtml(`                                
                    <table class="_in">
                      <tr>
                        <td>Name</td>
                        <td>Action</td>
                        <td>ID</td>
                      </tr>
                      <tr>
                        <td id="user-one">User One</td>
                        <td id="del1"><a href="/deleteUser?id=1" onclick="return false">delete user one</a></td>
                        <td>ID 1</td>
                      </tr>
                      <tr>
                        <td id="user-two">User Two</td>
                        <td id="del2"><a href="/deleteUser?id=2" onclick="return false">delete user two</a></td>
                        <td>ID 2</td>
                      </tr>
                    </table>
                `);
            await driver.get(html);
            const nearUserTwo = api._near(createQuery(By.css('#user-two')));
            const links = await driver.findElements(By.css('a'));
            const linksNearUserTwo = await nearUserTwo(links);
            await expect(linksNearUserTwo[0].getText()).resolves.toEqual(expect.stringContaining('user two'));
            done();
        });

    });

    describe('position', () => {
        it.each([
            [3, '_leftOf', 0, ["Rhona Davidson", "Integration Specialist", "Tokyo"]],
            [2, '_leftOf', 1, ["Integration Specialist", "Tokyo"]],
            [3, '_rightOf', 0, ["55", "2010/10/14", "$327,900"]],
            [2, '_rightOf', 1, ["2010/10/14", "$327,900"]],
        ])(
            'should relate %i elements which are %s the #anchor with an offset of %i and contains %j',
            async (expected: number, method: "_leftOf" | "_rightOf", offset: number, text: string[], done: jest.DoneCallback) => {
                const {url, driver} = await env.getEnv();
                const api = createApi(driver);
                await driver.get(`${url}/relations/relations-api.html`);
                const anchor = await createQuery(By.css('#anchor'));
                const siblings = await getSiblings(driver.findElement(By.css('#anchor')));
                const leftOf = await api[method](anchor, offset)(siblings);
                const content = await Promise.all(leftOf.map(e => e.getText()));
                expect(content).toEqual(text);
                expect(leftOf.length).toBe(expected);
                done()
            }
        );
    });

});