import { Options as FirefoxOptions } from "selenium-webdriver/firefox";
import { FirefoxProperties } from "./firefox-properties.class";
import { ifPresent } from "@sakuli/commons";

export const firefoxOptionsFactory = (properties: FirefoxProperties) => {
  const opts = new FirefoxOptions();

  ifPresent(properties.useGeckoDriver, (prop) => {
    opts.useGeckoDriver(prop);
  });

  ifPresent(properties.profile, (prop) => {
    opts.setProfile(prop);
  });

  ifPresent(properties.binary, (prop) => {
    opts.setBinary(prop);
  });

  ifPresent(properties.proxy, (prop) => {
    opts.setProxy(prop);
  });

  return opts;
};
