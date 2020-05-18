import { By } from "selenium-webdriver";
import { ifPresent } from "@sakuli/commons";
import { getParent } from "./get-parent.function";
import { isEqual } from "./is-equal.function";
import { createTestEnv, mockHtml, TestEnvironment } from "../__mocks__";
import { getTestBrowserList } from "../__mocks__/get-browser-list.function";

jest.setTimeout(15_000);
describe("getParent", () => {
  describe.each(getTestBrowserList())(
    "%s",
    (browser: "firefox" | "chrome", local: boolean) => {
      let env: TestEnvironment;

      beforeAll(async (done) => {
        env = createTestEnv(browser, local);
        await env.start();
        done();
      });

      afterAll(async (done) => {
        await env.stop();
        done();
      });

      it("should resolve to a parent", async () => {
        const { driver } = await env.getEnv();
        await driver.get(
          mockHtml(`
            <ul>
              <li>Test 1</li>
              <li>Test 2</li>
              <li>Test 3</li>
              <li>Test 4</li>
            </ul>
        `)
        );
        const li = await driver.findElement(By.css("li"));
        const ul = await driver.findElement(By.css("ul"));
        return ifPresent(
          await getParent(li),
          async (parent) => expect(isEqual(ul, parent)).resolves.toBeTruthy(),
          () => {
            throw Error("No parent on <li>");
          }
        );
      });

      it("should return null if element has no parent", async () => {
        const { driver } = await env.getEnv();
        await driver.get(mockHtml(``));
        return expect(
          getParent(driver.findElement(By.css("html")))
        ).resolves.toBeNull();
      });
    }
  );
});
