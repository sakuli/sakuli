import { ContextProvider } from "@sakuli/core/dist";
import { LegacyProject } from "../loader/legacy-project.class";
import webdriver, { Capabilities, Builder } from 'selenium-webdriver';
import { throwIfAbsent, Maybe } from "@sakuli/commons";

export class LegacyContextProvider implements ContextProvider {

    capabilityMap: {[key:string]: () => Capabilities} = {
        'chrome': () => Capabilities.chrome(),
        'firefox': () => Capabilities.firefox(),
        'edge': () => Capabilities.edge(),
        'safari': () => Capabilities.safari(),
        'ie': () => Capabilities.ie(),
    } 
    driver: Maybe<webdriver.ThenableWebDriver> = null;

    constructor(
        readonly builder: webdriver.Builder
    ) { }

    tearUp(project: LegacyProject): void {
        const browser: keyof webdriver.Capabilities = <any>project.properties.testsuiteBrowser
        const caps = throwIfAbsent(this.capabilityMap[browser], Error(`${browser} is not a valid browser`));
        this.driver = this.builder.withCapabilities(caps).build();
    }

    tearDown(): void {
    }

    getContext() {
    }


}