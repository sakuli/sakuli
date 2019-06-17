import {SahiApi} from "./sahi/sahi-api.interface";
import {CommonApi} from "./common/common-api.interface";
import {ThenableWebDriver} from "selenium-webdriver";
import {TestExecutionContext} from "@sakuli/core";

export interface LegacyApi extends SahiApi, CommonApi {
    driver: ThenableWebDriver,
    $includeFolder: string,
    context: TestExecutionContext
}