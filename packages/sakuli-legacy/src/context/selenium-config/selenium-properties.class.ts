import {Maybe, Property, StringProperty} from "@sakuli/commons";
import {ProxyConfig} from "selenium-webdriver";
import {IPerfLoggingPrefs} from "selenium-webdriver/chrome";

export class SeleniumProperties {

    @Property('selenium.alertBehaviour')
    alertBehaviour: Maybe<string> = null;

    @Property('selenium.loggingPrefs')
    loggingPrefs: Maybe<IPerfLoggingPrefs> = null;

    @Property('selenium.proxy')
    proxy: Maybe<ProxyConfig> = null;

    @StringProperty('selenium.httpAgent')
    httpAgent: Maybe<string> = null;

    @StringProperty('selenium.server')
    server: Maybe<string> = null;

}