import { ThenableWebDriver } from "selenium-webdriver";
import { LogLevel, Maybe, SimpleLogger } from "@sakuli/commons";
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
  let driver: Maybe<ThenableWebDriver>;
  let IsPollingActivated = false;
  let loggingAdapterTimeout: NodeJS.Timeout;

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
      try {
        const logs = driver.manage().logs();
        const types = await logs.getAvailableLogTypes();
        for (let logType of types) {
          const logEntries = await logs.get(logType);
          if (logEntries) {
            entries.push(...logEntries);
          }
        }
      } catch (e) {
        logger.trace(`Could not get logs from driver.`, e);
      }
    }
    return entries;
  }

  function forwardEntriesToLogger(entries: Entry[]) {
    for (let entry of entries) {
      switch (entry.level) {
        case Level.SEVERE:
        case Level.WARNING:
          logger.trace(`[WEB-DRIVER][${entry.level}]: ${entry.message}`);
          break;
      }
    }
  }

  async function startPolling() {
    if (loggingAdapterTimeout) {
      clearTimeout(loggingAdapterTimeout);
    }
    if (IsPollingActivated) {
      const entries = await getLogsFromDriver();
      forwardEntriesToLogger(entries);
      loggingAdapterTimeout = global.setTimeout(startPolling, 100);
      loggingAdapterTimeout.unref();
    }
  }

  return {
    setDriver: (newDriver) => {
      driver = newDriver;
    },
    start: async () => {
      if (logger.logLevel === LogLevel.TRACE) {
        IsPollingActivated = true;
        await startPolling();
      }
    },
    stop: () => {
      IsPollingActivated = false;
      driver = undefined;
      if (loggingAdapterTimeout) {
        clearTimeout(loggingAdapterTimeout);
      }
    },
  };
}
