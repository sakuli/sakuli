import {createTestCaseClass} from "./common/test-case.class";
import {createApplicationClass} from "./common/sakuli-application.class";
import {Key} from "./common/key.class";
import {createEnvironmentClass} from "./common/sakuli-environment.class";
import {createRegionClass} from "./common/sakuli-region.class";
import {createLoggerClass} from "./common/logger.class";
import {ThenableWebDriver} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";
import {SahiApi} from "./sahi/api";

export {TestExecutionContext} from "@sakuli/core";
export {SahiApi} from "./sahi/api";

export type TestCase = ReturnType<typeof createTestCaseClass>
export type Application = ReturnType<typeof createApplicationClass>
export type Key = typeof Key
export type Environment = ReturnType<typeof createEnvironmentClass>
export type Region = ReturnType<typeof createRegionClass>
export type Logger = ReturnType<typeof createLoggerClass>

export interface LegacyDsl extends SahiApi {
    driver: ThenableWebDriver,
    context: TestExecutionContext,
    TestCase: TestCase;
    Application: Application;
    Key: Key;
    Environment: Environment;
    Region: Region;
    Logger: Logger;
}