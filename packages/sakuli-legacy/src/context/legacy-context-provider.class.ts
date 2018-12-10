import { ContextProvider } from "@sakuli/core/dist";
import { LegacyProject } from "../loader/legacy-project.class";
import webdriver, {Capabilities, logging, ThenableWebDriver} from 'selenium-webdriver';
import {throwIfAbsent, Maybe, ifPresent} from "@sakuli/commons";
import {TestCase} from "./common/test-case.class";
import {Application} from "./common/application.class";
import {Key} from "./common/key.class";
import {Environment} from "./common/environment.class";
import {SahiApi} from "./sahi/api";

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
        const browser: keyof webdriver.Capabilities = <keyof webdriver.Capabilities>project.properties.testsuiteBrowser;
        const capsProducer = throwIfAbsent(this.capabilityMap[browser], Error(`${browser} is not a valid browser`));
        const caps = capsProducer();
        this.driver = this.builder
            .forBrowser(browser)
            .withCapabilities(caps)
            .build();
    }

    tearDown(): void {
        ifPresent(this.driver, async driver => {
            try {
                await driver.quit()
            } catch (e) {
                console.warn(`Webdriver doesn't quit reliably`, e);
            }
        });
    }

    getContext() {
        const sahi = new SahiApi(throwIfAbsent(this.driver,
            Error('Driver could not be initialized before creating sahi-api-context'))
        );
        return ({
            TestCase,
            Application,
            Key,
            Environment,
            console: console,
            ...sahi
        })
    }


}