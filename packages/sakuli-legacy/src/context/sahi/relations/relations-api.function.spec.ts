import {By, Locator, ThenableWebDriver} from "selenium-webdriver";
import {relationsApi} from "./relations-api.function";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "./relations-resolver.class";
import {SahiElementQuery} from "../sahi-element.interface";
import {getSiblings} from "./helper/get-siblings.function";
import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";

jest.setTimeout(25_000);
describe('relations-api', () => {
    const testExecutionContext = createTestExecutionContextMock();


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
        it('should find span in div', async done => {
            const {driver} = await env.getEnv();
            const api = createApi(driver);
            await driver.get(mockHtml(`
                <span id="outside"></span>
                <div>
                  <span id="inside"></span>
                </div>
            `));
            const inRel = api._in(createQuery(By.css('div')));
            const related = await inRel(await driver.findElements(By.css('span')));
            expect(related.length).toBe(1);
            await expect(related[0].getAttribute('id')).resolves.toBe('inside');
            done();
        });

        it('should resolve ', async done => {
            const {url, driver} = await env.getEnv();
            const api = createApi(driver);
            await driver.get(mockHtml(`
                <table style="width:300px" class="_in">
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
            `));
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
            [6, '_leftOrRightOf', 0, ["Rhona Davidson", "Integration Specialist", "Tokyo", "55", "2010/10/14", "$327,900"]],
            [5, '_leftOrRightOf', 1, ["Integration Specialist", "Tokyo", "55", "2010/10/14", "$327,900"]],
        ])(
            'should relate %i elements which are %s the #anchor with an offset of %i and contains %j',
            async (expected: number, method: "_leftOf" | "_rightOf" | '_leftOrRightOf', offset: number, text: string[], done: jest.DoneCallback) => {
                const {driver} = await env.getEnv();
                const api = createApi(driver);
                await driver.get(mockHtml(`
                    <table class="_left _right" style="width:100%">
                      <thead>
                      <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr>
                        <td>Herrod Chandler</td>
                        <td>Sales Assistant</td>
                        <td>San Francisco</td>
                        <td>59</td>
                        <td>2012/08/06</td>
                        <td>$137,500</td>
                      </tr>
                      <tr>
                        <td>Rhona Davidson</td>
                        <td>Integration Specialist</td>
                        <td id="anchor">Tokyo</td>
                        <td>55</td>
                        <td>2010/10/14</td>
                        <td>$327,900</td>
                      </tr>                    
                      <tr>
                        <td>Donna Snider</td>
                        <td>Customer Support</td>
                        <td>New York</td>
                        <td>27</td>
                        <td>2011/01/25</td>
                        <td>$112,000</td>
                      </tr>
                      </tbody>
                      <tfoot>
                      <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Office</th>
                        <th>Age</th>
                        <th>Start date</th>
                        <th>Salary</th>
                      </tr>
                      </tfoot>
                    </table>
                `));
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