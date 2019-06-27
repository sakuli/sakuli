import {Builder} from "selenium-webdriver";
import {Project} from "@sakuli/core";
import {Browsers} from "./create-driver-from-project.function";
import {ChromeProperties} from "./chrome-properties.class";
import {chromeOptionsFactory} from "./chrome-options-factory.function";
import {EdgeProperties} from "./edge-properties.class";
import {edgeOptionsFactory} from "./edge-options-factory.function";
import {IeProperties} from "./ie-properties.class";
import {FirefoxProperties} from "./firefox-properties.class";
import {firefoxOptionsFactory} from "./firefox-options-factory.function";
import {ieOptionsFactory} from "./ie-options-factory.function";


export const applyBrowserOptions = (
    browser: Browsers,
    project: Project,
    builder: Builder,
): void => {
    switch (browser) {
        case "chrome": {
            const props = project.objectFactory(ChromeProperties);
            const opts = chromeOptionsFactory(props);
            builder.setChromeOptions(opts);
            break;
        }
        case "edge": {
            const props = project.objectFactory(EdgeProperties);
            const opts = edgeOptionsFactory(props);
            builder.setEdgeOptions(opts);
            break;
        }
        case "firefox": {
            const props = project.objectFactory(FirefoxProperties);
            const opts = firefoxOptionsFactory(props);
            builder.setFirefoxOptions(opts);
            break;
        }
        case "ie": {
            const props = project.objectFactory(IeProperties);
            const opts = ieOptionsFactory(props);
            builder.setIeOptions(opts);
            break;
        }
    }
};