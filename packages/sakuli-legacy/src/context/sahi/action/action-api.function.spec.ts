import { By, ThenableWebDriver } from "selenium-webdriver";
import { actionApi } from "./action-api.function";
import { AccessorUtil } from "../accessor";
import { RelationsResolver } from "../relations";
import {
  createTestEnv,
  getTestBrowserList,
  mockHtml,
  TestEnvironment,
} from "../__mocks__";
import { createTestExecutionContextMock } from "../../__mocks__";
import { LegacyProjectProperties } from "../../../loader/legacy-project-properties.class";
import { mockPartial } from "sneer";

jest.setTimeout(60_000);
describe("action-api", () => {
  describe.each(getTestBrowserList())(
    "%s",
    (browser: "firefox" | "chrome", local: boolean) => {
      let env: TestEnvironment;
      let driver: ThenableWebDriver;
      let properties: LegacyProjectProperties;
      beforeEach(async () => {
        jest.clearAllMocks();
        env = createTestEnv(browser, local);
        await env.start();
        driver = (await env.getEnv()).driver;
        properties = mockPartial<LegacyProjectProperties>({});
      });

      function createApi(driver: ThenableWebDriver) {
        const ctx = createTestExecutionContextMock();
        return actionApi(
          driver,
          new AccessorUtil(driver, ctx, new RelationsResolver(driver, ctx)),
          ctx,
          properties
        );
      }

      afterEach(async () => {
        try {
          await driver.actions({ bridge: true }).clear();
        } catch (e) {
          console.log("Actions are not cleaned because ", e);
        }
      });

      afterAll(async () => {
        await env.stop();
      });

      describe("auto scroll to viewport", () => {
        it("should autoscroll to click element", async () => {
          const api = createApi(driver);
          await driver.get(
            mockHtml(`
                    <div style="display: block; width: 100%; height: 150vh; background: red"></div>
                    <button id="btn">Click Me</button>
                    <div id="out"></div>
                    <script>
                        document.getElementById('btn').addEventListener('click', function() {
                            document.getElementById('out').innerText = 'clicked';
                        })
                    </script>
                `)
          );
          await expect(
            api._click({
              locator: By.css("#btn"),
              identifier: 0,
              relations: [],
            })
          ).resolves.toBeNull();
          const out = await driver.findElement(By.id("out"));
          await expect(out.getText()).resolves.toEqual("clicked");
        });

        it("should autoscroll a element in a scrollabel container to click element", async () => {
          const api = createApi(driver);
          await driver.get(
            mockHtml(`
                    <div style="width: 100%; border: 1px solid gray; height: 200px; overflow: auto">
                        <button id="btn" style="margin-top: 300px">Test</button>
                    </div>
                    <div id="out"></div>
                    <script>
                        document.getElementById('btn').addEventListener('click', function() {
                            document.getElementById('out').innerText = 'clicked';
                        })
                    </script>
                `)
          );
          await expect(
            api._click({
              locator: By.css("#btn"),
              identifier: 0,
              relations: [],
            })
          ).resolves.toBeNull();
          const out = await driver.findElement(By.id("out"));
          await expect(out.getText()).resolves.toEqual("clicked");
        });
      });

      describe("deactivate auto switch between frames", () => {
        it("should not find element in iframe when skipFrame is activated", async () => {
          // GIVEN
          properties.manualFrames = true;
          const api = createApi(driver);
          await driver.get(
            mockHtml(`
                    <iframe src="${mockHtml(`
                        <div id="in-iframe">Frame1</div>
                    `)}" >
                `)
          );

          // WHEN
          await expect(
            api._highlight({
              locator: By.css("#in-iframe"),
              identifier: 0,
              relations: [],
            })
          )
            // THEN
            .rejects.toThrowError();
        });
      });

      describe("auto switch between frames", () => {
        it("should find elements over all frames in frameset", async () => {
          const api = createApi(driver);
          await driver.get(
            mockHtml(
              `
                <frameset cols="25%, 75%">
                    <frame src="${mockHtml(`
                        <div id="in-frame1">Frame1</div>
                    `)}" >
                    <frame src="${mockHtml(`
                        <div id="in-frame2">Frame2</div>
                    `)}" />
                </frameset>
                `,
              { autoBody: false }
            )
          );
          await expect(
            api._highlight({
              locator: By.css("#in-frame2"),
              identifier: 0,
              relations: [],
            })
          ).resolves.toBe(void 0);
        });

        it("should find elements in iframes", async () => {
          const api = createApi(driver);
          await driver.get(
            mockHtml(`
                    <iframe src="${mockHtml(`
                        <div id="in-iframe">Frame1</div>
                    `)}" >
                `)
          );
          await expect(
            api._highlight({
              locator: By.css("#in-iframe"),
              identifier: 0,
              relations: [],
            })
          ).resolves.toBe(void 0);
        });
      });
    }
  );
});
