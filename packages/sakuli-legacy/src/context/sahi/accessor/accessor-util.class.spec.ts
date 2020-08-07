import { By, ThenableWebDriver, WebElement } from "selenium-webdriver";
import { createTestEnv, mockHtml, TestEnvironment } from "../__mocks__";
import { createTestExecutionContextMock } from "../../__mocks__";
import { AccessorUtil } from "./accessor-util.class";
import { RelationsResolver } from "../relations";
import { TestExecutionContext } from "@sakuli/core";
import { getTestBrowserList } from "../__mocks__/get-browser-list.function";

jest.setTimeout(15_000);
describe("AccessorUtil", () => {
  describe.each(getTestBrowserList())(
    "%s",
    (browser: "firefox" | "chrome", local: boolean) => {
      let env: TestEnvironment;
      let accessorUtil: AccessorUtil;
      let driver: ThenableWebDriver;
      let testExecutionContext: TestExecutionContext;
      beforeAll(async () => {
        env = createTestEnv(browser, local);
        await env.start();
        driver = (await env.getEnv()).driver;
      });

      beforeEach(async () => {
        testExecutionContext = createTestExecutionContextMock();
        accessorUtil = new AccessorUtil(
          driver,
          testExecutionContext,
          new RelationsResolver(driver, testExecutionContext)
        );
      });

      afterAll(async () => {
        await env.stop();
      });

      it("should fetch an element by regex string", async () => {
        await driver.get(
          mockHtml(`
             <div id="eins">
                Some Text content
             </div>
             <div id="zwei">
                Some Text
             </div>
            `)
        );
        const elements = await driver.findElements(By.css("div"));
        const elems = await accessorUtil.getByString(elements, "/content/");
        return expect(
          Promise.all(elems.map((e) => e.getAttribute("id")))
        ).resolves.toEqual(["eins"]);
      });

      it("should fetch an element by string", async () => {
        await driver.get(
          mockHtml(`
             <div id="zwei">
                Some Text content
             </div>
             <div id="drei">
                Some Text
             </div>
            `)
        );
        const elements = await driver.findElements(By.css("div"));
        const elems = await accessorUtil.getByString(elements, "Some Text");
        return expect(
          Promise.all(elems.map((e) => e.getAttribute("id")))
        ).resolves.toEqual(["drei"]);
      });

      it("should fetch an element by string where element string is padded by whitespace", async () => {
        await driver.get(
          mockHtml(
            "<div id='zwei'>Some Text content</div><div id='drei'> Some Text </div>"
          )
        );
        const elements = await driver.findElements(By.css("div"));
        const elems = await accessorUtil.getByString(elements, "Some Text");
        return expect(
          Promise.all(elems.map((e) => e.getAttribute("id")))
        ).resolves.toEqual(["drei"]);
      });

      it("should return an empty array when searching for a non existing element by regex", async () => {
        await driver.get(
          mockHtml(`
             <div id="zwei">
                Some Text content
             </div>
             <div id="drei">
                Some Text
             </div>
            `)
        );
        const elements = await driver.findElements(By.css("div"));
        const elems = await accessorUtil.getByString(
          elements,
          "/Some non existent content/"
        );
        return expect(elems).toEqual([]);
      });

      it("should fetch fuzzy matching identifiers from element", async () => {
        await driver.get(
          mockHtml(`
             <div
                id="element-to-test"
                aria-describedby="aria"
                class="so many names"
                name="my-name-is-earl"
              >Some Text content</div>
            `)
        );
        const element = await driver.findElement(By.id("element-to-test"));
        const identifiers = await accessorUtil.getStringIdentifiersForElement([
          element,
        ]);
        expect(identifiers.length).toBe(1);
        const [matches] = identifiers;
        expect(matches[0]).toEqual(expect.any(WebElement));
        expect(matches[1]).toEqual([
          "aria",
          "my-name-is-earl",
          "element-to-test",
          "so many names",
          "Some Text content",
          null,
          null,
        ]);
      });

      it("should fetch img src for fuzzy matching", async () => {
        await driver.get(
          mockHtml(`
             <img
                src="https://www.consol.de/fileadmin/images/svg/consol-logo.svg"
                id="element-to-test"
                aria-describedby="aria"
                class="so many names"
                name="my-name-is-earl"/>
            `)
        );
        const element = await driver.findElement(By.id("element-to-test"));
        const identifiers = await accessorUtil.getStringIdentifiersForElement([
          element,
        ]);
        expect(identifiers.length).toBe(1);
        const [matches] = identifiers;
        expect(matches[0]).toEqual(expect.any(WebElement));
        expect(matches[1]).toEqual([
          "aria",
          "my-name-is-earl",
          "element-to-test",
          "so many names",
          "",
          null,
          "https://www.consol.de/fileadmin/images/svg/consol-logo.svg",
        ]);
      });

      it("should fetch button value for fuzzy matching", async () => {
        await driver.get(
          mockHtml(`
             <button
                value="foo"
                id="element-to-test"
                aria-describedby="aria"
                class="so many names"
                name="my-name-is-earl"
                >button text</button>
            `)
        );
        const element = await driver.findElement(By.id("element-to-test"));
        const identifiers = await accessorUtil.getStringIdentifiersForElement([
          element,
        ]);
        expect(identifiers.length).toBe(1);
        const [matches] = identifiers;
        expect(matches[0]).toEqual(expect.any(WebElement));
        expect(matches[1]).toEqual([
          "aria",
          "my-name-is-earl",
          "element-to-test",
          "so many names",
          "button text",
          "foo",
          null,
        ]);
      });

      it("should filter non displayed elements", async () => {
        await driver.get(
          mockHtml(`
          <div id="visibility-hidden" style="visibility: hidden">ABC</div>
          <div id="display-none" style="display: none;">ABC</div>
          <div id="normal">ABC</div>
          <div id="out-of-viewport" style="position: absolute; top: 1000px; right: 10px">ABC</div>
          <div id="no-content-not-displayed"></div>
        `)
        );
        const divs = await accessorUtil.findElements(By.css("div"));
        return expect(
          Promise.all(divs.map((e) => e.getAttribute("id")))
        ).resolves.toEqual([
          "visibility-hidden",
          "display-none",
          "normal",
          "out-of-viewport",
          "no-content-not-displayed",
        ]);
      });

      it("should identify an element by string index", async () => {
        await driver.get(
          mockHtml(`
            <div id="div-1">D1</div>
            <div id="div-2">D1</div>
            <div id="div-3">D1</div>
        `)
        );
        const div = await accessorUtil.fetchElement({
          locator: By.css("div"),
          identifier: "D1[1]",
          relations: [],
        });
        expect(testExecutionContext.logger.debug).toHaveBeenCalledTimes(2);
        return expect(div.getAttribute("id")).resolves.toBe("div-2");
      });

      it("should reduce elements list by sahi class", async () => {
        await driver.get(
          mockHtml(`
            <div></div>
            <div class="test-class"></div>
            <div class="cls-1 test-class cls-2"></div>
        `)
        );
        const allDivs = await driver.findElements(By.css("div"));
        const divWithTestClass = await accessorUtil.getElementBySahiClassName(
          allDivs,
          { className: "test-class" }
        );
        return expect(divWithTestClass.length).toBe(2);
      });

      it("should find by classname", async () => {
        await driver.get(
          mockHtml(`
            <div>D1</div>
            <div class="test-class">D2</div>
            <div class="cls-1 test-class cls-2">D3</div>
        `)
        );
        const divWithTestClass = await accessorUtil.fetchElement({
          locator: By.css("div"),
          identifier: { className: "test-class" },
          relations: [],
        });
        return expect(divWithTestClass.getText()).resolves.toBe("D2");
      });

      it("should find by classname and sahiText", async () => {
        await driver.get(
          mockHtml(`
            <div>D1</div>
            <div class="test-class">D2</div>
            <div class="cls-1 test-class cls-2">D3</div>
        `)
        );
        const divWithTestClass = await accessorUtil.fetchElement({
          locator: By.css("div"),
          identifier: { className: "test-class", sahiText: "D3" },
          relations: [],
        });
        return expect(divWithTestClass.getText()).resolves.toBe("D3");
      });

      it("should find by text with reserved regexp characters", async () => {
        await driver.get(
          mockHtml(`
            <div>Price (EUR)</div>
            <div>Name</div>
        `)
        );
        const div = await accessorUtil.fetchElement({
          locator: By.css("div"),
          identifier: "Price (EUR)",
          relations: [],
        });
        return expect(div).toBeDefined();
      });

      it("should find an element by RegExp syntax", async () => {
        await driver.get(
          mockHtml(`
                <div>
                  <span id="m-1">Maintenance</span>
                  <span>Maintenance</span>
                  <span>Maintenance</span>
                </div>
            `)
        );

        const span = await accessorUtil.fetchElement({
          locator: By.css("span"),
          identifier: "/aintenance/",
          relations: [],
        });

        await expect(span.getAttribute("id")).resolves.toEqual("m-1");
      });

      it("should find an element by RegExp + array accessor syntax", async () => {
        await driver.get(
          mockHtml(`
                <div>
                  <span>Maintenance</span>
                  <span id="m-2">Maintenance</span>
                  <span>Maintenance</span>
                </div>
            `)
        );

        const span = await accessorUtil.fetchElement({
          locator: By.css("span"),
          identifier: "/aintenance/[1]",
          relations: [],
        });

        await expect(span.getAttribute("id")).resolves.toEqual("m-2");
      });

      it("Should reject if element could not be found.", async () => {
        await driver.get(
          mockHtml(`
                <div></div>
            `)
        );

        const fetchElements = accessorUtil.fetchElements({
          locator: By.css("span"),
          identifier: "/aintenance/[1]",
          relations: [],
        });

        await expect(fetchElements).rejects.toThrowError(
          /Cannot find Element within 3000ms by query:.*/
        );
      });
    }
  );
});
