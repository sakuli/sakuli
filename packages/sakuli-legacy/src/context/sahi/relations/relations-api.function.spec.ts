import {By, ThenableWebDriver} from "selenium-webdriver";
import {StaticServer} from "../__mocks__/serve-static-helper.function";
import {mockPartial} from "sneer";
import {initTestEnv} from "../__mocks__";
import {TestExecutionContext} from "@sakuli/core";
import {getParent, getSiblings, isChildOf, relationsApi} from "./relations-api.function";
import {isEqual} from "../selenium-utils.function";
import {ifPresent} from "@sakuli/commons";

describe('AccessorUtil', () => {
    let driver: ThenableWebDriver;
    let staticServer: StaticServer;
    let url: string;
    let api: ReturnType<typeof relationsApi>;
    const testExecutionContext = mockPartial<TestExecutionContext>({});

    beforeAll(initTestEnv((info) => {
        url = info.url;
        driver = info.webDriver;
        staticServer = info.server;
        api = relationsApi(driver, testExecutionContext);
    }));

    afterAll(async done => {
        await driver.quit();
        await staticServer.stop();
        done();
    });

    describe('getParent', () => {
        it('should resolve to a parent', async done => {
            await driver.get(`${url}/relations/relations-resolver.html`);
            const li = await driver.findElement(By.css('li'));
            const ul = await driver.findElement(By.css('ul'));
            await ifPresent(await getParent(li), async parent => {
                await expect(isEqual(ul, parent)).resolves.toBeTruthy();
            }, () => done.fail());

            done();
        });

        it('should return null if element has no parent', async done => {
            await expect(
                getParent(driver.findElement(By.css('html')))
            ).resolves.toBeNull();
            done();
        });
    });

    describe('isChildOf', () => {
        it('should check that #del1 is child of table._in', async done => {
            await driver.get(`${url}/relations/relations-api.html`);
            const table = await driver.findElement(By.css('table._in'));
            const del1 = await driver.findElement(By.css('#del1'));
            await expect(isChildOf(del1, table)).resolves.toBeTruthy();
            done();
        });

        it('should check that #del2 is not a child of #del1', async done => {
            await driver.get(`${url}/relations/relations-api.html`);
            const del1 = await driver.findElement(By.css('#del1'));
            const del2 = await driver.findElement(By.css('#del2'));
            await expect(isChildOf(del2, del1)).resolves.toBeFalsy();
            done();
        });
    });

    describe('_in', () => {
        it('should resolve ', async done => {
            await driver.get(`${url}/relations/relations-api.html`);
            const del2 = await driver.findElement(By.css('._in #del2'));
            const links = await driver.findElements(By.css('._in a'));
            const relation = api._in(del2);
            const relatedLinks = await relation(links);
            expect(links.length).toBe(2);
            expect(relatedLinks.length).toBe(1);
            done();
        });
    });

    describe('_near', () => {
        it('should ', async done => {
            await driver.get(`${url}/relations/relations-api.html`);
            const user2 = await driver.findElement(By.css('#user-two'));
            const links = await driver.findElements(By.css('a'));
            const relation = await api._near(user2);
            const relatedLinks = await relation(links);
            expect(links.length).toBe(2);
            expect(relatedLinks.length).toBe(2);
            done();
        });

    });

    describe('getSiblings', () => {
        it('should get siblings of #anchor', async done => {
            await driver.get(`${url}/relations/relations-api.html`);
            const siblings = await getSiblings(driver.findElement(By.css('#anchor')));
            expect(siblings.length).toBe(6);
            await expect(siblings[0].getText()).resolves.toEqual("Rhona Davidson");
            await expect(siblings[5].getText()).resolves.toEqual("$327,900");
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
                await driver.get(`${url}/relations/relations-api.html`);
                const anchor = await driver.findElement(By.css('#anchor'));
                const siblings = await getSiblings(anchor);
                const leftOf = await api[method](anchor, offset)(siblings);
                const content = await Promise.all(leftOf.map(e => e.getText()));
                expect(content).toEqual(text);
                expect(leftOf.length).toBe(expected);
                done()
            }
        );



    })


});