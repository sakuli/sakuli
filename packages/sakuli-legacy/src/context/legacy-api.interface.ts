import { SahiApi } from "./sahi/sahi-api.interface";
import { CommonApi } from "./common/common-api.interface";
import { ThenableWebDriver } from "selenium-webdriver";
import { TestExecutionContext } from "@sakuli/core";

export interface LegacyApi extends SahiApi, CommonApi {
  /**
   * Instance of [ThenableWebDriver](https://seleniumhq.github.io/selenium/docs/api/javascript/module/selenium-webdriver/index_exports_ThenableWebDriver.html).
   * Can execute any native method of webdriver. It's not recommended to use it in a testcase.
   *
   */
  driver: ThenableWebDriver;

  /**
   * A relic from Sahi, just defined to ensure backward compatibility
   */
  $includeFolder: string;

  /**
   * The current [TestExecutionContext](../../../sakuli-core/classes/testexecutioncontext) provided by Sakuli runtime
   * this is usually not needed in a Testcase.
   */
  context: TestExecutionContext;
}
