import {createTestEnv, createTestExecutionContextMock, mockHtml, TestEnvironment} from "../__mocks__";
import {AccessorUtil} from "./accessor-util.class";
import {By, ThenableWebDriver} from "selenium-webdriver";
import {RelationsResolver} from "../relations";
import {accessorApi, AccessorFunctions} from "./accessor-api";
import {AccessorFunction} from "../api";
import {throwIfAbsent} from "@sakuli/commons";
import {getTestBrowserList} from "../action/__mocks__/get-browser-list.function";

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


            it.each(<Array<[AccessorFunctions, number]>>[
                ['_password', 0],
                ['_textbox', 0],
                ['_hidden', 0],
                ['_datebox', 0],
                ['_datetimebox', 0],
                ['_datetimelocalbox', 0],
                ['_emailbox', 0],
                ['_monthbox', 0],
                ['_numberbox', 0],
                ['_rangebox', 0],
                ['_searchbox', 0],
                ['_telephonebox', 0],
                ['_timebox', 0],
                ['_urlbox', 0],
                ['_weekbox', 0],
                ['_textarea', 0],
                ['_button', 0],
                ['_checkbox', 0],
                ['_radio', 0],
                ['_submit', 0],
                ['_reset', 0],
                ['_imageSubmitButton', 0],
                ['_select', 0],
                ['_option', 0],
                ['_file', 0],
                ['_table', 0],
                ['_row', 0],
                ['_cell', 0],
                ['_tableHeader', 0],
                ['_link', 0],
                ['_image', 0],
                ['_label', 0],
                ['_listItem', 0],
                ['_list', 0],
                ['_div', 0],
                ['_span', 0],
                ['_fieldset', 0],
                ['_heading1', 0],
                ['_heading2', 0],
                ['_heading3', 0],
                ['_heading4', 0],
                ['_heading5', 0],
                ['_heading6', 0],
                ['_area', 0],
                ['_map', 0],
                ['_paragraph', 0],
                ['_italic', 0],
                ['_emphasis', 0],
                ['_bold', 0],
                ['_strong', 0],
                ['_preformatted', 0],
                ['_code', 0],
                ['_blockquote', 0],
                ['_canvas', 0],
                ['_abbr', 0],
                ['_hr', 0],
                ['_iframe', 0],
                ['_rte', 1],
                //['_frame', 0], somehow selenium is not able to select frame elements by css selector... :(
                ['_object', 0],
                ['_embed', 0],
                ['_dList', 0],
                ['_dTerm', 0],
                ['_dDesc', 0],
                ['_font', 0],
                ['_svg_rect', 0],
                ['_svg_tspan', 0],
                ['_svg_circle', 0],
                ['_svg_ellipse', 0],
                ['_svg_line', 0],
                ['_svg_polygon', 0],
                ['_svg_polyline', 0],
                ['_svg_path', 0],
                ['_svg_text', 0],
                ['_article', 0],
                ['_aside', 0],
                ['_details', 0],
                ['_figcaption', 0],
                ['_figure', 0],
                ['_footer', 0],
                ['_header', 0],
                ['_main', 0],
                ['_mark', 0],
                ['_nav', 0],
                ['_section', 0],
                ['_summary', 0],
                ['_video', 0],
            ])('should find element with %s(%i)', async (
                method: AccessorFunctions,
                sahiIndex: number,
            ) => {
                const accessor: AccessorFunction = api[method];
                const ae = await au.fetchElement(accessor(sahiIndex));
                return expect(ae.getAttribute('id')).resolves.toBe(method);
            });
        });
    });
});