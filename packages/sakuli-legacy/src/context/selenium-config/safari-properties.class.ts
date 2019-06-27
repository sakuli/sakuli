import {Maybe, Property} from "@sakuli/commons";
import {logging} from "selenium-webdriver";
import Preferences = logging.Preferences;

export class SafariProperties {

    @Property("selenium.safari.loggingPrefs")
    loggingPrefs: Maybe<Preferences>;

}