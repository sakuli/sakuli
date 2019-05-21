import {By, Locator, ThenableWebDriver, WebElement} from "selenium-webdriver";
import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {fetchApi} from "./fetch-api.function";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "../relations";
import {SahiElementQueryOrWebElement} from "../sahi-element.interface";
import {getTestBrowserList} from "../action/__mocks__/get-browser-list.function";

jest.setTimeout(15_000);
describe('fetch-api', () => {
    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
        let env: TestEnvironment;
        let driver: ThenableWebDriver;
        let api: ReturnType<typeof fetchApi>;
        beforeAll(async () => {
            env = createTestEnv(browser, local);
            await env.start();
            driver = (await env.getEnv()).driver;
            const ctx = createTestExecutionContextMock();
            api = fetchApi(
                driver,
                new AccessorUtil(
                    driver,
                    ctx,
                    new RelationsResolver(
                        driver,
                        ctx
                    )
                ),
                ctx
            )
        });

        afterAll(async () => {
            await env.stop();
        });

        function queryByLocator(locator: Locator): SahiElementQueryOrWebElement {
            return ({locator, relations: [], identifier: 0})
        }

        test('_getValue to read value "test" from  input element', async () => {
            const {_getValue} = api;
            await driver.get(mockHtml(`
                <input value="test" />         
            `));
            return expect(_getValue(queryByLocator(By.css('input'))))
                .resolves.toBe('test');
        });

        test('_getText to read inner ""Hello World" of <div>- Element', async () => {
            const {_getText} = api;
            await driver.get(mockHtml(`
            <div>
              Hello <i>World</i> 
            </div>
        `));
            const q = queryByLocator(By.css('div'));
            return expect(_getText(q)).resolves.toBe('Hello World');
        });

        test.each(<["value" | undefined, string[]][]>[
            [undefined, ['Water', 'Wine', 'Beer']],
            ['value', ['water', 'wine', 'beer']],
        ])('_getOptions to return a list of options innerTexts', async (value: "value" | undefined, expected: string[]) => {
            const {_getOptions} = api;
            await driver.get(mockHtml(`
            <select>
              <option value="water">Water</option>
              <option value="wine">Wine</option>
              <option value="beer">Beer</option>
            </select>
        `));
            const q = queryByLocator(By.css('select'));
            return expect(_getOptions(q, value)).resolves.toEqual(expect.arrayContaining(expected));
        });

        test('_getSelectedText to read "Beer" as selected text', async () => {
            const {_getSelectedText} = api;
            await driver.get(mockHtml(`
            <select>
              <option value="water">Water</option>
              <option value="beer" selected>Beer</option>
              <option value="wine">Wine</option>
            </select>
        `));
            const q = queryByLocator(By.css('select'));
            return expect(_getSelectedText(q)).resolves.toEqual('Beer');
        });

        test('_getAttribute to return attribute value from element', async () => {
            const {_getAttribute} = api;
            await driver.get(mockHtml(`
            <div
              data-custom="test"
            ></div>
        `));
            const q = queryByLocator(By.css('div'));
            return expect(_getAttribute(q, 'data-custom')).resolves.toEqual('test');
        });

        test.each(<[string, boolean][]>[
            ['h1', true],
            ['h2', false]
        ])('_exists to resolve %s to %s', async (element: string, expected: boolean) => {
            const {_exists} = api;
            await driver.get(mockHtml(`
            <h1>Exists</h1>
        `));
            const q = queryByLocator(By.css(element));
            return expect(_exists(q)).resolves.toBe(expected);
        });

        test.each(<[string, string, boolean][]>[
            ['h1', '#heading1', true],
            ['h2', '#heading1', false],
        ])('_areEqual to identify "%s" and "%s" to equal %s', async (cssSelector1: string, cssSelector2: string, expected: boolean) => {
            const {_areEqual} = api;
            await driver.get(mockHtml(`
            <h1 id="heading1">Heading 1</h1>
            <h2 id="heading2">Heading 2</h2>
        `));
            const q1 = queryByLocator(By.css(cssSelector1));
            const q2 = queryByLocator(By.css(cssSelector2));
            return expect(_areEqual(q1, q2)).resolves.toBe(expected);
        });

        test.each(<[string, boolean][]>[
            ['#hidden', false],
            ['#display-none', false],
            ['#visible', true],
            ['#no-content', false],
        ])('_isVisible is %s for %s', async (selector: string, expected: boolean) => {
            const {_isVisible} = api;
            await driver.get(mockHtml(`
            <div style="visibility: hidden" id="hidden">Hidden</div>
            <div style="display: none" id="display-none">None</div>
            <div style="display: block" id="visible">Visible</div>
            <div id="no-content"></div>
        `));
            const q1 = queryByLocator(By.css(selector));
            return expect(_isVisible(q1)).resolves.toBe(expected);
        });

        test.each(<[boolean, string][]>[
            [true, '#checked'],
            [false, '#unchecked'],
        ])('_isChecked to be %s for %s', async (expected: boolean, selector: string) => {
            const {_isChecked} = api;
            await driver.get(mockHtml(`
            <input type="checkbox" checked id="checked" />
            <input type="checkbox" id="unchecked" />
        `));
            const q1 = queryByLocator(By.css(selector));
            return expect(_isChecked(q1)).resolves.toBe(expected);
        });

        test.each(<[boolean, string][]>[
            [true, '#enabled'],
            [false, '#disabled'],
        ])('_isChecked to be %s for %s', async (expected: boolean, selector: string) => {
            const {_isEnabled} = api;
            await driver.get(mockHtml(`
            <button disabled id="disabled">Disabled</button>
            <button id="enabled">Enabled</button>
        `));
            const q1 = queryByLocator(By.css(selector));
            return expect(_isEnabled(q1)).resolves.toBe(expected);
        });

        test('_containsText to test partial texts from HTML-Elements', async () => {
            const {_containsText} = api;
            await driver.get(mockHtml(`
            <div>Hello <i>World</i></div>
        `));
            const q1 = queryByLocator(By.css('div'));
            return expect(_containsText(q1, 'llo Wo')).resolves.toBe(true);
        });

        test.each(<[string, boolean][]>[
            ['<i>Formatted</i>', true],
            ['Text', true],
            ['<i>Formatted</i> Text', true],
            ['<i>.*</i> Text ', true],
            ['Formatted Text', false],
            ['Non existent', false]
        ])('_containsHTML to test partial texts %s from HTML-Elements is %s', async (text: string, expected: boolean) => {
            const {_containsHTML} = api;
            await driver.get(mockHtml(`
            <div id="d1" style="background-color: yellow"><i>Formatted</i> Text</div>
        `));
            const q1 = queryByLocator(By.css('div'));
            return expect(_containsHTML(q1, text)).resolves.toBe(expected);
        });

        test('_contains to identify _div("d1") in _span("inside")', async () => {
            const {_contains} = api;
            await driver.get(mockHtml(`
            <div id="d1">
              <span id="inside">inside</span>
            </div>
        `));
            const parentQ = queryByLocator(By.css('#d1'));
            const childQ = queryByLocator(By.css('#inside'));
            return expect(_contains(parentQ, childQ)).resolves.toBe(true)
        })

        test('_title to read the title from document', async () => {
            const {_title} = api;
            await driver.get(mockHtml(``));
            return expect(_title()).resolves.toBe('Document');
        })

        test('_style should read a style property ', async () => {
            const {_style} = api;
            await driver.get(mockHtml(`
            <div style="width: 100vh; display: block; border: 1px solid black;"></div>
        `));
            const q = queryByLocator(By.css('div'));
            return expect(_style(q, 'display')).resolves.toBe('block');
        })

        test('_position to return position of absolute placed element', async () => {
            const {_position} = api;
            await driver.get(mockHtml(`
            <div style="width: 10px; height: 10px; position:absolute; left: 20px; top: 10px"></div>
        `));
            const q = queryByLocator(By.css('div'));
            return expect(_position(q)).resolves.toEqual([20, 10]);
        })

        test('_getSelectionText to return selected text', async () => {
            const {_getSelectionText} = api;
            await driver.get(mockHtml(`
            <div id="text">Lorem ipsum dolor sit amet</div>
            <script>
                var text = document.getElementById('text');
                var range = document.createRange();
                range.selectNode(text);
                window.getSelection().removeAllRanges();
                window.getSelection().addRange(range);            
            </script>
        `));
            const q = queryByLocator(By.css('div'));

            return expect(_getSelectionText()).resolves.toEqual('Lorem ipsum dolor sit amet');
        });

        test('_fetch to resolve to an Element', async () => {
            const {_fetch} = api;
            await driver.get(mockHtml(`
            <div id="element"></div>
        `));
            const e1 = await _fetch(queryByLocator(By.css('div')));
            const e2 = await driver.findElement(By.css('#element'));
            expect(
                await e1.getId()
            ).toBe(await e2.getId());

        })
    })
});