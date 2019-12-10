import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {AccessorUtil} from "./accessor-util.class";
import {By, ThenableWebDriver} from "selenium-webdriver";
import {RelationsResolver} from "../relations";
import {accessorApi, AccessorFunctions} from "./accessor-api";
import {AccessorFunction} from "../api";
import {getTestBrowserList} from "../__mocks__/get-browser-list.function";

jest.setTimeout(15_000);
describe('accessor api', () => {
    describe.each(getTestBrowserList())('%s', (browser: "firefox" | "chrome", local: boolean) => {
        let env: TestEnvironment;
        const api = accessorApi();

        function createAccessorUtil(driver: ThenableWebDriver) {
            const ctx = createTestExecutionContextMock();
            return new AccessorUtil(driver, ctx, new RelationsResolver(driver, ctx))
        }

        let driver: ThenableWebDriver;
        let au: AccessorUtil;
        beforeAll(async () => {
            env = createTestEnv(browser, local);
            await env.start();
            const e = await env.getEnv();
            driver = e.driver;
            au = createAccessorUtil(driver);
        });

        afterAll(async () => await env.stop());

        describe('generic accessor api', () => {
            it('should select an active element', async () => {
                const {driver} = await env.getEnv();
                const au = createAccessorUtil(driver);
                await driver.get(mockHtml(`
                <form>
                  <input type="text" id="focused" />
                </form>
            `));
                await driver.findElement(By.css('#focused')).then(e => e.click());
                const ae = await au.fetchElement(api._activeElement());
                return expect(ae.getAttribute('id')).resolves.toBe('focused');
            });

            it('should select an element _byId', async () => {
                const {driver} = await env.getEnv();
                const au = createAccessorUtil(driver);
                await driver.get(mockHtml(`
                <ul>
                  <li>Water</li>
                  <li id="by-id">Beer</li>
                  <li>Wine</li>
                </ul>                
            `));
                const e = await au.fetchElement(api._byId('by-id'));
                return expect(e.getText()).resolves.toBe('Beer');
            });

            it('should select an element _byText', async () => {
                const {driver} = await env.getEnv();
                const au = createAccessorUtil(driver);
                await driver.get(mockHtml(`
                <ul>
                  <li>Water</li>
                  <li>Beer</li>
                  <li>Wine</li>
                </ul>
            `));
                const e = await au.fetchElement(api._byText('Beer', 'li'));
                return expect(e.getText()).resolves.toBe('Beer');
            });

            it('should select an element _byClassName', async () => {
                const {driver} = await env.getEnv();
                const au = createAccessorUtil(driver);
                await driver.get(mockHtml(`
                <ul>
                  <li>Water</li>
                  <li class="beer">Beer</li>
                  <li>Wine</li>
                </ul>
            `));
                const e = await au.fetchElement(api._byClassName('beer', 'li'));
                return expect(e.getText()).resolves.toBe('Beer');
            });

            it('should select an element _byXPath', async () => {
                const {driver} = await env.getEnv();
                const au = createAccessorUtil(driver);
                await driver.get(mockHtml(`
                <ul>
                  <li>Water</li>
                  <li id="by-id">Beer</li>
                  <li>Wine</li>
                </ul>
            `));
                const e = await au.fetchElement(api._byXPath('//ul/li[2]'));
                return expect(e.getText()).resolves.toBe('Beer');
            });
        });

        describe('generic element accessor functions', () => {

            beforeAll(async () => {
                await driver.get(mockHtml(`
                <form>
                  <input id="_textbox-without-type" />
                  <input type="password" id="_password" />
                  <input type="text" id="_textbox" />
                  <input type="hidden" id="_hidden" />
                  <input type="date" id="_datebox" />
                  <input type="datetime" id="_datetimebox" />
                  <input type="datetime-local" id="_datetimelocalbox" />
                  <input type="email" id="_emailbox" />
                  <input type="month" id="_monthbox" />
                  <input type="number" id="_numberbox" />
                  <input type="range" id="_rangebox" />
                  <input type="search" id="_searchbox" />
                  <input type="tel" id="_telephonebox" />
                  <input type="time" id="_timebox" />
                  <input type="url" id="_urlbox" />
                  <input type="week" id="_weekbox" />
                  <textarea id="_textarea"></textarea>
                  <button id="_button"></button>
                  <input type="button" id="_input-type-button"/>
                  <input type="checkbox" id="_checkbox">
                  <input type="checkbox" id="_checkbox">
                  <input type="radio" id="_radio">
                  <input type="submit" id="_submit">
                  <input type="reset" id="_reset">
                  <input type="image" id="_imageSubmitButton" alt="nothing here">
                  <select id="_select">
                    <option id="_option"></option>
                  </select>
                  <input type="file" id="_file">
                </form>
                <table id="_table">
                  <tr id="_row">
                    <th id="_tableHeader"></th>
                  </tr>
                  <tr>
                    <td id="_cell"></td>                
                  </tr>
                </table>
                <a href="#" id="_link">Link</a>
                <img src="#" id="_image" />
                <label for="_textbox" id="_label">
                  Label
                </label>
                <ul id="_list">
                  <li id="_listItem"></li>
                  <li></li>
                </ul>
                <div id="_div">Content</div>
                <span id="_span">content2</span>
                <fieldset id="_fieldset"></fieldset>
                <h1 id="_heading1"></h1>
                <h2 id="_heading2"></h2>
                <h3 id="_heading3"></h3>
                <h4 id="_heading4"></h4>
                <h5 id="_heading5"></h5>
                <h6 id="_heading6"></h6>
                <area shape="circle" coords="12" href="#" alt="nothing" id="_area">
                <map name="map1" id="_map"></map>
                <p id="_paragraph"></p>
                <i id="_italic"></i>
                <em id="_emphasis"></em>
                <b id="_bold"></b>
                <strong id="_strong"></strong>
                <pre id="_preformatted"></pre>
                <code id="_code"></code>
                <blockquote id="_blockquote"></blockquote>
                <canvas id="_canvas"></canvas>
                <abbr title="Short for this" id="_abbr">Long for that</abbr>
                <hr id="_hr" />
                <iframe src="data:text/html;base64, " id="_iframe" frameborder="0"></iframe>
                <iframe src="data:text/html;base64, " id="_rte" frameborder="0"></iframe>
                <frameset>
                  <frame id="_frame">
                </frameset>
                <object data="" type="" id="_object"></object>
                <embed src="data:text/plain;base64, " type="" id="_embed">
                <dl id="_dList">
                  <dt id="_dTerm"></dt>
                  <dd id="_dDesc"></dd>
                </dl>
                <font id="_font"></font>
                <svg>
                  <rect id="_svg_rect" height="10" width="10"></rect>
                  <tspan id="_svg_tspan"></tspan>
                  <circle id="_svg_circle" r="4"></circle>
                  <ellipse id="_svg_ellipse" rx="1" ry="5"></ellipse>
                  <line id="_svg_line"></line>
                  <polygon id="_svg_polygon" points="1"></polygon>
                  <polyline id="_svg_polyline" points="1"></polyline>
                  <path id="_svg_path" d="1"></path>
                  <text id="_svg_text"></text>
                </svg>
                <article id="_article"></article>
                <aside id="_aside"></aside>
                <details id="_details"></details>
                <figcaption id="_figcaption"></figcaption>
                <figure id="_figure"></figure>
                <footer id="_footer"></footer>
                <header id="_header"></header>
                <main id="_main"></main>
                <mark id="_mark"></mark>
                <nav id="_nav"></nav>
                <section id="_section"></section>
                <summary id="_summary"></summary>
                <time id="_time"></time>
                <video src="" id="_video"></video>
            `));
            });

            const testTriple = (fn:AccessorFunctions, index: number = 0, expectedId: string = fn): [AccessorFunctions, number, string] => [fn, index, expectedId];
            it.each(<Array<[AccessorFunctions, number, string | undefined]>>[
                testTriple('_password'),
                testTriple('_textbox', 0, '_textbox-without-type'),
                testTriple('_textbox', 1),
                testTriple('_hidden'),
                testTriple('_datebox'),
                testTriple('_datetimebox'),
                testTriple('_datetimelocalbox'),
                testTriple('_emailbox'),
                testTriple('_monthbox'),
                testTriple('_numberbox'),
                testTriple('_rangebox'),
                testTriple('_searchbox'),
                testTriple('_telephonebox'),
                testTriple('_timebox'),
                testTriple('_urlbox'),
                testTriple('_weekbox'),
                testTriple('_textarea'),
                testTriple('_button', 0, '_button'),
                testTriple('_button', 1, '_input-type-button'),
                testTriple('_checkbox'),
                testTriple('_radio'),
                testTriple('_submit'),
                testTriple('_reset'),
                testTriple('_imageSubmitButton'),
                testTriple('_select'),
                testTriple('_option'),
                testTriple('_file'),
                testTriple('_table'),
                testTriple('_row'),
                testTriple('_cell'),
                testTriple('_tableHeader'),
                testTriple('_link'),
                testTriple('_image'),
                testTriple('_label'),
                testTriple('_listItem'),
                testTriple('_list'),
                testTriple('_div'),
                testTriple('_span'),
                testTriple('_fieldset'),
                testTriple('_heading1'),
                testTriple('_heading2'),
                testTriple('_heading3'),
                testTriple('_heading4'),
                testTriple('_heading5'),
                testTriple('_heading6'),
                testTriple('_area'),
                testTriple('_map'),
                testTriple('_paragraph'),
                testTriple('_italic'),
                testTriple('_emphasis'),
                testTriple('_bold'),
                testTriple('_strong'),
                testTriple('_preformatted'),
                testTriple('_code'),
                testTriple('_blockquote'),
                testTriple('_canvas'),
                testTriple('_abbr'),
                testTriple('_hr'),
                testTriple('_iframe'),
                testTriple('_rte', 1),
                //testTriple(/['_frame'),
                testTriple('_object'),
                testTriple('_embed'),
                testTriple('_dList'),
                testTriple('_dTerm'),
                testTriple('_dDesc'),
                testTriple('_font'),
                testTriple('_svg_rect'),
                testTriple('_svg_tspan'),
                testTriple('_svg_circle'),
                testTriple('_svg_ellipse'),
                testTriple('_svg_line'),
                testTriple('_svg_polygon'),
                testTriple('_svg_polyline'),
                testTriple('_svg_path'),
                testTriple('_svg_text'),
                testTriple('_article'),
                testTriple('_aside'),
                testTriple('_details'),
                testTriple('_figcaption'),
                testTriple('_figure'),
                testTriple('_footer'),
                testTriple('_header'),
                testTriple('_main'),
                testTriple('_mark'),
                testTriple('_nav'),
                testTriple('_section'),
                testTriple('_summary'),
                testTriple('_video'),
            ])('should find element with %s(%i)', async (
                method: AccessorFunctions,
                sahiIndex: number,
                expectedId: string | undefined
            ) => {
                expectedId = typeof expectedId === "string" ? expectedId : method;
                const accessor: AccessorFunction = api[method];
                const ae = await au.fetchElement(accessor(sahiIndex));
                expect(ae).toBeDefined();
                await expect(ae.getAttribute('id')).resolves.toBe(expectedId);
            });
        });
    });
});