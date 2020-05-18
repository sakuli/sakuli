import { createTestEnv, mockHtml, TestEnvironment } from "../__mocks__";
import { By, ThenableWebDriver, WebElement } from "selenium-webdriver";
import { NativeEventDispatcher } from "./native-event-dispatcher.class";
import { getTestBrowserList } from "../__mocks__/get-browser-list.function";

jest.setTimeout(15_000);
describe("NativeEventDispatcher", () => {
  describe.each(getTestBrowserList())(
    "%s",
    (browser: "firefox" | "chrome", local: boolean) => {
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

      it("should fire an event", async () => {
        const event = "keydown";
        await driver.get(
          mockHtml(`
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
        `)
        );
        const dispatcher = new NativeEventDispatcher(
          await driver.findElement(By.css("#event-emitter"))
        );
        await dispatcher.dispatchKeyboardEvent(event, { key: "b" });
        const out = await driver.findElement(By.css("#out"));
        return expect(out.getText()).resolves.toBe("emitted b");
      });
    }
  );

  it("should throw on null or undefined WebElement", async () => {
    //GIVEN
    const webElement = (undefined as unknown) as WebElement;
    const nativeEventDispatcher = new NativeEventDispatcher(webElement);

    //WHEN
    const dispatchEvent = nativeEventDispatcher.dispatchKeyboardEvent(
      "keydown",
      { key: "b" }
    );

    //THEN
    await expect(dispatchEvent).rejects.toThrowError(
      "Could not dispatch native event due to null or undefined WebElement reference"
    );
  });
});
