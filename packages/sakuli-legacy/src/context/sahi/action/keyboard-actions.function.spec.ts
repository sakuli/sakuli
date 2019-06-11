import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {By, ThenableWebDriver} from "selenium-webdriver";
import {keyboardActionApi} from "./keyboard-actions.function";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "../relations";
import {getTestBrowserList} from "../__mocks__/get-browser-list.function";

jest.setTimeout(15_000);
describe('KeyboardActions', () => {

    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
        let env: TestEnvironment;
        let driver: ThenableWebDriver;

        beforeAll(async () => {
            env = createTestEnv(browser, local);
            await env.start();
            driver = (await env.getEnv()).driver;
        });

        afterAll(async () => {
            await env.stop();
        });

        function createApi(driver: ThenableWebDriver) {
            const ctx = createTestExecutionContextMock();
            return keyboardActionApi(driver,
                new AccessorUtil(driver, ctx,
                    new RelationsResolver(driver, ctx)),
                ctx
            )
        }

        type KeyMethod = "_keyDown" | "_keyUp" | "_keyPress";
        it.each(<[KeyMethod, string, string, string][]>[
            ['_keyDown', 'keydown', 'a', ''],
            ['_keyDown', 'keydown', 'b', 'CTRL|SHIFT'],
            ['_keyUp', 'keyup', 'c', ''],
            ['_keyPress', 'keypress', 'd', ''],
            ['_keyPress', 'keypress', 'e', 'META'],
        ])('should invoke %s to emit %s with key %s and combo %s',
            async (method: KeyMethod, event: string, value: string, combo: string) => {
                const api = createApi(driver);
                await driver.get(mockHtml(`
                <form>
                  <input type="text" id="text-input" />
                  <input type="submit" value="submit" />              
                </form>
                <div id="out"></div>
                <script>
                  const $$ = document.getElementById.bind(document);
                  const textInput = $$('text-input');
                  const out = $$('out');
                  textInput.addEventListener('${event}', e => {
                     const combo = [];
                     if(e.ctrlKey) combo.push('CTRL');
                     if(e.metaKey) combo.push('META');
                     if(e.shiftKey) combo.push('SHIFT');
                     if(e.altKey) combo.push('ALT');
                     out.innerHTML = e.key + combo.join('|')
                  });
                </script>
            `));
                if (method === '_keyDown' || method === '_keyPress') {
                    await api[method]({
                        locator: By.css('#text-input'),
                        identifier: 0,
                        relations: []
                    }, value, combo);
                } else {
                    await api[method]({
                        locator: By.css('#text-input'),
                        identifier: 0,
                        relations: []
                    }, value);
                }
                const out = await driver.findElement(By.css('#out'));
                return expect(out.getText()).resolves.toBe(value + combo)
            });

        it('should type a value to input', async () => {
            const {_type} = createApi(driver);
            await driver.get(mockHtml(`
            <input type="text" id="text-input" />
        `));
            const inputLocator = By.css('#text-input');
            const value = 'Test';
            await _type({
                locator: inputLocator,
                identifier: 0,
                relations: []
            }, value);
            const inputElement = await driver.findElement(inputLocator);
            return expect(inputElement.getAttribute('value')).resolves.toBe(value)
        })

        it('should replace existing value in textbox in _setValue', async () => {
            const {_setValue} = createApi(driver);
            await driver.get(mockHtml(`
            <input type="text" id="text-input" value="foo" />
        `));
            const inputLocator = By.css('#text-input');
            const query = {
                locator: inputLocator,
                identifier: 0,
                relations: []
            };
            const value = 'Test';
            await _setValue(query, value);
            const inputElement = await driver.findElement(inputLocator);
            return expect(inputElement.getAttribute('value')).resolves.toBe(value)
        });

        it('should replace existing value in textbox when calling _setValue twice', async () => {
            const {_setValue} = createApi(driver);
            await driver.get(mockHtml(`
            <input type="text" id="text-input"  />
        `));
            const inputLocator = By.css('#text-input');
            const query = {
                locator: inputLocator,
                identifier: 0,
                relations: []
            };
            const value = 'Test';
            await _setValue(query, 'foo');
            await _setValue(query, value);
            const inputElement = await driver.findElement(inputLocator);
            return expect(inputElement.getAttribute('value')).resolves.toBe(value)
        });

    })
});