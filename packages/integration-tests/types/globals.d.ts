import {TestCase as TTestCase} from "@sakuli/legacy/dist/context/legacy-dsl.interface";
import {ThenableWebDriver} from "selenium-webdriver";

declare global {
    const driver: ThenableWebDriver;

}
