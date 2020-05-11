import { ThenableWebDriver } from "selenium-webdriver";
import { AccessorUtil } from "../accessor";
import { TestExecutionContext } from "@sakuli/core";

export function alertActionApi(
  driver: ThenableWebDriver,
  accessorUtil: AccessorUtil,
  ctx: TestExecutionContext
) {
  async function _authenticate(user: string, password: string) {
    /*
        const handle = await driver.getWindowHandle();
        const a = await driver.wait(until.alertIsPresent(), 5_000, 'Alert alert');
        //const alert = await driver.switchTo().alert();
        await a.authenticateAs(user, password);
        //await driver.switchTo().window(handle);
        */
    const currentUrl = await driver.getCurrentUrl();
    const url = new URL(currentUrl);
    url.username = user;
    url.password = password;
    return driver.get(url.href);
  }

  return {
    _authenticate,
  };
}
