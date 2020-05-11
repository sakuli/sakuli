import { By, error, ThenableWebDriver } from "selenium-webdriver";
import { mouseActionApi } from "./mouse-actions-api.function";
import { AccessorUtil } from "../../accessor";
import { RelationsResolver } from "../../relations";
import { SahiElementQuery } from "../../sahi-element.interface";
import { createTestEnv, getTestBrowserList, mockHtml, TestEnvironment, } from "../../__mocks__";
import { createTestExecutionContextMock } from "../../../__mocks__";
import { ClickOptions } from "./click-options.interface";
import ElementClickInterceptedError = error.ElementClickInterceptedError;

jest.setTimeout(60_000);
describe("mouse-actions", () => {
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

      function createApi(driver: ThenableWebDriver) {
        const ctx = createTestExecutionContextMock();
        return mouseActionApi(
          driver,
          new AccessorUtil(driver, ctx, new RelationsResolver(driver, ctx)),
          ctx
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

      describe("_setSelected", () => {
        it.each(<(number | string)[]>["Beer", 2, "v_beer"])(
          "should select option #beer by identifier %s",
          async (selector: number | string) => {
            const { _setSelected } = createApi(driver);
            await driver.get(
              mockHtml(`
                    <select>
                        <option value="v_coffee">Coffee</option>
                        <option value="v_tea">Tea</option>
                        <option id="beer" value="v_beer">Beer</option>
                        <option id="water" value="v_water">Water</option>
                    </select>
                `)
            );
            await _setSelected(
              {
                relations: [],
                identifier: 0,
                locator: By.css("select"),
              },
              selector
            );
            const selectedOption = await driver.findElement(By.css("#beer"));
            return expect(selectedOption.isSelected()).resolves.toBeTruthy();
          }
        );
      });

      describe("_click", () => {
        const htmlSnippet = `
                <style>
                    .container {display: grid}
                    .content, .overlay {grid-area: 1 / 1 }
                </style>
                <div class="container">
                    <button id="btn" class="content" style="width: 200px; height: 20px">Not clickable</button>
                    <button id="cover" class="overlay">Overlay - must be placed under content in the HTML</button>
                </div>
                <div id="out"></div>
                <script >
                const $$ = document.getElementById.bind(document);
                const btn = $$('cover');
                const out = $$('out');
                btn.addEventListener('click', e => {
                    e.preventDefault();
                    const keyAddon = [];
                    if(e.ctrlKey) keyAddon.push('CTRL');
                    if(e.metaKey) keyAddon.push('META');
                    if(e.shiftKey) keyAddon.push('SHIFT');
                    if(e.altKey) keyAddon.push('ALT');
                    out.innerHTML = '_click ' + keyAddon.join("|");
                    return false;
                });
                </script>
                `;
        const forced: ClickOptions = { force: true };
        const notForced: ClickOptions = { force: false };

        const query: SahiElementQuery = {
          locator: By.css("#btn"),
          identifier: 0,
          relations: [],
        };

        it.each(<
          [undefined | string | ClickOptions, undefined | ClickOptions][]
        >[
          [undefined, undefined],
          ["", undefined],
          ["ALT", undefined],
          ["", notForced],
          ["ALT", notForced],
          [undefined, notForced],
          [notForced, undefined],
          [notForced, notForced],
        ])(
          "should throw when _click is called with combo keys %s and options %s",
          async (
            combo: undefined | string | ClickOptions,
            options: undefined | ClickOptions
          ) => {
            await driver.get(mockHtml(htmlSnippet));
            const api = createApi(driver);
            await expect(
              api._click(query, combo, options)
            ).rejects.toThrowError(expect.any(ElementClickInterceptedError));
          }
        );

        it.each(<
          [undefined | string | ClickOptions, undefined | ClickOptions][]
        >[
          ["", forced],
          ["ALT", forced],
        ])(
          "should click on overlay when forced to click covered element with combo key %s and options %s",
          async (
            combo: undefined | string | ClickOptions,
            options: undefined | ClickOptions
          ) => {
            await driver.get(mockHtml(htmlSnippet));
            const api = createApi(driver);
            await expect(
              api._click(query, combo, options)
            ).resolves.toBeUndefined();
            const out = await driver.findElement(By.css("#out"));
            await expect(out.getText()).resolves.toBe(`_click ${combo}`.trim());
          }
        );

        it.each(<
          [undefined | string | ClickOptions, undefined | ClickOptions][]
        >[
          [forced, undefined],
          [forced, forced],
          [undefined, forced],
        ])(
          "should click on overlay when forced to click covered element with combo key %s and options %s",
          async (
            combo: undefined | string | ClickOptions,
            options: undefined | ClickOptions
          ) => {
            await driver.get(mockHtml(htmlSnippet));
            const api = createApi(driver);
            await expect(
              api._click(query, combo, options)
            ).resolves.toBeUndefined();
            const out = await driver.findElement(By.css("#out"));
            await expect(out.getText()).resolves.toBe(`_click`);
          }
        );

        it.each(<
          [undefined | string | ClickOptions, undefined | ClickOptions][]
        >[
          [forced, notForced],
          [notForced, forced],
        ])(
          "should throw when different clickOptions(combo: %s, options: %s) are used",
          async (
            combo: undefined | string | ClickOptions,
            options: undefined | ClickOptions
          ) => {
            await driver.get(mockHtml(htmlSnippet));
            const api = createApi(driver);
            await expect(
              api._click(query, combo, options)
            ).rejects.toThrowError(expect.any(Error));
          }
        );
      });

      describe("mouse interaction", () => {
        type MouseMethods =
          | "_click"
          | "_rightClick"
          | "_mouseOver"
          | "_mouseUp"
          | "_mouseDown";
        const htmlSnippet = (nativeEvent: string, method: string) => `
            <style>
              #btn:hover {background: red;}
            </style>
            <button id="btn">Click Me</button>
            <div id="out"></div>
            <script >
              const $$ = document.getElementById.bind(document);
              const btn = $$('btn');
              const out = $$('out');
              btn.addEventListener('${nativeEvent}', e => {
                  e.preventDefault();
                  const keyAddon = [];
                  if(e.ctrlKey) keyAddon.push('CTRL');
                  if(e.metaKey) keyAddon.push('META');
                  if(e.shiftKey) keyAddon.push('SHIFT');
                  if(e.altKey) keyAddon.push('ALT');
                  out.innerHTML = '${method} ' + keyAddon.join("|");
                  return false;
              });
            </script>`;

        it.each(<[MouseMethods, string, string][]>[
          ["_mouseUp", "mouseup", ""],
          ["_mouseUp", "mouseup", "SHIFT|ALT"],
        ])(
          "%s should invoke native %s with '%s' pressed",
          async (method: MouseMethods, nativeEvent: string, combo: string) => {
            const api = createApi(driver);
            await driver.get(mockHtml(htmlSnippet(nativeEvent, method)));
            const apiMethod: any = api[method];
            const query: SahiElementQuery = {
              locator: By.css("#btn"),
              identifier: 0,
              relations: [],
            };
            await api._mouseDown(query);
            if (apiMethod.length === 2) {
              await apiMethod(query, combo);
            } else {
              await apiMethod(query, false, combo);
            }
            const out = await driver.findElement(By.css("#out"));
            return expect(out.getText()).resolves.toBe(
              `${method} ${combo}`.trim()
            );
          }
        );
        it.each(<[MouseMethods, string, string][]>[
          ["_rightClick", "contextmenu", ""],
          ["_mouseOver", "mouseover", ""],
          ["_rightClick", "contextmenu", "META|ALT"],
          ["_mouseOver", "mouseover", "META"],
        ])(
          "%s should invoke native event %s with '%s' pressed",
          async (method: MouseMethods, nativeEvent: string, combo: string) => {
            const api = createApi(driver);
            await driver.get(mockHtml(htmlSnippet(nativeEvent, method)));
            const apiMethod: (...args: any) => Promise<void> = api[method];
            const query: SahiElementQuery = {
              locator: By.css("#btn"),
              identifier: 0,
              relations: [],
            };
            await apiMethod(query, combo);
            const out = await driver.findElement(By.css("#out"));
            return expect(out.getText()).resolves.toBe(
              `${method} ${combo}`.trim()
            );
          }
        );
        it.each(<[MouseMethods, string, string][]>[
          ["_mouseDown", "mousedown", ""],
          ["_mouseDown", "mousedown", "ALT"],
        ])(
          "%s should invoke native event %s with '%s' pressed",
          async (method: MouseMethods, nativeEvent: string, combo: string) => {
            const api = createApi(driver);
            await driver.get(mockHtml(htmlSnippet(nativeEvent, method)));
            const apiMethod: (...args: any) => Promise<void> = api[method];
            const query: SahiElementQuery = {
              locator: By.css("#btn"),
              identifier: 0,
              relations: [],
            };
            await apiMethod(query, false, combo);
            const out = await driver.findElement(By.css("#out"));
            return expect(out.getText()).resolves.toBe(
              `${method} ${combo}`.trim()
            );
          }
        );

        it.each(<[MouseMethods, string, string][]>[
          ["_click", "click", ""],
          ["_click", "click", "META|ALT"],
        ])(
          "%s should invoke native event %s with '%s' pressed",
          async (method: MouseMethods, nativeEvent: string, combo: string) => {
            const api = createApi(driver);
            await driver.get(mockHtml(htmlSnippet(nativeEvent, method)));
            const apiMethod: any = api[method];
            const query: SahiElementQuery = {
              locator: By.css("#btn"),
              identifier: 0,
              relations: [],
            };
            await apiMethod(query, combo);

            //await new Promise(res => setTimeout(res, 2500));
            const out = await driver.findElement(By.css("#out"));
            return expect(out.getText()).resolves.toBe(
              `${method} ${combo}`.trim()
            );
          }
        );
      });

      describe("_[un]Check", () => {
        it.each(<
          [
            "_check" | "_uncheck",
            "checkbox" | "radio",
            "checked" | "",
            "true" | null
          ][]
        >[
          ["_check", "checkbox", "", "true"],
          ["_check", "checkbox", "checked", "true"],
          ["_uncheck", "checkbox", "checked", null],
          ["_uncheck", "checkbox", "", null],
          ["_check", "radio", "", "true"],
          ["_uncheck", "radio", "checked", "true"],
        ])(
          "should perform %s on input[type=\"%s\"][%s] and expect state to be '%s'",
          async (
            method: "_check" | "_uncheck",
            type: "checkbox" | "radio",
            checkedAttribute: "checked" | "",
            expected: "true" | null
          ) => {
            const api = createApi(driver);
            const apiMethod = api[method];
            const html = `
                  <input type="${type}" id="input" ${checkedAttribute}>
                `;
            console.log(html);
            await driver.get(mockHtml(html));
            await apiMethod({
              locator: By.css("#input"),
              identifier: 0,
              relations: [],
            });
            const unchecked = driver.findElement(By.css("#input"));
            return expect(unchecked.getAttribute("checked")).resolves.toEqual(
              expected
            );
          }
        );
      });

      describe.skip("dragDrop", () => {
        it("should drag #a to #b", async () => {
          const { _dragDrop } = createApi(driver);
          await driver.get(
            mockHtml(`
                <!-- From: https://www.w3schools.com/html/tryit.asp?filename=tryhtml5_draganddrop -->
                <style>
                #div1 {
                  width: 350px;
                  height: 70px;
                  padding: 10px;
                  border: 1px solid #aaaaaa;
                }
                #drag1 {
                  width: 200px;
                  height: 50px;
                  border: 1px solid black;
                  background-color: yellow;
                }
                </style>
                <div id="div1" ondrop="drop(event)" ondragover="allowDrop(event)"></div>
                <br>
                <div id="drag1" draggable="true" ondragstart="drag(event)" width="336" height="69"></div>
                <div id="out"></div>
                <script>
                function allowDrop(ev) {
                  ev.preventDefault();
                }

                function drag(ev) {
                  ev.dataTransfer.setData("text", ev.target.id);
                }

                function drop(ev) {
                  ev.preventDefault();
                  var data = ev.dataTransfer.getData("text");
                  ev.target.appendChild(document.getElementById(data));
                  document.getElementById('out').innerText = 'dropped'
                }
                </script>
            `)
          );
          await _dragDrop(
            { locator: By.css("#drag1"), identifier: 0, relations: [] },
            { locator: By.css("#div1"), identifier: 0, relations: [] }
          );
          await expect(
            driver.findElement(By.css("#out")).getText()
          ).resolves.toBe("dropped");
        });
      });

      it("should click radio button with fat box above", async () => {
        //GIVEN
        const iframeContent = mockHtml(`
                <style>            
                    .modal-content {
                        /* margin top-bottom and border are the problem */
                        margin: 350px auto; 
                        border: 15px solid #000;
                        width: 100%;
                    }
                </style>
                <form>
                    <div class="modal-content"></div>
                    <input id="AnnahmeJaNeintrue" type="radio" value="true">
                    <label for="AnnahmeJaNeintrue">Ja</label>
                </form>`);

        await driver.get(
          mockHtml(`
                <iframe src="${iframeContent}" style="height: 1458px; width: 100%;"></iframe>
            `)
        );

        const { _click } = createApi(driver);
        const query: SahiElementQuery = {
          locator: By.id("AnnahmeJaNeintrue"),
          identifier: 0,
          relations: [],
        };
        await driver.switchTo().frame(0);

        //WHEN
        await _click(query);

        //THEN
        await expect(
          driver.executeScript(
            `return document.getElementById("AnnahmeJaNeintrue").checked`
          )
        ).resolves.toBeTruthy();
      });
    }
  );
});
