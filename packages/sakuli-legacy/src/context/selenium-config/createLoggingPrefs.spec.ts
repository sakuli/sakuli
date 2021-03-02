import { logging } from "selenium-webdriver";
import { LogLevel, SimpleLogger } from "@sakuli/commons";
import { createLoggingPrefs } from "./createLoggingPrefs";

describe("create logging prefs", () => {
  it.each([
    [logging.Level.OFF, LogLevel.ERROR],
    [logging.Level.OFF, LogLevel.WARN],
    [logging.Level.OFF, LogLevel.INFO],
    [logging.Level.DEBUG, LogLevel.DEBUG],
    [logging.Level.ALL, LogLevel.TRACE],
  ])(
    "should configure driver log level to %s according to sakuli log level %s",
    (seleniumLogLevel, sakuliLogLevel) => {
      //GIVEN
      const loggerMock = new SimpleLogger(sakuliLogLevel);
      const expectedLoggingAspects = [
        "driver",
        "performance",
        "client",
        "browser",
        "server",
      ];

      //WHEN
      const preferences = createLoggingPrefs(loggerMock);

      //THEN
      expect(Array.from(preferences.prefs_.keys())).toStrictEqual(
        expectedLoggingAspects
      );
      preferences.prefs_.forEach((value) => {
        expect(value).toBe(seleniumLogLevel);
      });
    }
  );
});
