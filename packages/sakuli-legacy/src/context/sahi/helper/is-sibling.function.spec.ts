import { By } from "selenium-webdriver";
import { isSibling } from "./is-sibling.function";
import { createTestEnv, mockHtml, TestEnvironment } from "../__mocks__";
import { getTestBrowserList } from "../__mocks__/get-browser-list.function";

jest.setTimeout(100_000);
describe("isSibling", () => {
  describe.each(getTestBrowserList())(
    "%s",
    (browser: "firefox" | "chrome", local: boolean) => {
      let env: TestEnvironment;
      beforeEach(async (done) => {
        env = createTestEnv(browser, local);
        await env.start();
        done();
      });

      afterEach(async (done) => {
        await env.stop();
        done();
      });

      it("should be true", async (done) => {
        const { driver } = await env.getEnv();
        await driver.get(
          mockHtml(`
            <ul>
              <li id="li-0"></li>
              <li id="li-1"></li>
              <li id="li-2"></li>
            </ul>
       `)
        );

        const li0 = await driver.findElement(By.css("#li-0"));
        const li2 = await driver.findElement(By.css("#li-2"));

        await expect(isSibling(li0, li2)).resolves.toBeTruthy();
        done();
      });

      it("should be false", async (done) => {
        const { driver } = await env.getEnv();
        await driver.get(
          mockHtml(`
            <ul>
              <li id="li-0"></li>
              <li id="li-1"></li>
              <li id="li-2"></li>
            </ul>
            <div id="div-0"></div>
       `)
        );

        const li0 = await driver.findElement(By.css("#li-0"));
        const div0 = await driver.findElement(By.css("#div-0"));

        await expect(isSibling(li0, div0)).resolves.toBeFalsy();
        done();
      });
    }
  );
});
