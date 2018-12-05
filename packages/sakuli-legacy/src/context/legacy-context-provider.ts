import { ContextProvider } from "@sakuli/core/dist";
import { LegacyProject } from "../loader/legacy-project.class";
import webdriver, { Capabilities} from 'selenium-webdriver';
import {throwIfAbsent, Maybe, ifPresent} from "@sakuli/commons";
import {TestCase} from "./common/test-case.class";
import {Application} from "./common/application.class";
import {Key} from "./common/key.class";
import {Environment} from "./common/environment.class";

export class LegacyContextProvider implements ContextProvider {

    capabilityMap: {[key:string]: () => Capabilities} = {
        'chrome': () => Capabilities.chrome(),
        'firefox': () => Capabilities.firefox(),
        'edge': () => Capabilities.edge(),
        'safari': () => Capabilities.safari(),
        'ie': () => Capabilities.ie(),
        'phantomjs': () => Capabilities.phantomjs(),
        'htmlunit': () => Capabilities.htmlunit(),
        'htmlunitwithjs': () => Capabilities.htmlunitwithjs(),
    };
    driver: Maybe<webdriver.ThenableWebDriver> = null;

    constructor(
        readonly builder: webdriver.Builder
    ) { }

    tearUp(project: LegacyProject): void {
        const browser: keyof webdriver.Capabilities = <any>project.properties.testsuiteBrowser;
        const caps = throwIfAbsent(this.capabilityMap[browser], Error(`${browser} is not a valid browser`));
        this.driver = this.builder.withCapabilities(caps)
            .forBrowser(browser)
            .build();
    }

    tearDown(): void {
        ifPresent(this.driver, driver => driver.quit());
    }

    getContext() {
        return ({
            TestCase,
            Application,
            Key,
            Environment
        })
    }


}