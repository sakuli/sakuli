import {ChromeProperties} from "./chrome-properties.class";
import {Options as ChromeOptions} from "selenium-webdriver/chrome";
import {ifPresent} from "@sakuli/commons";

export const chromeOptionsFactory = (
    properties: ChromeProperties,
) => {
    const opts = new ChromeOptions();

    ifPresent(properties.arguments, prop => {
        opts.addArguments(...prop)
    });

    ifPresent(properties.headless, () => {
        opts.headless();
    });

    ifPresent(properties.windowSizeHeight, height => {
        ifPresent(properties.windowSizeWith, width => {
            opts.windowSize({height, width});
        })
    });

    ifPresent(properties.excludeSwitches, prop => {
        opts.excludeSwitches(...prop)
    });

    ifPresent(properties.extensions, prop => {
        opts.addExtensions(...prop)
    });

    ifPresent(properties.binaryPath, prop => {
        opts.setChromeBinaryPath(prop);
    });

    ifPresent(properties.userPreferences, prop => {
        opts.setUserPreferences(prop);
    });

    ifPresent(properties.loggingPrefs, props => {
        opts.setPerfLoggingPrefs(props);
    });

    return opts;
};