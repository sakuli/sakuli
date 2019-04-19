import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {By, ThenableWebDriver} from "selenium-webdriver";
import {mouseActionApi} from "./mouse-actions-api.function";
import {AccessorUtil} from "../accessor";
import {RelationsResolver} from "../relations";
import {actionApi} from "./action-api.function";

jest.setTimeout(15_000);
describe('mouse-actions', () => {

    let env: TestEnvironment;
    let driver: ThenableWebDriver;
    beforeAll(async () => {
        env = createTestEnv("chrome");
        await env.start();
        driver = (await env.getEnv()).driver;
    });

    function createApi(driver: ThenableWebDriver) {
        const ctx = createTestExecutionContextMock();
        return mouseActionApi(driver,
            new AccessorUtil(
                driver,
                ctx,
                new RelationsResolver(driver, ctx)
            ),
            ctx
        )
    }

    afterAll(async () => {
        await env.stop();
    });

    describe('_setSelected', () => {
        it.each(<(number | string)[]>[
            'Beer',
            2,
            'v_beer'
        ])
        ('should select option #beer by identifier %s', async (selector: number | string) => {
            const {_setSelected} = createApi(driver);
            await driver.get(mockHtml(`
                    <select>
                        <option value="v_coffee">Coffee</option>
                        <option value="v_tea">Tea</option>
                        <option id="beer" value="v_beer">Beer</option>
                        <option id="water" value="v_water">Water</option>                
                    </select>
                `));
            await _setSelected({
                relations: [],
                identifier: 0,
                locator: By.css('select')
            }, selector);
            const selectedOption = await driver.findElement(By.css('#beer'));
            return expect(selectedOption.isSelected()).resolves.toBeTruthy();
        });
    });

    describe('mouse interaction', () => {
        type MouseMethods = "_click" | "_rightClick" | "_mouseOver" | "_mouseUp" | "_mouseDown";
        it.each(<[MouseMethods, string, string][]>[
            ['_click', 'click', ""],
            ['_rightClick', 'contextmenu', ""],
            ['_mouseOver', 'mouseover', ""],
            ['_mouseUp', 'mouseup', ""],
            ['_mouseDown', 'mousedown', ""],
            ['_click', 'click', "CTRL"],
            ['_click', 'click', "META|ALT"],
            ['_rightClick', 'contextmenu', "META|ALT"],
            ['_mouseOver', 'mouseover', "META"],
            ['_mouseUp', 'mouseup', "SHIFT|ALT"],
            ['_mouseDown', 'mousedown', "ALT"],
        ])('%s should invoke native event %s with %s pressed', async (method: MouseMethods, nativeEvent: string, combo: string) => {
            const api = createApi(driver);
            await driver.get(mockHtml(`
            <button id="btn">Click Me</button>
            <div id="out"></div>
            <script >
              const $$ = document.getElementById.bind(document);
              const btn = $$('btn');
              const out = $$('out');
              btn.addEventListener('${nativeEvent}', e => {
                  const keyAddon = [];
                  if(e.ctrlKey) keyAddon.push('CTRL');
                  if(e.metaKey) keyAddon.push('META');
                  if(e.shiftKey) keyAddon.push('SHIFT');
                  if(e.altKey) keyAddon.push('ALT');
                  out.innerHTML = '${method} ' + keyAddon.join("|");
              });
            </script>
        `));
            const apiMethod: any = api[method];
            if (apiMethod.length === 2) {
                await apiMethod({
                        locator: By.css('#btn'),
                        identifier: 0,
                        relations: []
                    },
                    combo);
            } else {
                await apiMethod({
                        locator: By.css('#btn'),
                        identifier: 0,
                        relations: []
                    },
                    false,
                    combo);
            }

            const out = await driver.findElement(By.css('#out'));
            return expect(out.getText()).resolves.toBe(`${method} ${combo}`.trim());
        });
    });

    describe('_[un]Check', () => {
        it.each(<['_check' | "_uncheck", "checkbox" | "radio", "checked" | "", "true" | null][]>[
            ['_check', 'checkbox', '', 'true'],
            ['_check', 'checkbox', 'checked', 'true'],
            ['_uncheck', 'checkbox', 'checked', null],
            ['_uncheck', 'checkbox', '', null],
            ['_check', 'radio', '', 'true'],
            ['_uncheck', 'radio', 'checked', 'true'],
        ])('should perform %s on input[type="%s"][%s] and expect state to be %s',
            async (method: "_check" | "_uncheck", type: "checkbox" | "radio", checkedAttribute: "checked" | "", expected: "true" | null) => {
                const api = createApi(driver);
                const apiMethod = api[method];
                const html = `
                  <input type="${type}" id="input" ${checkedAttribute}>
                `;
                console.log(html);
                await driver.get(mockHtml(html));
                await apiMethod({
                    locator: By.css('#input'),
                    identifier: 0,
                    relations: []
                });
                const unchecked = driver.findElement(By.css('#input'));
                return expect(unchecked.getAttribute("checked")).resolves.toEqual(expected);
            });
    });

    describe('dragDrop', () => {

        it.skip('should drag #a to #b', async () => {
            const {_dragDrop} = createApi(driver);
            const {_highlight} = actionApi(driver, new AccessorUtil(driver, createTestExecutionContextMock(), new RelationsResolver(driver, createTestExecutionContextMock())), createTestExecutionContextMock());
            await driver.get(mockHtml(`        
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
                }
                </script>
            `));
            await _highlight({locator: By.css('#div1'), identifier: 0, relations: []});
            await _dragDrop(
                {locator: By.css('#drag1'), identifier: 0, relations: []},
                {locator: By.css('#div1'), identifier: 0, relations: []}
            );
            await new Promise(res => setTimeout(res, 2000));
            const el = await driver.findElement(By.css('#div1'));
            return expect(el.findElement(By.css('img'))).resolves.toBeDefined();
        });
    });
});