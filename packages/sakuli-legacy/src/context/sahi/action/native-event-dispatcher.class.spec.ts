import {createTestEnv, mockHtml, TestEnvironment} from "../__mocks__";
import {By, ThenableWebDriver} from "selenium-webdriver";
import {NativeEventDispatcher} from "./native-event-dispatcher.class";

jest.setTimeout(15_000);
describe('NativeEventDispatcher', () => {

    let env: TestEnvironment;
    let driver: ThenableWebDriver;
    beforeAll(async () => {
        env = createTestEnv();
        await env.start();
        driver = (await env.getEnv()).driver;
    });

    afterAll(async () => {
        await env.stop();
    });

    it('should fire an event', async () => {
        const event = 'keydown';
        await driver.get(mockHtml(`
            <div id="event-emitter"></div>
            <div id="out"></div>
            <script>
              const $$ = document.getElementById.bind(document);
              const textInput = $$('event-emitter');
              const out = $$('out');
              textInput.addEventListener('${event}', e => {
                 out.innerHTML = 'emitted ' +  e.key;
              });
            </script>
        `));
        const dispatcher = new NativeEventDispatcher(await driver.findElement(By.css('#event-emitter')));
        await dispatcher.dispatchKeyboardEvent(event, {key: 'b'});
        const out = await driver.findElement(By.css('#out'));
        return expect(out.getText()).resolves.toBe('emitted b')
    });


});