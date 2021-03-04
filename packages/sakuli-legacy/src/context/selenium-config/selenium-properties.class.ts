import { Maybe, Property, StringProperty } from "@sakuli/commons";
import { ProxyConfig } from "selenium-webdriver";
import * as logging from "selenium-webdriver/lib/logging";

export class SeleniumProperties {
  @Property("selenium.alertBehaviour")
  alertBehaviour: Maybe<string> = null;

  @Property("selenium.loggingPrefs")
  loggingPrefs: Maybe<logging.Preferences> = null;

  @Property("selenium.proxy")
  proxy: Maybe<ProxyConfig> = null;

  @StringProperty("selenium.httpAgent")
  httpAgent: Maybe<string> = null;

  @StringProperty("selenium.server")
  server: Maybe<string> = null;
}
