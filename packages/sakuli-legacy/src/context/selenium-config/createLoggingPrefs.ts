import { LogLevel, SimpleLogger } from "@sakuli/commons";
import { logging } from "selenium-webdriver";
import { Level } from "selenium-webdriver/lib/logging";

function createPreferences(logLevel: Level) {
  const loggingPreferences = new logging.Preferences();
  loggingPreferences.setLevel(logging.Type.DRIVER, logLevel);
  loggingPreferences.setLevel(logging.Type.PERFORMANCE, logLevel);
  loggingPreferences.setLevel(logging.Type.CLIENT, logLevel);
  loggingPreferences.setLevel(logging.Type.BROWSER, logLevel);
  loggingPreferences.setLevel(logging.Type.SERVER, logLevel);
  return loggingPreferences;
}

export function createLoggingPrefs(logger: SimpleLogger) {
  switch (logger.logLevel) {
    case LogLevel.TRACE:
      return createPreferences(logging.Level.ALL);
    case LogLevel.DEBUG:
      return createPreferences(logging.Level.DEBUG);
    case LogLevel.INFO:
    case LogLevel.WARN:
    case LogLevel.ERROR:
      return createPreferences(logging.Level.OFF);
  }
}
