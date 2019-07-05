import {Options as EdgeOptions} from "selenium-webdriver/edge";
import {EdgeProperties} from "./edge-properties.class";
import {ifPresent} from "@sakuli/commons";

export const edgeOptionsFactory = (
    properties: EdgeProperties,
) => {
    const opts = new EdgeOptions();

    ifPresent(properties.proxy, prop => {
        opts.setProxy(prop)
    });

    return opts;
};