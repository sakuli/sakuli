import {Project} from "@sakuli/core";
import {Builder, Capabilities, ThenableWebDriver} from "selenium-webdriver";
import {LegacyProjectProperties} from "../../loader/legacy-project-properties.class";
import {SeleniumProperties} from "./selenium-properties.class";
import {ifPresent, throwIfAbsent} from "@sakuli/commons";
import {applyBrowserOptions} from "./apply-browser-options.function";

export type Browsers = Exclude<keyof typeof Capabilities, "prototype">;
export type CapabilityProducer = () => Capabilities;
export type CapabilityMap = Record<Browsers, CapabilityProducer>;

const defaultCapabilityMap: CapabilityMap = {
    'chrome': () => Capabilities.chrome(),
    'firefox': () => Capabilities.firefox(),
    'edge': () => Capabilities.edge(),
    'safari': () => Capabilities.safari(),
    'ie': () => Capabilities.ie(),
    'phantomjs': () => Capabilities.phantomjs(),
    'htmlunit': () => Capabilities.htmlunit(),
    'htmlunitwithjs': () => Capabilities.htmlunitwithjs(),
    'android': () => Capabilities.android(),
    'iphone': () => Capabilities.iphone(),
    'ipad': () => Capabilities.ipad(),
    'opera': () => Capabilities.opera()
};

export const createDriverFromProject = (
    project: Project,
    builder: Builder = new Builder(),
    capabilityMap: CapabilityMap = defaultCapabilityMap,
): ThenableWebDriver => {

    const properties = project.objectFactory(LegacyProjectProperties);
    const seleniumProperties = project.objectFactory(SeleniumProperties);

    const browser: Browsers = properties.testsuiteBrowser;
    const capsProducer = throwIfAbsent(capabilityMap[browser], Error(`${browser} is not a valid browser`));
    const caps = capsProducer();

    builder
        .forBrowser(browser)
        .withCapabilities(caps);

    ifPresent(seleniumProperties.alertBehaviour, prop => {
        builder.setAlertBehavior(prop);
    });
    ifPresent(seleniumProperties.loggingPrefs, prop => {
        builder.setLoggingPrefs(prop)
    });
    ifPresent(seleniumProperties.proxy, prop => {
        builder.setProxy(prop)
    });
    ifPresent(seleniumProperties.httpAgent, prop => {
        builder.usingHttpAgent(prop)
    });
    ifPresent(seleniumProperties.server, prop => {
        builder.usingServer(prop);
    });

    applyBrowserOptions(browser, project, builder);

    return builder.build();
};

