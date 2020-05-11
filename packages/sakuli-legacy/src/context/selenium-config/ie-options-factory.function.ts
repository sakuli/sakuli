import { Options as IeOptions } from "selenium-webdriver/ie";
import { IeProperties } from "./ie-properties.class";
import { ifPresent } from "@sakuli/commons";

export const ieOptionsFactory = (properties: IeProperties) => {
  const opts = new IeOptions();

  ifPresent(properties.ignoreZoomSetting, (prop) => {
    opts.ignoreZoomSetting(prop);
  });
  ifPresent(properties.initialBrowserUrl, (prop) => {
    opts.initialBrowserUrl(prop);
  });
  ifPresent(properties.enablePersistentHover, (prop) => {
    opts.enablePersistentHover(prop);
  });
  ifPresent(properties.enableElementCacheCleanup, (prop) => {
    opts.enableElementCacheCleanup(prop);
  });
  ifPresent(properties.requireWindowFocus, (prop) => {
    opts.requireWindowFocus(prop);
  });
  ifPresent(properties.browserAttachTimeout, (prop) => {
    opts.browserAttachTimeout(prop);
  });
  ifPresent(properties.forceCreateProcessApi, (prop) => {
    opts.forceCreateProcessApi(prop);
  });
  ifPresent(properties.arguments, (prop) => {
    opts.addArguments(...prop);
  });
  ifPresent(properties.usePerProcessProxy, (prop) => {
    opts.usePerProcessProxy(prop);
  });
  ifPresent(properties.ensureCleanSession, (prop) => {
    opts.ensureCleanSession(prop);
  });
  ifPresent(properties.logFile, (prop) => {
    opts.setLogFile(prop);
  });

  ifPresent(properties.host, (prop) => {
    opts.setHost(prop);
  });
  ifPresent(properties.extractPath, (prop) => {
    opts.setExtractPath(prop);
  });
  ifPresent(properties.silent, (prop) => {
    opts.silent(prop);
  });
  ifPresent(properties.proxy, (prop) => {
    opts.setProxy(prop);
  });

  return opts;
};
