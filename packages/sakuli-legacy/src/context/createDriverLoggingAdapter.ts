import { ThenableWebDriver } from "selenium-webdriver";
import { SimpleLogger } from "@sakuli/commons";
import setTimeoutUnref from "memfs/lib/setTimeoutUnref";
import { Entry, Level } from "selenium-webdriver/lib/logging";

export interface DriverLoggingAdapter {
  /**
   * Sets the drive to be connected to the logger
   * @param driver The webdriver to be connected
   */
  setDriver: (driver: ThenableWebDriver) => void;

  /**
   * Starts polling the driver interface for log messages and forwarding to sakuli logger
   */
  start: () => Promise<void>;

  /**
   * Stops polling the driver interface for log messages and forwarding to sakuli logger
   */
  stop: () => void;
}

export function createDriverLoggingAdapter(
  logger: SimpleLogger
): DriverLoggingAdapter {
  let driver: ThenableWebDriver;
  let IsPollingActivated = false;

  async function driverIsOpen(driverToCheck: ThenableWebDriver) {
    try {
      await driverToCheck.getCurrentUrl();
      return true;
    } catch (_) {
      return false;
    }
  }

  async function getLogsFromDriver() {
    const entries: Entry[] = [];
    if (driver && (await driverIsOpen(driver))) {
      const logs = driver.manage().logs();
      const types = await logs.getAvailableLogTypes();
      for (let logType of types) {
        const logEntries = await logs.get(logType);
        if (logEntries) {
          entries.push(...logEntries);
        }
      }
    }
    return entries;
  }

  function forwardEntriesToLogger(entries: Entry[]) {
    for (let entry of entries) {
      switch (entry.level) {
        case Level.SEVERE:
        case Level.WARNING:
        case Level.INFO:
        case Level.DEBUG:
          logger.debug(entry.message);
          break;
        case Level.FINE:
        case Level.FINER:
        case Level.FINEST:
          logger.trace(entry.message);
          break;
      }
    }
  }

  async function startPolling() {
    if (IsPollingActivated) {
      const entries = await getLogsFromDriver();
      forwardEntriesToLogger(entries);
      setTimeoutUnref(startPolling, 100);
    }
  }

  return {
    setDriver: (newDriver) => {
      driver = newDriver;
    },
    start: async () => {
      IsPollingActivated = true;
      await startPolling();
    },
    stop: () => {
      IsPollingActivated = false;
    },
  };
}
