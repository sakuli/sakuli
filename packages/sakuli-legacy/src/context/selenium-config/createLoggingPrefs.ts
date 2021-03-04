import { LogLevel, SimpleLogger } from "@sakuli/commons";
import { logging } from "selenium-webdriver";
import { Level } from "selenium-webdriver/lib/logging";

export function createLoggingPrefs(logger: SimpleLogger) {
  if (logger.logLevel === LogLevel.TRACE) {
    const loggingPreferences = new logging.Preferences();
    loggingPreferences.setLevel(logging.Type.DRIVER, Level.WARNING);
    loggingPreferences.setLevel(logging.Type.PERFORMANCE, Level.WARNING);
    loggingPreferences.setLevel(logging.Type.CLIENT, Level.WARNING);
    loggingPreferences.setLevel(logging.Type.BROWSER, Level.WARNING);
    loggingPreferences.setLevel(logging.Type.SERVER, Level.WARNING);
    return loggingPreferences;
  }
}
